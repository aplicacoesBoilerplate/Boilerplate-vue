// Ecossistema Vue
import { computed } from 'vue';
import { type RouteRecordRaw, useRoute, useRouter } from 'vue-router';

// Stores
import { useAuthStore } from '@/stores/auth.store';

// Models
import { permissaoEstaLiberada } from '@/models/model/core/rbac/rbac.model';
import { RECURSO_PERMISSAO_ROTAS_RBAC } from '@/models/model/core/rbac/rbac.api';
// Types e Interfaces
import type { IRouteMeta } from '@/models/model/IRouteMeta';

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

    const nomeRota = String(route.name ?? '');
    if (!nomeRota) return true;

    if (!authStore.isAuthenticated) return true;
    if (!authStore.cargoAtual) return false;

    return permissaoEstaLiberada(authStore.cargoAtual, RECURSO_PERMISSAO_ROTAS_RBAC, nomeRota);
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
      children: route.children ? route.children.map(mapRouteToMenuItem) : undefined,
    };
  };

  /**
   * Itens computados para montar o menu.
   */
  const menuItems = computed<IRouteMeta[]>(() => {
    const allRoutes = router.options.routes;
    const filterRoutes = (routes: readonly RouteRecordRaw[]): RouteRecordRaw[] => {
      return routes.reduce<RouteRecordRaw[]>((pRotasFiltradas, pRota) => {
        const filhosFiltrados = pRota.children ? filterRoutes(pRota.children) : undefined;
        const rotaAcessivel = canAccess(pRota);

        if (!rotaAcessivel && (!filhosFiltrados || filhosFiltrados.length === 0)) {
          return pRotasFiltradas;
        }

        pRotasFiltradas.push({
          ...pRota,
          children: filhosFiltrados,
        } as RouteRecordRaw);

        return pRotasFiltradas;
      }, []);
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
