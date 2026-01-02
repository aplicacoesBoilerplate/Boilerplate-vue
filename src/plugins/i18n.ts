import { createI18n } from 'vue-i18n'
import { pt, en, es } from 'vuetify/locale'
import ptBrMessages from '../locales/pt.json'
import enUsMessages from '../locales/en.json'
import esEsMessages from '../locales/es.json'

function mergeMessages(vuetifyMessages: any, customMessages: any) {
  const { $vuetify: customVuetify, ...appMessages } = customMessages
  return {
    ...appMessages,
    $vuetify: {
      ...vuetifyMessages,
      ...(customVuetify || {})
    }
  }
}

const messages = {
  pt: mergeMessages(pt, ptBrMessages),
  en: mergeMessages(en, enUsMessages),
  es: mergeMessages(es, esEsMessages),
}

export const i18n = createI18n({
  legacy: false,
  locale: 'pt',
  fallbackLocale: 'en',
  messages,
})
