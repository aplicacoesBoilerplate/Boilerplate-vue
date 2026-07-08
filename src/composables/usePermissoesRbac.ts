// Stores
import { useAuthStore } from '@/stores/auth.store';
import { useSnackbarStore } from '@/stores/Snackbar.store';

// Models
import {
  permissaoEstaLiberada,
  RECURSO_PERMISSAO_GERAL_RBAC,
} from '@/models/model/rbac/ICargoRbac';

export type TAcaoPermissaoGeralRbac = 'exportarDados' | 'visualizarGraficos' | 'gerenciarRegistros';

export type TUsePermissoesRbacReturn = {
  possuiPermissaoGeral: (pAcao: TAcaoPermissaoGeralRbac) => boolean;
  notificarPermissaoNegada: (pMensagem?: string) => void;
  executarComPermissaoGeral: <TRetorno>(
    pAcao: TAcaoPermissaoGeralRbac,
    pCallback: () => TRetorno,
    pMensagem?: string,
  ) => TRetorno | undefined;
};

/**
 * @description Centraliza a validação de permissões RBAC consumidas diretamente por componentes.
 */
export function usePermissoesRbac(): TUsePermissoesRbacReturn {
  const authStore = useAuthStore();
  const snackbarStore = useSnackbarStore();

  function possuiPermissaoGeral(pAcao: TAcaoPermissaoGeralRbac): boolean {
    if (!authStore.cargoAtual) {
      return false;
    }

    return permissaoEstaLiberada(authStore.cargoAtual, RECURSO_PERMISSAO_GERAL_RBAC, pAcao);
  }

  function notificarPermissaoNegada(pMensagem = 'Você não tem permissão para executar esta ação.'): void {
    snackbarStore.adicionar({
      tipo: 'warning',
      mensagem: pMensagem,
    });
  }

  function executarComPermissaoGeral<TRetorno>(
    pAcao: TAcaoPermissaoGeralRbac,
    pCallback: () => TRetorno,
    pMensagem?: string,
  ): TRetorno | undefined {
    if (!possuiPermissaoGeral(pAcao)) {
      notificarPermissaoNegada(pMensagem);
      return undefined;
    }

    return pCallback();
  }

  return {
    possuiPermissaoGeral,
    notificarPermissaoNegada,
    executarComPermissaoGeral,
  };
}
