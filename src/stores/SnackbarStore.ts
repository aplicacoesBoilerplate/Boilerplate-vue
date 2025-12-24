import type { SnackbarColor } from '@/classes/models/modelComponents/ModelSnackbar'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSnackbarStore = defineStore('snackbar', () => {
  const visible = ref(false)
  const message = ref('')
  const color = ref<SnackbarColor>('success')

  function showSnackbar(msg: string, colorType: SnackbarColor = 'success') {
    visible.value = false

    setTimeout(() => {
      message.value = msg
      color.value = colorType
      visible.value = true
    }, 100)
  }

  function hideSnackbar() {
    visible.value = false
  }

  return {
    visible,
    message,
    color,
    showSnackbar,
    hideSnackbar,
  }
})
