// Ecossistema Vue
import { computed } from 'vue';
import { useRoute, useRouter, type RouteRecordRaw } from 'vue-router';

// Types e Interfaces
import type { IRouteMeta } from '@/models/model/IRouteMeta';
import type { TPapel } from '@/models/model/usuario/lUsuario';

// Stores
import { useAuthStore } from '@/stores/auth';

/**
 * Composable responsável por gerenciar o comportamento do componente de Navigation.
 */
export function useNavigation() {
  // Composables
  const router = useRouter();
  const route = useRoute();
  const authStore = useAuthStore();

  /**
   * Verifica se o usuário pode acessar a rota.
   * @param route Rota a ser verificada.
   * @returns Se o usuário pode acessar a rota.
   */
  const canAccess = (route: RouteRecordRaw): boolean => {
    if (route.meta?.hidden) return false;

    const requiredRoles = route.meta?.authorize as TPapel[] | undefined;
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const userRole = authStore.user?.papel;
    return userRole ? requiredRoles.includes(userRole) : false;
  };

  /**
   * Mapeia uma rota para um item de menu.
   * @param route Rota a ser mapeada.
   * @returns Item de menu mapeado.
   */
  const mapRouteToMenuItem = (route: RouteRecordRaw): IRouteMeta => {
    return {
      name: route.name as string | undefined,
      path: route.path,
      title: route.meta?.title as string | undefined,
      icon: route.meta?.icon as string | undefined,
      hotkey: route.meta?.hotkey as string | undefined,
      hidden: route.meta?.hidden as boolean | undefined,
      requiresAuth: route.meta?.requiresAuth as boolean | undefined,
      authorize: route.meta?.authorize as TPapel[] | undefined,
      children: route.children ? route.children.map(mapRouteToMenuItem) : undefined,
    };
  };

  /**
   * Itens computados para montar o menu.
   */
  const menuItems = computed<IRouteMeta[]>(() => {
    const allRoutes = router.options.routes;
    const filterRoutes = (routes: readonly RouteRecordRaw[]): RouteRecordRaw[] => {
      return routes
        .filter((route) => canAccess(route))
        .map((route) => {
          if (route.children) {
            return {
              ...route,
              children: filterRoutes(route.children),
            };
          }

          return route;
        });
    };

    // Realização do filtro e mapeamento dos itens do menu.
    return filterRoutes(allRoutes).map(mapRouteToMenuItem);
  });

  /**
   * @description Verifica se a rota atual corresponde ao item de navegação.
   * @param {IRouteMeta} pItem - O item de navegação a ser verificado.
   * @returns {boolean} - Retorna true se a rota atual corresponde ao item de navegação, false caso contrário.
   */
  const rotaAtualCorrespondeItem = (pItem: IRouteMeta): boolean => {
    // Verifica se o item atual possui algum correspondente na árvore de rotas.
    if (pItem.name && route.matched.some((pRota) => pRota.name === pItem.name)) {
      return true;
    }

    // Se a rota atual for igual à rota resolvida ou se a rota atual começar com a rota resolvida, considera ativa.
    if (pItem.path) {
      const rotaResolvida = router.resolve(pItem.path);
      return route.path === rotaResolvida.path || route.path.startsWith(`${rotaResolvida.path}/`);
    }

    return false;
  };

  return {
    menuItems,
    rotaAtualCorrespondeItem,
  };
}
