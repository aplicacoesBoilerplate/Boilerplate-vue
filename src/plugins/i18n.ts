// Ecossistema Vue
import { createI18n } from 'vue-i18n';
import { en, es, pt } from 'vuetify/locale';

// Utils
import { CManagerStorage } from '@/utils/ManagerStorage';

// Locales
import { availableLocales } from '@/locales/AvailableLocales';

import enUsMessages from '../locales/en.json';
import esEsMessages from '../locales/es.json';
import ptBrMessages from '../locales/pt.json';

/**
 * @description Método que mescla as mensagens de tradução.
 * Os parâmetros tiveram que ser mantido com tipo 'any'.
 * @param pVuetifyMessages Mensagens de tradução do Vuetify.
 * @param pCustomMessages Mensagens de tradução customizadas.
 * @returns Mensagens de tradução mescladas.
*/
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mergeMessages(pVuetifyMessages: any, pCustomMessages: any) {
  const { $vuetify: customVuetify, ...appMessages } = pCustomMessages;
  return {
    ...appMessages,
    $vuetify: {
      ...pVuetifyMessages,
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
 * @description Método que inicia o locale padrão.
 * @returns Locale padrão.
 */
function initLocaleDefault(): string {
  const savedLocale = CManagerStorage.get<string>('user_locale', '', 'local');
  const supportedLocales = availableLocales.map((pLocale) => pLocale.value);

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
