import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import vuetify from 'vite-plugin-vuetify';
import { VitePWA } from 'vite-plugin-pwa';
import { execSync } from 'child_process';
import { fileURLToPath, URL } from 'node:url';

let lastCommitDate = '';
try {
  lastCommitDate = execSync('git log -1 --format=%cI').toString().trim();
} catch {
  lastCommitDate = new Date().toISOString();
}

/**
 * @description Para saber mais sobre as configurações do vite, acesse: https://vite.dev/config/
 * @property {} server - Configurações do servidor vite durante a execução da aplicação compilada em dev.
 * @property {} server.allowedHosts - Origens confiáveis para a aplicação responder.
 * @property {} server.watch - Configurações para o watcher de mudanças na aplicação durante o processo de execução em dev.
 */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiProxyTarget = env.VITE_API_PROXY_TARGET || 'http://localhost:8080';

  return {
    cacheDir: mode === 'test' ? 'node_modules/.vite-e2e-no-discovery' : 'node_modules/.vite',
    server: {
      allowedHosts: ['host.docker.internal'],
      proxy: {
        '/api': {
          target: apiProxyTarget,
          changeOrigin: true,
        },
        '/actuator': {
          target: apiProxyTarget,
          changeOrigin: true,
        },
      },
      watch: {
        ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/dev-dist/**'],
      },
    },
    optimizeDeps: mode === 'test'
      ? {
          noDiscovery: true,
          include: [],
        }
      : {
          include: [
            'vuetify/components/VOverlay',
            'vuetify/components/VDialog',
            'vuetify/components/VMenu',
            'vuetify/components/VSelect',
            'vuetify/components/VTooltip',
          ],
        },
    plugins: [
      vue(),
      // vueDevTools(), // Ativar o DevTools somente quando necessário utilizar.
      vuetify({
        autoImport: true,
        styles: {
          configFile: 'src/styles/vuetify-settings.scss',
        },
      }),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        includeAssets: ['favicon.ico', 'pwa-192x192.png', 'pwa-512x512.png'],
        manifest: {
          name: 'Boilerplate App',
          short_name: 'Boilerplate',
          description: 'Aplicacao Boilerplate Frontend.',
          theme_color: '#0f1117',
          background_color: '#0f1117',
          display: 'standalone',
          start_url: '/',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],
        },
        workbox: {
          navigateFallback: '/index.html',
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    define: {
      __APP_BUILD_DATE__: JSON.stringify(lastCommitDate),
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    base: '/',
  };
});
