import '@/services/base/axios';

import { createRulesPlugin } from 'vuetify/labs/rules';

import type { App } from 'vue';

// Registro do PWA em modo AutoUpdate manual pra não depender exclusivamente do manifest no dev/docker.
import { registerSW } from 'virtual:pwa-register';

import router from '@/router';

import { i18n } from './i18n';
import { pinia } from './pinia';
import vuetify from './vuetify';

export { pinia } from './pinia';

export function registerPlugins(pApp: App) {
  pApp.use(pinia);
  pApp.use(router);
  pApp.use(i18n);
  pApp.use(vuetify);
  pApp.use(createRulesPlugin({}, vuetify.locale));

  // Tenta registrar o SW assim que os plugins iniciam
  registerSW({ immediate: true });
}
