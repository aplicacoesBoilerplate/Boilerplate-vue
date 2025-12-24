import { computed } from 'vue';
import { useRouter, type RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import type { IRouteMeta } from '@/classes/models/ModelRouteMeta';

export function useNavigation() {
  const router = useRouter();
  const authStore = useAuthStore();

  const canAccess = (route: RouteRecordRaw): boolean => {
    if (route.meta?.hidden) return false;

    const requiredRoles = route.meta?.authorize as string[] | undefined;
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const userRole = authStore.user?.role;
    return userRole ? requiredRoles.includes(userRole) : false;
  };

  const mapRouteToMenuItem = (route: RouteRecordRaw): IRouteMeta => {
    return {
      name: route.name as string | undefined,
      path: route.path,
      title: route.meta?.title as string | undefined,
      icon: route.meta?.icon as string | undefined,
      hotkey: route.meta?.hotkey as string | undefined,
      hidden: route.meta?.hidden as boolean | undefined,
      requiresAuth: route.meta?.requiresAuth as boolean | undefined,
      authorize: route.meta?.authorize as string[] | undefined,
      children: route.children ? route.children.map(mapRouteToMenuItem) : undefined
    };
  };

  const menuItems = computed<IRouteMeta[]>(() => {
    const allRoutes = router.options.routes;
    const filterRoutes = (routes: readonly RouteRecordRaw[]): RouteRecordRaw[] => {
      return routes
        .filter(route => canAccess(route))
        .map(route => {
          if (route.children) {
            return {
              ...route,
              children: filterRoutes(route.children)
            };
          }
          return route;
        });
    };

    return filterRoutes(allRoutes).map(mapRouteToMenuItem);
  });

  return { menuItems };
}
