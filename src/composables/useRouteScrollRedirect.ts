// Ecossistema vue
import { useRoute, useRouter } from 'vue-router';

// Types e Interfaces
import type { RouteLocationRaw } from 'vue-router';

// Utilitários
import { ROUTE_SCROLL_SELECTOR_QUERY } from '@/utils/RouteScrollRestore';

// Função helper para trabalhar com o redirect inteligente dos componentes de lista
export function useRouteScrollRedirect() {
  const route = useRoute();
  const router = useRouter();

  /**
   * @description Método que define o alvo de scroll no parâmetro da URL no browser usando vue router.
   * @param pSelector Seletor de scroll.
   */
  async function setScrollTarget(pSelector: string) {
    // replace evita poluir o historico: o "voltar" continua retornando para a origem correta.
    await router.replace({
      path: route.path,
      query: {
        ...route.query,
        [ROUTE_SCROLL_SELECTOR_QUERY]: pSelector,
      },
      hash: route.hash,
    });
  }

  /**
   * @description Método que redireciona para uma rota e define o alvo de scroll no parâmetro da URL no browser usando vue router.
   * @param pTo Rota para redirecionar.
   * @param pSelector Seletor de scroll.
   */
  async function redirecionarPara(pTo: RouteLocationRaw, pSelector?: string | null) {
    if (pSelector) {
      // A rota de origem passa a carregar a instrução de foco quando o usuario voltar.
      await setScrollTarget(pSelector);
    }

    await router.push(pTo);
  }

  return {
    redirecionarPara,
    setScrollTarget,
  };
}
