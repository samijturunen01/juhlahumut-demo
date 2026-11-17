/**
 * Authentic Juhlahumut logo, as layered vector artwork.
 *
 * The geometry is derived from the company's original logo bitmap by
 * scripts/build-logo.mjs (see that file for the method). It is rendered ONCE
 * per page as a hidden sprite; every visible logo is a handful of <use>
 * references, so each instance can be animated layer by layer while the heavy
 * path data exists a single time in the document.
 *
 * This folder is the only place the logo artwork lives. If the right to
 * republish the logo is not confirmed, remove the folder (or build with
 * VITE_BRAND_LOGO=wordmark) and the site falls back to ../fallback/LogoArt.tsx.
 */
import { logoGeometry as g } from './logoGeometry';
import type { LogoFullProps, LogoScriptProps } from '../types';

export const hasAuthenticLogo = true;

const { disc, script } = g;
const VB = g.viewBox;

/** viewBox of the script-only wordmark, with room for the neon glow. */
const PAD = 14;
export const scriptBox = {
  x: script.bounds.x - PAD,
  y: script.bounds.y - PAD,
  width: script.bounds.width + PAD * 2,
  height: script.bounds.height + PAD * 2,
};
export const fullBox = { width: VB.width, height: VB.height };

/** Extra width of the soft leading edge of the "current" that lights the tube. */
const SWEEP_FADE = 190;
export const sweep = { width: VB.width + SWEEP_FADE, hiddenX: -(VB.width + SWEEP_FADE), shownX: 0 };

export function LogoSprite() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
      <defs>
        <linearGradient
          id="jh-disc-fill"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1={disc.gradient.y1}
          x2="0"
          y2={disc.gradient.y2}
          gradientTransform={`rotate(${-disc.rotate} ${disc.cx} ${disc.cy})`}
        >
          {disc.gradient.stops.map((s) => (
            <stop key={s.offset} offset={s.offset} stopColor={s.color} />
          ))}
        </linearGradient>
        <linearGradient id="jh-sweep-fill" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" />
          <stop offset={1 - SWEEP_FADE / sweep.width} stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>

        <g id="jh-disc" transform={`rotate(${disc.rotate} ${disc.cx} ${disc.cy})`}>
          <ellipse cx={disc.cx} cy={disc.cy} rx={disc.rx - disc.outline} ry={disc.ry - disc.outline} fill="#000" />
          <ellipse
            cx={disc.cx}
            cy={disc.cy}
            rx={disc.rx - disc.outline - disc.ring}
            ry={disc.ry - disc.outline - disc.ring}
            fill="url(#jh-disc-fill)"
          />
        </g>
        <g id="jh-disc-outline" transform={`rotate(${disc.rotate} ${disc.cx} ${disc.cy})`}>
          <ellipse cx={disc.cx} cy={disc.cy} rx={disc.rx} ry={disc.ry} fill="#fff" />
        </g>
        <path id="jh-skyline" d={g.skylinePath} />
        <g id="jh-script">
          <path d={script.bodyPath} fill={script.red} fillRule="evenodd" />
          <path d={script.corePath} fill="#fff" fillRule="evenodd" />
        </g>
      </defs>
    </svg>
  );
}

/** The complete mark: amber disc, skyline with lit windows, neon script. */
export function LogoFull({ className, title = 'Juhlahumut', decorative = false, id }: LogoFullProps) {
  const maskId = `${id}-sweep`;
  return (
    <svg
      className={className}
      viewBox={`0 0 ${VB.width} ${VB.height}`}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : title}
      aria-hidden={decorative ? true : undefined}
      focusable="false"
      overflow="visible"
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={VB.width} height={VB.height}>
          <rect data-logo="sweep" x={sweep.shownX} y="0" width={sweep.width} height={VB.height} fill="url(#jh-sweep-fill)" />
        </mask>
      </defs>
      <g data-logo="disc">
        <use href="#jh-disc-outline" />
      </g>
      <g data-logo="skyline">
        <use href="#jh-skyline" fill="#fff" stroke="#fff" strokeWidth={disc.outline * 2} strokeLinejoin="miter" />
      </g>
      <g data-logo="disc">
        <use href="#jh-disc" />
      </g>
      <g data-logo="skyline">
        <use href="#jh-skyline" fill="#000" />
        {g.windows.map((w) => (
          <rect key={`${w.x}-${w.y}`} data-logo="window" x={w.x} y={w.y} width={w.w} height={w.h} fill="#f47b20" />
        ))}
      </g>
      <g mask={`url(#${maskId})`}>
        <g data-logo="script" className="neon-glow">
          <use href="#jh-script" />
        </g>
      </g>
    </svg>
  );
}

/** The neon script on its own – used as the compact wordmark in the header. */
export function LogoScript({ className, title = 'Juhlahumut', decorative = false }: LogoScriptProps) {
  return (
    <svg
      className={className}
      viewBox={`${scriptBox.x} ${scriptBox.y} ${scriptBox.width} ${scriptBox.height}`}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : title}
      aria-hidden={decorative ? true : undefined}
      focusable="false"
      overflow="visible"
    >
      <use href="#jh-script" />
    </svg>
  );
}
