import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

export const rbacGuard = async (
  pTo: RouteLocationNormalized,
  pFrom: RouteLocationNormalized,
  pNext: NavigationGuardNext
) => {
  // Guard mantido inoperante até o backend e os contratos de RBAC estarem disponíveis.
  void pTo;
  void pFrom;
  pNext();
};
