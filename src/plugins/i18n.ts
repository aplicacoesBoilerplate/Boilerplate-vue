// Ecossistema Vue
import { createI18n } from 'vue-i18n';

// Locales
import { en, es, pt } from 'vuetify/locale';
import { availableLocales } from '@/locales/AvailableLocales';
import enUsMessages from '../locales/en.json';
import esEsMessages from '../locales/es.json';
import ptBrMessages from '../locales/pt.json';

// Utils
import { ClassManagerStorage } from '@/utils/ManagerStorage';

/**
 * @description Método que mescla as mensagens de tradução.
 *
 * @param vuetifyMessages Mensagens de tradução do Vuetify.
 * @param customMessages Mensagens de tradução customizadas.
 * @returns Mensagens de tradução mescladas.
 */
function mergeMessages(vuetifyMessages: any, customMessages: any) {
  const { $vuetify: customVuetify, ...appMessages } = customMessages;
  return {
    ...appMessages,
    $vuetify: {
      ...vuetifyMessages,
      ...(customVuetify || {}),
    },
  };
}

// Constantes
export const FALLBACK_LOCALE = 'pt-BR';

// Configurações do I18n
const messages = {
  'pt-BR': mergeMessages(pt, ptBrMessages),
  'en-US': mergeMessages(en, enUsMessages),
  'es-ES': mergeMessages(es, esEsMessages),
};

/**
 * Método que inicia o locale padrão.
 * @returns Locale padrão.
 */
function initLocaleDefault(): string {
  const savedLocale = ClassManagerStorage.get<string>('user_locale', '', 'local');
  const supportedLocales = availableLocales.map((l) => l.value);

  if (savedLocale && supportedLocales.includes(savedLocale)) {
    return savedLocale;
  }

  return navigator.language || FALLBACK_LOCALE;
}

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: initLocaleDefault(),
  fallbackLocale: FALLBACK_LOCALE,
  messages,
});
