// Stores
import { useSnackbarStore } from '@/stores/Snackbar.store';

// Types e Interfaces
import type { TTipoSnackbar } from '@/models/components/props/IPropsSnackbarQueue';

/**
 * @property {function(pMensagem: string, pTipo?: TSnackbarType | 'red'): void} notify - Adiciona um feedback ao usuário.
 * @property {function(): void} hide - Remove todos os feedbacks do usuário.
 */
interface IRetornoSnackbar {
  notify: (pMensagem: string, pTipo?: TTipoSnackbar | 'red') => void;
  hide: () => void;
}

function normalizarTipoSnackbar(pTipo: TTipoSnackbar | 'red' = 'success'): TTipoSnackbar {
  if (pTipo === 'red') {
    return 'error';
  }

  return pTipo;
}

/**
 * @description Permite adicionar feedbacks ao usuário de forma centralizada.
 * @returns {IRetornoSnackbar} - Objeto com as funções notify e hide.
 */
export function useSnackbar(): IRetornoSnackbar {
  const snackbarStore = useSnackbarStore();

  /**
   * @description Adiciona um feedback ao usuário.
   * @param pMensagem Mensagem a ser exibida.
   * @param pTipo Tipo de feedback (success, error, warning, info).
   */
  function notify(pMensagem: string, pTipo: TTipoSnackbar | 'red' = 'success'): void {
    snackbarStore.adicionar({
      mensagem: pMensagem,
      tipo: normalizarTipoSnackbar(pTipo),
    });
  }

  /**
   * @description Remove todos os feedbacks do usuário.
   */
  function hide(): void {
    snackbarStore.limpar();
  }

  return { notify, hide };
}
