import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

export const authGuard = async (
  pTo: RouteLocationNormalized,
  pFrom: RouteLocationNormalized,
  pNext: NavigationGuardNext
) => {
  // Guard mantido inoperante até o backend e os contratos de RBAC estarem disponíveis.
  void pTo;
  void pFrom;
  pNext();
};
