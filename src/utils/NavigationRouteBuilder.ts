// Ecossistema Vue
// Types e Interfaces
import type { INavigationItem } from '@/models/components/INavigationItem';
import type { RouteRecordRaw } from 'vue-router';

// Class com a responsabilidade de montar os itens do componente NavigationDrawer.
export class CNavigationRouteBuilder {
  /**
   * @description Constrói os itens de navegação a partir dos registros de rotas.
   * @param pRouteRecords Registros de rotas.
   * @param pParentPath Caminho pai.
   * @returns Array de itens de navegação.
   */
  static build(pRouteRecords: RouteRecordRaw[], pParentPath = ''): INavigationItem[] {
    // flatMap para transformar e achatar coleções aninhadas.
    return pRouteRecords.flatMap((pRoute) => {
      const childPathBase = this.resolvePath(pParentPath, pRoute.path);
      const children = pRoute.children?.length ? this.build(pRoute.children, childPathBase) : [];

      if (pRoute.meta?.hidden || pRoute.meta?.excludeNav) {
        return [];
      }

      const title = pRoute.meta?.title ? String(pRoute.meta.title) : undefined;

      if (!title && children.length) {
        return children;
      }

      if (!title) {
        return [];
      }

      const item: INavigationItem = {
        title,
        icon: pRoute.meta?.icon ? String(pRoute.meta.icon) : undefined,
        hotkey: pRoute.meta?.hotkey ? String(pRoute.meta.hotkey) : undefined,
      };

      if (children.length) {
        item.children = children;
      } else {
        item.to = childPathBase || '/';
        item.name = pRoute.name as string;
      }

      return [item];
    });
  }

  /**
   * @description Resolve o caminho absoluto de um registro de rota.
   * @param pParentPath Caminho pai.
   * @param pPath Caminho do registro atual.
   * @returns Caminho resolvido.
   */
  private static resolvePath(pParentPath: string, pPath: string) {
    if (pPath.startsWith('/')) {
      return pPath;
    }

    const normalizedParent = pParentPath === '/' ? '' : pParentPath;
    const normalizedPath = pPath ? `/${pPath}` : '';
    const resolvedPath = `${normalizedParent}${normalizedPath}`;

    return resolvedPath || '/';
  }
}
