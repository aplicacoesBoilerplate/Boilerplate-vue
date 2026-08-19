// Ecossistema Vue
import { computed, type ComputedRef } from 'vue';
import { type RouteRecordRaw, useRoute, useRouter } from 'vue-router';

// Stores
import { useAuthStore } from '@/stores/auth.store';

// Models
import { RECURSO_PERMISSAO_ROTAS_RBAC } from '@/models/model/core/rbac/rbac.api';
import { permissaoEstaLiberada } from '@/models/model/core/rbac/rbac.model';
import type { IRouteMeta } from '@/models/model/IRouteMeta';

/**
 * @property {ComputedRef<IRouteMeta[]>} menuItems - Mapeamentos das rotas que serão renderizadas no NavigationDrawer.
 * @property {(pItem: IRouteMeta) => boolean} rotaAtualCorrespondeItem - Método de sincronização entre rota atual e item ativo no NavigationDrawer.
 */
type TUseNavigationReturn = {
  menuItems: ComputedRef<IRouteMeta[]>,
  rotaAtualCorrespondeItem: (pItem: IRouteMeta) => boolean
}

/**
 * @description Composable responsável por gerenciar o comportamento do componente de Navigation.
 * @returns {TUseNavigationReturn} Métodos para o NavigationDrawer estruturar corretamente as rotas.
 */
export function useNavigation(): TUseNavigationReturn {
  // Composables
  const router = useRouter();
  const route = useRoute();
  const authStore = useAuthStore();

  /**
   * @description Verifica se o usuário pode acessar a rota.
   * @param pRoute Rota a ser verificada.
   * @returns Se o usuário pode acessar a rota.
   */
  const canAccess = (pRoute: RouteRecordRaw): boolean => {
    if (pRoute.meta?.hidden) return false;

    const nomeRota = String(pRoute.name ?? '');
    if (!nomeRota) return true;

    if (!authStore.isAuthenticated) return true;
    if (!authStore.cargoAtual) return false;

    return permissaoEstaLiberada(authStore.cargoAtual, RECURSO_PERMISSAO_ROTAS_RBAC, nomeRota);
  };

  /**
   * @description Mapeia uma rota para um item de menu.
   * @param pRoute Rota a ser mapeada.
   * @returns Item de menu mapeado.
   */
  const mapRouteToMenuItem = (pRoute: RouteRecordRaw): IRouteMeta => {
    return {
      name: pRoute.name as string | undefined,
      path: pRoute.path,
      title: pRoute.meta?.title as string | undefined,
      icon: pRoute.meta?.icon as string | undefined,
      hotkey: pRoute.meta?.hotkey as string | undefined,
      hidden: pRoute.meta?.hidden as boolean | undefined,
      requiresAuth: pRoute.meta?.requiresAuth as boolean | undefined,
      children: pRoute.children ? pRoute.children.map(mapRouteToMenuItem) : undefined,
    };
  };

  /**
   * @description Itens computados para montar o menu. Realização de filtro canAccess e mapeamentos.
   */
  const menuItems = computed<IRouteMeta[]>(() => {
    const allRoutes = router.options.routes;
    const filterRoutes = (pRoutes: readonly RouteRecordRaw[]): RouteRecordRaw[] => {
      return pRoutes.reduce<RouteRecordRaw[]>((pRotasFiltradas, pRota) => {
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
