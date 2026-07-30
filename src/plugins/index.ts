import '@/services/base/axios';

import { createPinia } from 'pinia';
import { createRulesPlugin } from 'vuetify/labs/rules';

import type { App } from 'vue';

// Registro do PWA em modo AutoUpdate manual pra não depender exclusivamente do manifest no dev/docker.
import { registerSW } from 'virtual:pwa-register';

import router from '@/router';

import { i18n } from './i18n';
import vuetify from './vuetify';

export function registerPlugins(app: App) {
  app.use(createPinia());
  app.use(router);
  app.use(i18n);
  app.use(vuetify);
  app.use(createRulesPlugin({}, vuetify.locale));

  // Tenta registrar o SW assim que os plugins iniciam
  registerSW({ immediate: true });
}
