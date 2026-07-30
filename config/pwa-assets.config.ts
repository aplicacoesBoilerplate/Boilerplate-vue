/**
 * Plugin do vite para gerar assets do PWA - instalar pelo cmd: npm install -D @vite-pwa/assets-generator
 * Configurar em package.json: "generate-pwa-assets": "pwa-assets-generator"
 * gerar assets pelo cmd: npm run generate-pwa-assets
 */
import { defineConfig, minimal2023Preset as preset } from '@vite-pwa/assets-generator/config';

export default defineConfig({
  preset,
  images: ['public/favicon.png'],
});
