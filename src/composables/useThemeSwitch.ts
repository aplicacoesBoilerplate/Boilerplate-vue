import { useTheme } from 'vuetify'
import { onMounted } from 'vue'

export function useThemeSwitch() {
  const theme = useTheme()
  const THEME_KEY = 'user_theme_preference'

  const toggleTheme = () => {
    const newVal = theme.global.current.value.dark ? 'light' : 'dark'
    theme.global.name.value = newVal
    localStorage.setItem(THEME_KEY, newVal)
  }

  onMounted(() => {
    const storedTheme = localStorage.getItem(THEME_KEY)
    if (storedTheme) {
      theme.global.name.value = storedTheme
    }
  })

  return {
    theme,
    toggleTheme
  }
}
