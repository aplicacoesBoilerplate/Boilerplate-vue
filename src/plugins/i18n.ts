import { StorageUtils } from '@/utils/StorageUtils'
import ptBrMessages from '../locales/pt.json'
import enUsMessages from '../locales/en.json'
import esEsMessages from '../locales/es.json'
import { pt, en, es } from 'vuetify/locale'
import { createI18n } from 'vue-i18n'

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

const savedLocale = StorageUtils.get<string>('user_locale', 'local');
const browserLocale = navigator.language || 'pt-BR';

export const i18n = createI18n({
  legacy: false,
  locale: savedLocale || browserLocale,
  fallbackLocale: 'en',
  messages,
})
