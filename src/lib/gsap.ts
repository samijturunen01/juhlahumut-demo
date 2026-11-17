import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  gsap.defaults({ ease: 'power3.out', duration: 0.9 });
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/** True when the pre-paint script in index.html decided motion is allowed. */
export const motionOk = (): boolean => typeof document !== 'undefined' && document.documentElement.classList.contains('motion-ok');

export { gsap, ScrollTrigger, useGSAP };
