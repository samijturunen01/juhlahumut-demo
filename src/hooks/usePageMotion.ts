import type { RefObject } from 'react';
import { gsap, motionOk, ScrollTrigger, useGSAP } from '@/lib/gsap';

/**
 * Scroll-driven reveals for a whole page, driven by data attributes so page
 * components stay declarative:
 *
 *   data-reveal="up"    fade + rise            (text blocks, panels)
 *   data-reveal="fade"  fade only
 *   data-reveal="mask"  photographic wipe: the frame unmasks from the top
 *                       while the image settles from a slight zoom
 *   data-reveal="rule"  a hairline drawing itself from the left
 *   data-reveal-delay   seconds, to sequence siblings
 *   data-parallax="0.12" gentle vertical drift relative to scroll (desktop only)
 *
 * Initial (hidden) states live in CSS under `html.motion-ok`, so without JS or
 * with reduced motion nothing is ever hidden. Every reveal plays once.
 */
export function usePageMotion(scope: RefObject<HTMLElement | null>, pageKey: string) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root || !motionOk()) return;

      const done = (el: Element) => {
        el.classList.add('is-revealed');
        gsap.set(el, { clearProps: 'opacity,transform,clipPath' });
      };

      const delayOf = (el: Element) => Number((el as HTMLElement).dataset.revealDelay ?? 0);

      ScrollTrigger.batch(root.querySelectorAll('[data-reveal="up"], [data-reveal="fade"]'), {
        start: 'top 90%',
        once: true,
        onEnter: (batch) => {
          batch.forEach((el, i) => {
            gsap.to(el, {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: 'power3.out',
              delay: delayOf(el) + i * 0.07,
              onComplete: () => done(el),
            });
          });
        },
      });

      root.querySelectorAll<HTMLElement>('[data-reveal="mask"]').forEach((el) => {
        const img = el.querySelector('img');
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          delay: delayOf(el),
          onComplete: () => {
            done(el);
            if (img) gsap.set(img, { clearProps: 'transform' });
          },
        });
        tl.to(el, { clipPath: 'inset(0 0 0% 0)', duration: 1.25, ease: 'expo.out' }, 0);
        if (img) tl.to(img, { scale: 1, duration: 1.6, ease: 'expo.out' }, 0);
      });

      root.querySelectorAll<HTMLElement>('[data-reveal="rule"]').forEach((el) => {
        gsap.to(el, {
          scaleX: 1,
          duration: 1.3,
          ease: 'expo.out',
          delay: delayOf(el),
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
          onComplete: () => done(el),
        });
      });

      // Parallax is a desktop nicety; on touch devices it tends to fight the scroll.
      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px) and (hover: hover)', () => {
        root.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
          const amount = Number(el.dataset.parallax ?? 0.1);
          gsap.fromTo(
            el,
            { yPercent: amount * 50 },
            {
              yPercent: -amount * 50,
              ease: 'none',
              scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
            },
          );
        });
      });

      // Images above may still be loading; re-measure once they have settled.
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener('load', refresh, { once: true });
      const t = window.setTimeout(refresh, 600);
      return () => {
        window.removeEventListener('load', refresh);
        window.clearTimeout(t);
      };
    },
    { scope, dependencies: [pageKey], revertOnUpdate: true },
  );
}
