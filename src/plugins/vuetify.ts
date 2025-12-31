import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { VHotkey } from 'vuetify/labs/VHotkey'
import { VIconBtn } from 'vuetify/labs/VIconBtn'
import { VPie } from 'vuetify/labs/VPie'
import { VMaskInput } from 'vuetify/labs/VMaskInput'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { pt } from 'vuetify/locale'

export default createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      light: {
        colors: {
          primary: '#1867C0',
          secondary: '#5CBBF6',
        },
      },
      dark: {
        colors: {
          primary: '#2196F3',
          secondary: '#424242',
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
    VMaskInput
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
    locale: 'pt',
    messages: { pt },
  },
})
