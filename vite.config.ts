import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import vuetify from 'vite-plugin-vuetify'
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
