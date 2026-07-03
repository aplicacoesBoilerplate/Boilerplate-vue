// Stores
import { useSnackbarStore } from '@/stores/SnackbarStore';

// Types e Interfaces
import type { TSnackbarType } from '@/models/IPropsSnackbarQueue';

function normalizarTipoSnackbar(pTipo: TSnackbarType | 'red' = 'success'): TSnackbarType {
  if (pTipo === 'red') {
    return 'error';
  }

  return pTipo;
}

/**
 * @description
 * Permite adicionar feedbacks ao usuário de forma centralizada.
 */
export function useSnackbar(): {
  notify: (pMensagem: string, pTipo?: TSnackbarType | 'red') => void;
  hide: () => void;
} {
  const snackbarStore = useSnackbarStore();

  /**
   * @description
   * Adiciona um feedback ao usuário.
   * @param pMensagem Mensagem a ser exibida.
   * @param pTipo Tipo de feedback (success, error, warning, info).
   */
  function notify(pMensagem: string, pTipo: TSnackbarType | 'red' = 'success'): void {
    snackbarStore.adicionar({
      mensagem: pMensagem,
      tipo: normalizarTipoSnackbar(pTipo),
    });
  }

  /**
   * @description
   * Remove todos os feedbacks do usuário.
   */
  function hide(): void {
    snackbarStore.limpar();
  }

  return { notify, hide };
}
