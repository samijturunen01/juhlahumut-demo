import type { RefObject } from 'react';
import { fullBox, scriptBox, sweep } from '@brand-art';
import { gsap, motionOk, ScrollTrigger, useGSAP } from '@/lib/gsap';

const SESSION_KEY = 'jh-intro';

/**
 * "Ilta syttyy" – the signature homepage intro (about 3 seconds, once per session).
 *
 * The idea comes straight from the logo, which is a neon sign over a city at dusk:
 *
 *   1. The room is dark. The real venue photograph is already on screen, just unlit.
 *   2. Dusk: the amber disc glows up and the skyline rises in front of it.
 *      Its windows come on one by one.
 *   3. The neon sign is switched on – current runs through the script from left to
 *      right, it flickers once, and holds.
 *   4. The light of the sign spreads across the room: the photograph is revealed
 *      from the logo outwards, as if the venue's lights had just been turned on.
 *   5. The script detaches and lands as the wordmark in the header, while the
 *      headline and calls to action rise into place.
 *
 * It never blocks: navigation is usable from the first frame, the photograph (the
 * LCP element) is painted immediately, and any scroll, key press or touch jumps
 * straight to the end. With prefers-reduced-motion it does not run at all.
 */
export function useHeroIntro(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const html = document.documentElement;
      const root = scope.current;
      if (!root) return;

      const leave = () => html.classList.remove('intro-pending');
      if (!motionOk() || !html.classList.contains('intro-pending')) {
        leave();
        return;
      }

      const stage = root.querySelector<HTMLElement>('[data-intro="stage"]');
      const stageSvg = stage?.querySelector('svg');
      const mark = document.querySelector<HTMLElement>('[data-intro="mark"]');
      const markSvg = mark?.querySelector('svg');
      if (!stage || !stageSvg || !mark || !markSvg) {
        leave();
        return;
      }

      const dim = root.querySelector<HTMLElement>('[data-intro="dim"]');
      const aside = root.querySelectorAll<HTMLElement>('[data-intro="aside"]');
      const copy = root.querySelectorAll<HTMLElement>('[data-intro="copy"] > *');
      const glow = stage.querySelector<HTMLElement>('[data-intro="glow"]');
      const disc = stage.querySelectorAll('[data-logo="disc"]');
      const skyline = stage.querySelectorAll('[data-logo="skyline"]');
      const windows = stage.querySelectorAll('[data-logo="window"]');
      const script = stage.querySelector('[data-logo="script"]');
      const sweepRect = stage.querySelector('[data-logo="sweep"]');

      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        leave();
        try {
          sessionStorage.setItem(SESSION_KEY, '1');
        } catch {
          /* private mode – the intro simply plays again next time */
        }
        gsap.set(stage, { display: 'none' });
        gsap.set([mark, dim, ...aside, ...copy], { clearProps: 'all' });
        ScrollTrigger.refresh();
      };

      /** Where the stage must go so that its script lands exactly on the header wordmark. */
      const landing = () => {
        const from = stage.getBoundingClientRect();
        const to = markSvg.getBoundingClientRect();
        const scale = to.width / ((from.width * scriptBox.width) / fullBox.width);
        return {
          scale,
          x: to.left - from.left - scale * from.width * (scriptBox.x / fullBox.width),
          y: to.top - from.top - scale * from.height * (scriptBox.y / fullBox.height),
        };
      };
      let target = { x: 0, y: 0, scale: 1 };

      gsap.set(stage, { autoAlpha: 1, x: 0, y: 0, scale: 1, transformOrigin: '0 0' });
      gsap.set(mark, { autoAlpha: 0 });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: finish });

      // 2 — dusk
      tl.fromTo(glow, { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 1.3, ease: 'power2.out' }, 0)
        .fromTo(
          disc,
          { autoAlpha: 0, scale: 0.84, rotation: -6, svgOrigin: `${fullBox.width / 2} ${fullBox.height * 0.66}` },
          { autoAlpha: 1, scale: 1, rotation: 0, duration: 1.1, ease: 'expo.out' },
          0.08,
        )
        .fromTo(skyline, { autoAlpha: 0, y: 54 }, { autoAlpha: 1, y: 0, duration: 0.95, ease: 'expo.out' }, 0.26)
        .fromTo(windows, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.04, stagger: { each: 0.11, from: 'random' } }, 0.8);

      // 3 — the sign is switched on
      tl.fromTo(sweepRect, { attr: { x: sweep.hiddenX } }, { attr: { x: sweep.shownX }, duration: 0.95, ease: 'power2.inOut' }, 0.72).to(
        script,
        {
          keyframes: [
            { opacity: 0.3, duration: 0.05 },
            { opacity: 1, duration: 0.05 },
            { opacity: 0.55, duration: 0.04 },
            { opacity: 1, duration: 0.09 },
          ],
          ease: 'none',
        },
        1.62,
      );

      // 4 — its light fills the room
      if (dim) tl.fromTo(dim, { '--light': '0%' }, { '--light': '175%', duration: 1.2, ease: 'power2.inOut' }, 1.5);

      // 5 — the script lands in the header, the page takes over
      tl.add(() => {
        target = landing();
      }, 1.98)
        .to([...disc, ...skyline, glow], { autoAlpha: 0, duration: 0.5, ease: 'power2.in' }, 2.0)
        .to(
          stage,
          { x: () => target.x, y: () => target.y, scale: () => target.scale, duration: 0.95, ease: 'power3.inOut' },
          2.0,
        )
        .fromTo(copy, { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: 1.05, stagger: 0.085 }, 2.12)
        .fromTo(aside, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1 }, 2.45)
        .set(mark, { autoAlpha: 1 }, 2.95)
        .to(stage, { autoAlpha: 0, duration: 0.18, ease: 'none' }, 2.95);

      // Never make anyone wait: any intent to move on completes the intro at once.
      const skip = () => tl.progress(1);
      // Mobile browsers fire scroll/resize on their own while loading (URL bar, scroll restoration),
      // so only real movement counts: an actual scroll offset, or a genuine change of width.
      const startWidth = window.innerWidth;
      const onScroll = () => window.scrollY > 8 && skip();
      const onResize = () => Math.abs(window.innerWidth - startWidth) > 40 && skip();
      const opts: AddEventListenerOptions = { passive: true, once: true };
      window.addEventListener('wheel', skip, opts);
      window.addEventListener('touchmove', skip, opts);
      window.addEventListener('keydown', skip, opts);
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onResize, { passive: true });

      return () => {
        window.removeEventListener('wheel', skip);
        window.removeEventListener('touchmove', skip);
        window.removeEventListener('keydown', skip);
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
        // If the visitor navigated away mid-intro, release the held states so the header mark is
        // visible on the next page. (Checked a tick later: React's StrictMode re-runs effects on
        // mount, and in that case the hero is still in the document and the intro simply restarts.)
        window.setTimeout(() => {
          if (!root.isConnected) leave();
        }, 0);
      };
    },
    { scope },
  );
}
