import { StorageUtils } from '@/utils/StorageUtils'
import { availableLocales } from '@/locales/AvailableLocales'
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

export const FALLBACK_LOCALE = 'pt-BR'

const messages = {
  'pt-BR': mergeMessages(pt, ptBrMessages),
  'en-US': mergeMessages(en, enUsMessages),
  'es-ES': mergeMessages(es, esEsMessages),
}

function initLocaleDefault(): string {
  const savedLocale = StorageUtils.get<string>('user_locale')
  const supportedLocales = availableLocales.map(l => l.value)

  if (savedLocale && supportedLocales.includes(savedLocale)) {
    return savedLocale
  }

  return navigator.language || FALLBACK_LOCALE
}

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: initLocaleDefault(),
  fallbackLocale: FALLBACK_LOCALE,
  messages,
})
