import type { App } from 'vue';
import vuetify from './vuetify';
import { createRulesPlugin } from 'vuetify/labs/rules';
import { createPinia } from 'pinia';
import router from '@/router';
import { i18n } from './i18n';
import '@/services/axios';

export function registerPlugins(app: App) {
  app.use(createPinia());
  app.use(router);
  app.use(i18n);
  app.use(vuetify);
  app.use(createRulesPlugin({}, vuetify.locale));
}
