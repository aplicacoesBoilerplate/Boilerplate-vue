import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import vuetify from 'vite-plugin-vuetify'
import { VitePWA } from 'vite-plugin-pwa'
import Unfonts from 'unplugin-fonts/vite'
import { execSync } from 'child_process'
import { fileURLToPath, URL } from 'node:url'

let lastCommitDate = ''
try {
  lastCommitDate = execSync('git log -1 --format=%cI').toString().trim()
} catch (e) {
  lastCommitDate = new Date().toISOString()
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    vuetify({
      autoImport: true,
    }),
    Unfonts({
      google: {
        families: [
          {
            name: 'Roboto',
            styles: 'wght@300;400;500;700',
          },
        ],
      },
    }),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.png'],
      manifest: {
        name: 'Boilerplate App',
        short_name: 'Boilerplate',
        description: 'Aplicacao Boilerplate Frontend.',
        theme_color: '#FAFAFB',
        background_color: '#FAFAFB',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: './favicon.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: './favicon.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: './favicon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        navigateFallback: '/index.html',
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    }),
  ],
  define: {
    '__APP_BUILD_DATE__': JSON.stringify(lastCommitDate)
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  base: '/',
})
