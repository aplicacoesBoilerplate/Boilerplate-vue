import { createI18n } from 'vue-i18n'
import { pt, en, es } from 'vuetify/locale'

import ptBrMessages from '../locales/pt.json'
import enUsMessages from '../locales/en.json'
import esEsMessages from '../locales/es.json'

const messages = {
  pt: {
    $vuetify: { ...pt },
    ...ptBrMessages
  },
  en: {
    $vuetify: { ...en },
    ...enUsMessages
  },
  es: {
    $vuetify: { ...es },
    ...esEsMessages
  }
}

export const i18n = createI18n({
  legacy: false,
  locale: 'pt',
  fallbackLocale: 'en',
  messages,
})
