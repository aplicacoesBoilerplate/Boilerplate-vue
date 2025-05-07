import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSnackbarStore = defineStore('snackbar', () => {
  const visible = ref(false)
  const message = ref('')
  const color = ref('success')

  function showSnackbar(msg: string, colorType: string = 'success') {
    message.value = msg
    color.value = colorType
    visible.value = true
  }

  function hideSnackbar() {
    visible.value = false
  }

  // Disponibiliza as funções
  return {
    visible,
    message,
    color,
    showSnackbar,
    hideSnackbar,
  }
})
