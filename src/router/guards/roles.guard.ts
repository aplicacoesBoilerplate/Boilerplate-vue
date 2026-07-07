import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

// Stores
import { useAuthStore } from '@/stores/auth.store';

// Models
import {
  permissaoEstaLiberada,
  RECURSO_PERMISSAO_ROTAS_RBAC,
} from '@/models/model/rbac/ICargoRbac';

const ROTAS_SEM_RBAC = new Set(['Login', 'RecuperacaoSenha', 'InformacoesSistema', 'ServerError', 'NotFound', 'forbidden']);

export const rbacGuard = async (
  pTo: RouteLocationNormalized,
  pFrom: RouteLocationNormalized,
  pNext: NavigationGuardNext
) => {
  void pFrom;

  if (ROTAS_SEM_RBAC.has(String(pTo.name)) || pTo.meta.hidden) {
    pNext();
    return;
  }

  const authStore = useAuthStore();

  if (!authStore.isAuthenticated) {
    pNext();
    return;
  }

  if (!authStore.user) {
    await authStore.fetchUser();
  }

  const nomeRota = String(pTo.name ?? '');

  if (!nomeRota || !authStore.cargoAtual) {
    pNext({ name: 'forbidden' });
    return;
  }

  if (!permissaoEstaLiberada(authStore.cargoAtual, RECURSO_PERMISSAO_ROTAS_RBAC, nomeRota)) {
    pNext({ name: 'forbidden' });
    return;
  }

  pNext();
};
