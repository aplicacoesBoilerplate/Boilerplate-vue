import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

import { useI18n } from 'vue-i18n';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import { VDateInput } from 'vuetify/labs/VDateInput';
import { VHotkey } from 'vuetify/labs/VHotkey';
import { VIconBtn } from 'vuetify/labs/VIconBtn';
import { VMaskInput } from 'vuetify/labs/VMaskInput';
import { VPie } from 'vuetify/labs/VPie';
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n';

import { i18n } from './i18n';

export default createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      light: {
        colors: {
          background: '#FAFAFB',
          surface: '#FFFFFF',
          primary: '#3F51B5',
          secondary: '#7986CB',
          error: '#EF5350',
          info: '#42A5F5',
          success: '#66BB6A',
          warning: '#FFA726',
        },
      },
      dark: {
        colors: {
          background: '#0f1117',
          surface: '#1a1d27',
          primary: '#5C6BC0',
          secondary: '#9FA8DA',
          error: '#EF5350',
          info: '#42A5F5',
          success: '#66BB6A',
          warning: '#FFA726',
        },
      },
    },
  },
  components: {
    ...components,
    VDateInput,
    VHotkey,
    VIconBtn,
    VPie,
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
