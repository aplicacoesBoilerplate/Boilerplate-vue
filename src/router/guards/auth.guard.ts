// Stores
import { useAuthStore } from '@/stores/auth.store';

// Types e Interfaces
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

const ROTAS_PUBLICAS = new Set([
  'Login',
  'RecuperacaoSenha',
  'InformacoesSistema',
  'ServerError',
  'NotFound',
  'forbidden',
]);

function rotaExigeAutenticacao(pTo: RouteLocationNormalized): boolean {
  if (pTo.meta.requiresAuth !== undefined) {
    return Boolean(pTo.meta.requiresAuth);
  }

  return !pTo.meta.hidden;
}

export const authGuard = async (
  pTo: RouteLocationNormalized,
  pFrom: RouteLocationNormalized,
  pNext: NavigationGuardNext,
) => {
  void pFrom;

  const authStore = useAuthStore();

  if (authStore.isAuthenticated && !authStore.user) {
    await authStore.fetchUser();
  }

  if (!rotaExigeAutenticacao(pTo) || ROTAS_PUBLICAS.has(String(pTo.name))) {
    pNext();
    return;
  }

  if (!authStore.isAuthenticated) {
    pNext({
      name: 'Login',
      query: {
        redirect: pTo.fullPath,
      },
    });
    return;
  }

  pNext();
};
