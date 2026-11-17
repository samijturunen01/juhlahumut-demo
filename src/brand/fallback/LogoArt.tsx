/**
 * Neutral fallback brand art.
 *
 * Used automatically when the authentic logo folder (../authentic) is not part
 * of the build – for example while the right to republish the company's logo
 * is still unconfirmed. It contains NO logo artwork: only the company name set
 * in the site's display typeface, and a plain amber disc. It exposes the same
 * layers and data attributes as the authentic art, so the intro animation and
 * every layout work unchanged.
 */
import type { LogoFullProps, LogoScriptProps } from '../types';

export const hasAuthenticLogo = false;

const VB = { width: 888, height: 596 };
export const fullBox = VB;
export const scriptBox = { x: 20, y: 286, width: 848, height: 196 };

const SWEEP_FADE = 190;
export const sweep = { width: VB.width + SWEEP_FADE, hiddenX: -(VB.width + SWEEP_FADE), shownX: 0 };

const wordmarkStyle = {
  fontFamily: "'Fraunces Variable', Georgia, serif",
  fontStyle: 'italic' as const,
  fontWeight: 300,
  letterSpacing: '-0.03em',
};

function Wordmark() {
  return (
    <text x={VB.width / 2} y={432} textAnchor="middle" fontSize={176} fill="#fff6ee" style={wordmarkStyle}>
      Juhlahumut
    </text>
  );
}

export function LogoSprite() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
      <defs>
        <linearGradient id="jh-disc-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe9d2" />
          <stop offset="1" stopColor="#f47b20" />
        </linearGradient>
        <linearGradient id="jh-sweep-fill" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" />
          <stop offset={1 - SWEEP_FADE / sweep.width} stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

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
        <ellipse cx="444" cy="380" rx="330" ry="104" fill="url(#jh-disc-fill)" transform="rotate(-23.65 444 380)" opacity="0.92" />
      </g>
      <g mask={`url(#${maskId})`}>
        <g data-logo="script" className="neon-glow">
          <Wordmark />
        </g>
      </g>
    </svg>
  );
}

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
      <Wordmark />
    </svg>
  );
}
