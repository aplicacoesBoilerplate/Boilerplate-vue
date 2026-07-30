// Ecossistema Vue
import { ref } from 'vue';
// Pinia
import { defineStore } from 'pinia';

// Types e Interfaces
import type {
  IPropsSnackbarQueue,
  TSnackbarQueueItem,
  TTipoSnackbar,
} from '@/models/components/props/IPropsSnackbarQueue';

// Mapeamento default dos icones por tipo
const snackbarIcons: Record<TTipoSnackbar, string> = {
  success: 'mdi-check-circle-outline',
  error: 'mdi-alert-circle-outline',
  info: 'mdi-information-outline',
  warning: 'mdi-alert-outline',
};

/**
 * Store para gerenciar a fila de SnackBar's.
 */
export const useSnackbarStore = defineStore('snackbar', () => {
  // Reativas
  const messages = ref<TSnackbarQueueItem[]>([]);

  /**
   * Adiciona uma mensagem na fila da Snackbar.
   * @param snackbar
   */
  function adicionar(snackbar: IPropsSnackbarQueue) {
    const type = snackbar.tipo ?? 'info';

    messages.value.push({
      id:
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : Math.random().toString(36).substring(2, 15),
      title: snackbar.titulo,
      text: snackbar.mensagem,
      color: type,
      variant: 'elevated',
      rounded: 'ts-xl be-xl',
      location: 'top right',
      timer: 'bottom',
      timerColor: 'white',
      timeout: snackbar.timeout ?? 4000,
      prependIcon: snackbar.icon ?? snackbarIcons[type],
      actionUrl: snackbar.urlRedirecionamento,
    } as any);
  }

  /**
   * Limpa todas as mensagens ativas na tela.
   */
  function limpar() {
    messages.value = [];
  }

  return {
    messages,
    adicionar,
    limpar,
  };
});
