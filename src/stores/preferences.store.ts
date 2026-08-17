// Ecossistema vue
import { ref, watch } from 'vue';
// Pinia
import { defineStore } from 'pinia';

// Types e Interfaces
import type { IChartPreferences, IPreferences, IPreferencesTheme } from '@/models/components/IPreferences';
import type { IPreferenciaUsuario } from '@/models/services/IPreferenciaUsuario';

import { deepClone } from '@/utils/deepClone';
// Utilitários
import { CManagerStorage } from '@/utils/ManagerStorage';

// Services
import { preferenciaUsuarioService } from '@/services/CPreferenciaUsuarioService';

// Constantes
const STORAGE_KEY = 'boilerplate.preferences';
const STORAGE_OPTIONS = { storage: 'local' } as const;
const CONTEXTO_PREFERENCIAS = 'global';
const CHAVE_PREFERENCIAS = 'preferences';
const TOKEN_STORAGE_KEY = 'token';

// Default preferences
const defaultPreferences: IPreferences = {
  drawer: {
    isDesktopDrawerVisible: true,
    isDrawerPinned: false,
  },
  theme: {
    currentTheme: 'dark',
  },
  charts: {},
};

export const usePreferencesStore = defineStore('preferences', () => {
  let suspendLocalPersistence = false;
  // Reativas
  const preferences = ref<IPreferences>(CManagerStorage.get(STORAGE_KEY, defaultPreferences, STORAGE_OPTIONS));
  const carregandoRemoto = ref(false);
  const erroRemoto = ref<unknown>(null);

  // Observadores
  watch(
    preferences,
    (pValue) => {
      if (suspendLocalPersistence) return;
      CManagerStorage.set(STORAGE_KEY, pValue, STORAGE_OPTIONS);
    },
    { deep: true },
  );

  // Funções
  function setDesktopDrawerVisible(pValue: boolean) {
    preferences.value.drawer.isDesktopDrawerVisible = pValue;
    void salvarPreferenciasBackend();
  }

  function setDrawerPinned(pValue: boolean) {
    preferences.value.drawer.isDrawerPinned = pValue;
    void salvarPreferenciasBackend();
  }

  function setTheme(pValue: IPreferencesTheme['currentTheme']) {
    preferences.value.theme.currentTheme = pValue;
    void salvarPreferenciasBackend();
  }

  function getChartPreferences(pContexto: string, pPadrao: IChartPreferences): IChartPreferences {
    return {
      ...pPadrao,
      ...(preferences.value.charts?.[pContexto] ?? {}),
    };
  }

  function updateChartPreferences(
    pContexto: string,
    pAlteracoes: Partial<IChartPreferences>,
    pPadrao: IChartPreferences,
  ): void {
    preferences.value.charts ??= {};
    preferences.value.charts[pContexto] = {
      ...pPadrao,
      ...(preferences.value.charts[pContexto] ?? {}),
      ...pAlteracoes,
    };
    void salvarPreferenciasBackend();
  }

  function clearPreferences(): void {
    preferences.value = deepClone(defaultPreferences);
    CManagerStorage.clear(STORAGE_KEY, STORAGE_OPTIONS);
    void salvarPreferenciasBackend();
  }

  function clearLocalPreferences(): void {
    suspendLocalPersistence = true;
    preferences.value = deepClone(defaultPreferences);
    erroRemoto.value = null;
    CManagerStorage.clear(STORAGE_KEY, STORAGE_OPTIONS);
    queueMicrotask(() => {
      suspendLocalPersistence = false;
    });
  }

  function usuarioPossuiToken(): boolean {
    return Boolean(sessionStorage.getItem(TOKEN_STORAGE_KEY) || localStorage.getItem(TOKEN_STORAGE_KEY));
  }

  function montarPreferenciaBackend(): IPreferenciaUsuario {
    return {
      contexto: CONTEXTO_PREFERENCIAS,
      chave: CHAVE_PREFERENCIAS,
      valorJson: JSON.stringify(preferences.value),
    };
  }

  function aplicarPreferenciaBackend(pPreferencia: IPreferenciaUsuario): void {
    try {
      preferences.value = {
        ...deepClone(defaultPreferences),
        ...JSON.parse(pPreferencia.valorJson),
        charts: JSON.parse(pPreferencia.valorJson).charts ?? {},
      };
    } catch (pErro) {
      erroRemoto.value = pErro;
    }
  }

  async function carregarPreferenciasBackend(): Promise<void> {
    if (!usuarioPossuiToken()) {
      return;
    }

    carregandoRemoto.value = true;
    erroRemoto.value = null;

    try {
      const resposta = await preferenciaUsuarioService.buscarPreferenciasUsuarioAutenticado();
      const preferencia = resposta.preferencias.find(
        (pPreferencia) => pPreferencia.contexto === CONTEXTO_PREFERENCIAS && pPreferencia.chave === CHAVE_PREFERENCIAS,
      );

      if (preferencia) {
        aplicarPreferenciaBackend(preferencia);
        return;
      }

      await salvarPreferenciasBackend();
    } catch (pErro) {
      erroRemoto.value = pErro;
    } finally {
      carregandoRemoto.value = false;
    }
  }

  async function salvarPreferenciasBackend(): Promise<void> {
    if (!usuarioPossuiToken()) {
      return;
    }

    try {
      await preferenciaUsuarioService.salvarPreferenciaUsuarioAutenticado(montarPreferenciaBackend());
    } catch (pErro) {
      erroRemoto.value = pErro;
    }
  }

  return {
    preferences,
    carregandoRemoto,
    erroRemoto,
    setDesktopDrawerVisible,
    setDrawerPinned,
    setTheme,
    getChartPreferences,
    updateChartPreferences,
    clearPreferences,
    clearLocalPreferences,
    carregarPreferenciasBackend,
    salvarPreferenciasBackend,
  };
});
