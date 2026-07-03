import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useSnackbar } from '@/composables/useSnackbar';

export const rbacGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore();
  const { notify } = useSnackbar();

  if (authStore.token && !authStore.user) {
    await authStore.fetchUser();
  }

  const authorizedRoles = to.meta.authorize as string[] | undefined;

  if (!authorizedRoles || authorizedRoles.length === 0) {
    return next();
  }

  if (!authStore.user) {
    return next({ name: 'Login', query: { redirect: to.fullPath } });
  }

  const userRole = authStore.user.papel;

  if (authorizedRoles.includes(userRole)) {
    next();
  } else {
    notify('Você não tem permissão para acessar esta página.', 'error');
    next({ name: 'AcessoNegado' });
  }
};
