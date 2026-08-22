import { useI18n } from 'vue-i18n';

// Stores
import { useAuthStore } from '@/stores/auth.store';
import { useSnackbarStore } from '@/stores/Snackbar.store';

import { RECURSO_PERMISSAO_GERAL_RBAC } from '@/models/model/core/rbac/rbac.api';
import { permissaoEstaLiberada } from '@/models/model/core/rbac/rbac.model';
// Models
import type { IAuditoriaRegistro } from '@/models/model/common/IAuditoriaRegistro';

export type TAcaoPermissaoGeralRbac = 'exportarDados' | 'visualizarGraficos' | 'gerenciarRegistros';

export type TUsePermissoesRbacReturn = {
  possuiPermissaoGeral: (pAcao: TAcaoPermissaoGeralRbac) => boolean;
  podeGerenciarRegistro: (pRegistro: { auditoria?: Pick<IAuditoriaRegistro, 'criadoPor'> }) => boolean;
  notificarPermissaoNegada: (pMensagem?: string) => void;
  executarComPermissaoGeral: <TRetorno>(
    pAcao: TAcaoPermissaoGeralRbac,
    pCallback: () => TRetorno,
    pMensagem?: string,
  ) => TRetorno | undefined;
};

/**
 * @description Centraliza a validação de permissões RBAC consumidas diretamente por componentes.
 * @returns Métodos para auxiliar nas validações dependentes de permissões RBAC.
 */
export function usePermissoesRbac(): TUsePermissoesRbacReturn {
  // Stores
  const authStore = useAuthStore();
  const snackbarStore = useSnackbarStore();
  const { t } = useI18n();

  function possuiPermissaoGeral(pAcao: TAcaoPermissaoGeralRbac): boolean {
    if (!authStore.cargoAtual) {
      return false;
    }

    return permissaoEstaLiberada(authStore.cargoAtual, RECURSO_PERMISSAO_GERAL_RBAC, pAcao);
  }

  function podeGerenciarRegistro(pRegistro: { auditoria?: Pick<IAuditoriaRegistro, 'criadoPor'> }): boolean {
    if (possuiPermissaoGeral('gerenciarRegistros')) {
      return true;
    }

    return Boolean(authStore.user?.id && pRegistro.auditoria?.criadoPor === authStore.user.id);
  }

  function notificarPermissaoNegada(pMensagem = t('common.messages.actionDenied')): void {
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
    podeGerenciarRegistro,
    notificarPermissaoNegada,
    executarComPermissaoGeral,
  };
}
