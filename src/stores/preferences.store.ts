// Ecossistema vue
import { ref, watch } from 'vue';

// Pinia
import { defineStore } from 'pinia';

// Types e Interfaces
import type { IPreferences, IPreferencesTheme } from '@/models/components/IPreferences';

// Utilitários
import { ClassManagerStorage } from '@/utils/ManagerStorage';

// Constantes
const STORAGE_KEY = 'boilerplate.preferences';
const STORAGE_OPTIONS = { storage: 'local' } as const;

// Default preferences
const defaultPreferences: IPreferences = {
  drawer: {
    isDesktopDrawerVisible: true,
    isDrawerPinned: false,
  },
  theme: {
    currentTheme: 'dark',
  },
};

/**
 * Store de preferências.
 */
export const usePreferencesStore = defineStore('preferences', () => {
  // Reativas
  const preferences = ref<IPreferences>(ClassManagerStorage.get(STORAGE_KEY, defaultPreferences, STORAGE_OPTIONS));

  // Observadores
  watch(preferences, (value) => {
    ClassManagerStorage.set(STORAGE_KEY, value, STORAGE_OPTIONS);
  }, { deep: true });

  // Funções
  function setDesktopDrawerVisible(value: boolean) {
    preferences.value.drawer.isDesktopDrawerVisible = value;
  }

  function setDrawerPinned(value: boolean) {
    preferences.value.drawer.isDrawerPinned = value;
  }

  function setTheme(value: IPreferencesTheme['currentTheme']) {
    preferences.value.theme.currentTheme = value;
  }

  function clearPreferences() {
    preferences.value = structuredClone(defaultPreferences);
    ClassManagerStorage.clear(STORAGE_KEY, STORAGE_OPTIONS);
  }

  return {
    preferences,
    setDesktopDrawerVisible,
    setDrawerPinned,
    setTheme,
    clearPreferences,
  };
});
