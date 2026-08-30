import { useI18n } from 'vue-i18n';

// Stores
import { useAuthStore } from '@/stores/auth.store';
import { useSnackbarStore } from '@/stores/Snackbar.store';

import {
  MAPEAMENTO_ROTAS_API_RBAC,
  montarAcaoEndpointApiRbac,
  RECURSO_PERMISSAO_API_RBAC,
} from '@/models/model/core/rbac/rbac.api';
import { funcionalidadeEstaLiberada, permissaoEstaLiberada } from '@/models/model/core/rbac/rbac.model';
import type { IAuditoriaRegistro } from '@/models/model/common/IAuditoriaRegistro';
// Models
import type { TAcaoApiRbac } from '@/models/model/core/rbac/rbac.types';

export type TFuncionalidadeRbac = 'exportarDados' | 'visualizarGraficos' | 'gerenciarRegistrosOutros';
export type TRecursoPermissaoApiRbac = keyof typeof MAPEAMENTO_ROTAS_API_RBAC;

export type TUsePermissoesRbacReturn = {
  possuiFuncionalidade: (pFuncionalidade: TFuncionalidadeRbac) => boolean;
  possuiPermissaoApi: (pRecurso: TRecursoPermissaoApiRbac, pAcao: TAcaoApiRbac) => boolean;
  podeGerenciarRegistro: (
    pRecurso: TRecursoPermissaoApiRbac,
    pAcao: Extract<TAcaoApiRbac, 'editar' | 'remover'>,
    pRegistro: { auditoria?: Pick<IAuditoriaRegistro, 'criadoPor'> },
  ) => boolean;
  notificarPermissaoNegada: (pMensagem?: string) => void;
  executarComFuncionalidade: <TRetorno>(
    pAcao: TFuncionalidadeRbac,
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

  function possuiFuncionalidade(pFuncionalidade: TFuncionalidadeRbac): boolean {
    if (!authStore.cargoAtual) {
      return false;
    }

    return funcionalidadeEstaLiberada(authStore.cargoAtual, pFuncionalidade);
  }

  function possuiPermissaoApi(pRecurso: TRecursoPermissaoApiRbac, pAcao: TAcaoApiRbac): boolean {
    const cargoAtual = authStore.cargoAtual;

    if (!cargoAtual) {
      return false;
    }

    const endpoints = MAPEAMENTO_ROTAS_API_RBAC[pRecurso]?.acoes[pAcao] ?? [];

    return endpoints.length > 0 && endpoints.every((pEndpoint) =>
      permissaoEstaLiberada(cargoAtual, RECURSO_PERMISSAO_API_RBAC, montarAcaoEndpointApiRbac(pEndpoint)),
    );
  }

  function podeGerenciarRegistro(
    pRecurso: TRecursoPermissaoApiRbac,
    pAcao: Extract<TAcaoApiRbac, 'editar' | 'remover'>,
    pRegistro: { auditoria?: Pick<IAuditoriaRegistro, 'criadoPor'> },
  ): boolean {
    if (!possuiPermissaoApi(pRecurso, pAcao)) {
      return false;
    }

    if (possuiFuncionalidade('gerenciarRegistrosOutros')) {
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

  function executarComFuncionalidade<TRetorno>(
    pAcao: TFuncionalidadeRbac,
    pCallback: () => TRetorno,
    pMensagem?: string,
  ): TRetorno | undefined {
    if (!possuiFuncionalidade(pAcao)) {
      notificarPermissaoNegada(pMensagem);
      return undefined;
    }

    return pCallback();
  }

  return {
    possuiFuncionalidade,
    possuiPermissaoApi,
    podeGerenciarRegistro,
    notificarPermissaoNegada,
    executarComFuncionalidade,
  };
}
