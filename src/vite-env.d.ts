/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_QUOTE_TRANSPORT?: 'mock' | 'apps-script';
  readonly VITE_QUOTE_ENDPOINT?: string;
  readonly VITE_RECAPTCHA_SITE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '@fontsource-variable/*';
