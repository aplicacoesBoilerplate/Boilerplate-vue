import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useSnackbar } from '@/composables/useSnackbar';

export const authGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore();
  const { notify } = useSnackbar();

  if (authStore.token && !authStore.user) {
    await authStore.fetchUser();
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    notify('Você precisa estar autenticado para acessar. Faça login!', 'error');
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
};
