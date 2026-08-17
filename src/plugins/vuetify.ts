import 'vuetify/styles';
import '@/styles/vuetify-v3-compat.scss';
import '@mdi/font/css/materialdesignicons.css';

import { useI18n } from 'vue-i18n';
import { createVuetify } from 'vuetify';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import { VMaskInput } from 'vuetify/labs/VMaskInput';
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n';

import { i18n } from './i18n';

export default createVuetify({
  display: {
    thresholds: {
      md: 960,
      lg: 1280,
      xl: 1920,
      xxl: 2560,
    },
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      light: {
        colors: {
          background: '#FAFAFB',
          surface: '#FFFFFF',
          primary: '#3F51B5',
          'on-primary': '#FFFFFF',
          secondary: '#7986CB',
          'on-secondary': '#0F1117',
          error: '#EF5350',
          'on-error': '#0F1117',
          info: '#42A5F5',
          'on-info': '#0F1117',
          success: '#66BB6A',
          'on-success': '#0F1117',
          warning: '#FFA726',
          'on-warning': '#0F1117',
        },
      },
      dark: {
        colors: {
          background: '#0f1117',
          surface: '#1a1d27',
          primary: '#7986CB',
          'on-primary': '#0F1117',
          secondary: '#9FA8DA',
          'on-secondary': '#0F1117',
          error: '#EF5350',
          'on-error': '#0F1117',
          info: '#42A5F5',
          'on-info': '#0F1117',
          success: '#66BB6A',
          'on-success': '#0F1117',
          warning: '#FFA726',
          'on-warning': '#0F1117',
        },
      },
    },
  },
  components: {
    VMaskInput,
  },
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n }),
  },
});
