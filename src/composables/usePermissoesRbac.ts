import { useI18n } from 'vue-i18n';

// Stores
import { useAuthStore } from '@/stores/auth.store';
import { useSnackbarStore } from '@/stores/Snackbar.store';

import {
  MAPEAMENTO_ROTAS_API_RBAC,
  montarAcaoEndpointApiRbac,
  RECURSO_PERMISSAO_API_RBAC,
  RECURSO_PERMISSAO_GERAL_RBAC,
} from '@/models/model/core/rbac/rbac.api';
import { permissaoEstaLiberada } from '@/models/model/core/rbac/rbac.model';
import type { IAuditoriaRegistro } from '@/models/model/common/IAuditoriaRegistro';
// Models
import type { TAcaoApiRbac } from '@/models/model/core/rbac/rbac.types';

export type TAcaoPermissaoGeralRbac = 'exportarDados' | 'visualizarGraficos' | 'gerenciarRegistros';
export type TRecursoPermissaoApiRbac = keyof typeof MAPEAMENTO_ROTAS_API_RBAC;

export type TUsePermissoesRbacReturn = {
  possuiPermissaoGeral: (pAcao: TAcaoPermissaoGeralRbac) => boolean;
  possuiPermissaoApi: (pRecurso: TRecursoPermissaoApiRbac, pAcao: TAcaoApiRbac) => boolean;
  podeGerenciarRegistro: (
    pRecurso: TRecursoPermissaoApiRbac,
    pAcao: Extract<TAcaoApiRbac, 'editar' | 'remover'>,
    pRegistro: { auditoria?: Pick<IAuditoriaRegistro, 'criadoPor'> },
  ) => boolean;
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
    possuiPermissaoApi,
    podeGerenciarRegistro,
    notificarPermissaoNegada,
    executarComPermissaoGeral,
  };
}
