// Ecossistema Vue
import { onMounted } from 'vue';
import { useTheme } from 'vuetify';

// Stores
import { usePreferencesStore } from '@/stores/preferences.store';

/**
 * @description Gerencia alternância entre tema claro e escuro, sincronizando com a store de preferências.
 */
export function useThemeSwitch() {
  const theme = useTheme();
  const preferencesStore = usePreferencesStore();

  function toggleTheme() {
    const newVal = theme.global.current.value.dark ? 'light' : 'dark';
    theme.change(newVal);
    preferencesStore.setTheme(newVal);
  }

  onMounted(() => {
    const themePreference = preferencesStore.preferences.theme.currentTheme;

    if (themePreference && themePreference !== 'system') {
      theme.change(themePreference);
    }
  });

  return {
    theme,
    toggleTheme,
  };
}
