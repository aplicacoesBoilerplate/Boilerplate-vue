import type { SnackbarColor } from '@/classes/models/modelComponents/ModelSnackbar'
import { useSnackbarStore } from '@/stores/SnackbarStore'

export function useSnackbar() {
  const store = useSnackbarStore()

  const notify = (message: string, color: SnackbarColor = 'success') => {
    store.showSnackbar(message, color)
  }

  const close = () => {
    store.hideSnackbar()
  }

  return {
    notify,
    close
  }
}
