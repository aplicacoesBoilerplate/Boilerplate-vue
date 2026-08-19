// Ecossistema Vue
import { watch } from 'vue';
import { useTheme } from 'vuetify';

// Stores
import { usePreferencesStore } from '@/stores/preferences.store';

/**
 * @description Gerencia alternância entre tema claro e escuro, sincronizando com a store de preferências.
 * @returns Tema ativo e função para alternar entre os modos claro e escuro.
 */
export function useThemeSwitch() {
  const theme = useTheme();
  const preferencesStore = usePreferencesStore();

  function toggleTheme() {
    const newVal = theme.global.current.value.dark ? 'light' : 'dark';
    theme.change(newVal);
    preferencesStore.setTheme(newVal);
  }

  return {
    theme,
    toggleTheme,
  };
}

/**
 * @description Mantém o tema global sincronizado com a preferência local ou carregada do backend.
 */
export function useThemePreferenceSync(): void {
  const theme = useTheme();
  const preferencesStore = usePreferencesStore();

  watch(
    () => preferencesStore.preferences.theme.currentTheme,
    (pThemePreference) => {
      if (pThemePreference !== 'system') {
        theme.change(pThemePreference);
      }
    },
    { immediate: true },
  );
}
