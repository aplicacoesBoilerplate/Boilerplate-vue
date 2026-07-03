/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />
interface Window {
  env: {
    VITE_API_URL: string
    VITE_DOMAIN_EMAIL?: string
  }
}

interface ImportMetaEnv {
  readonly VITE_DOMAIN_EMAIL?: string
}

declare const __APP_BUILD_DATE__: string
