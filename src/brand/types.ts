/** Shared props for the two interchangeable brand-art implementations (authentic / fallback). */
export interface LogoFullProps {
  /** Unique id prefix – each instance owns one SVG mask. */
  id: string;
  className?: string;
  title?: string;
  decorative?: boolean;
}

export interface LogoScriptProps {
  className?: string;
  title?: string;
  decorative?: boolean;
}
