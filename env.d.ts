/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />
interface Window {
  env?: {
    VITE_API_URL?: string;
    VITE_DOMAIN_EMAIL?: string;
    VITE_GOOGLE_CLIENT_ID?: string;
  };
}

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_DOMAIN_EMAIL?: string;
  readonly VITE_GOOGLE_CLIENT_ID?: string;
}

declare const APP_BUILD_DATE: string;
