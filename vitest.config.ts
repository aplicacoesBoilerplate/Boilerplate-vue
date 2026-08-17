import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    include: ['tests/unit/**/*.spec.ts'],
    environment: 'happy-dom',
    setupFiles: ['./tests/unit/setup.ts'],
    clearMocks: true,
    restoreMocks: true,
    pool: 'forks',
    maxWorkers: 1,
    watch: false,
  },
});
