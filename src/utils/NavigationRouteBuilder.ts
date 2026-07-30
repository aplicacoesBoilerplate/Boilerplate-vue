// Ecossistema Vue
// Types e Interfaces
import type { INavigationItem } from '@/models/components/INavigationItem';
import type { RouteRecordRaw } from 'vue-router';

// Class com a responsabilidade de montar os itens do componente NavigationDrawer.
export class ClassNavigationRouteBuilder {
  /**
   * Método que constrói os itens de navegação a partir dos registros de rotas.
   *
   * @param routeRecords Registros de rotas.
   * @param parentPath Caminho pai.
   * @returns Array de itens de navegação.
   */
  static build(routeRecords: RouteRecordRaw[], parentPath = ''): INavigationItem[] {
    // flatMap para transformar e achatar coleções aninhadas.
    return routeRecords.flatMap((route) => {
      const childPathBase = this.resolvePath(parentPath, route.path);
      const children = route.children?.length ? this.build(route.children, childPathBase) : [];

      if (route.meta?.hidden || route.meta?.excludeNav) {
        return [];
      }

      const title = route.meta?.title ? String(route.meta.title) : undefined;

      if (!title && children.length) {
        return children;
      }

      if (!title) {
        return [];
      }

      const item: INavigationItem = {
        title,
        icon: route.meta?.icon ? String(route.meta.icon) : undefined,
        hotkey: route.meta?.hotkey ? String(route.meta.hotkey) : undefined,
      };

      if (children.length) {
        item.children = children;
      } else {
        item.to = childPathBase || '/';
        item.name = route.name as string;
      }

      return [item];
    });
  }

  /**
   * Método que resolve o caminho.
   *
   * @param parentPath Caminho pai.
   * @param path Caminho.
   * @returns Caminho resolvido.
   */
  private static resolvePath(parentPath: string, path: string) {
    if (path.startsWith('/')) {
      return path;
    }

    const normalizedParent = parentPath === '/' ? '' : parentPath;
    const normalizedPath = path ? `/${path}` : '';
    const resolvedPath = `${normalizedParent}${normalizedPath}`;

    return resolvedPath || '/';
  }
}
