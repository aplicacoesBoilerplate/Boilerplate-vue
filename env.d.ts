/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />
interface Window {
  env: {
    VITE_API_URL: string
  }
}

declare const __APP_BUILD_DATE__: string
