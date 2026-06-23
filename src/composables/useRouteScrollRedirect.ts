// Ecossistema vue
import { useRoute, useRouter } from 'vue-router';
import type { RouteLocationRaw } from 'vue-router';

// Utilitários
import { ROUTE_SCROLL_SELECTOR_QUERY } from '@/utils/RouteScrollRestore';

// Função helper para trabalhar com o redirect inteligente dos componentes de lista
export function useRouteScrollRedirect() {
  const route = useRoute();
  const router = useRouter();

  /**
   * Método que define o alvo de scroll no parâmetro da URL no browser usando vue router.
   *
   * @param selector Seletor de scroll.
   */
  async function setScrollTarget(selector: string) {
    // replace evita poluir o historico: o "voltar" continua retornando para a origem correta.
    await router.replace({
      path: route.path,
      query: {
        ...route.query,
        [ROUTE_SCROLL_SELECTOR_QUERY]: selector,
      },
      hash: route.hash,
    });
  }

  /**
   * Método que redireciona para uma rota e define o alvo de scroll no parâmetro da URL no browser usando vue router.
   *
   * @param to Rota para redirecionar.
   * @param selector Seletor de scroll.
   */
  async function redirectTo(to: RouteLocationRaw, selector?: string | null) {
    if (selector) {
      // A rota de origem passa a carregar a instrução de foco quando o usuario voltar.
      await setScrollTarget(selector);
    }

    await router.push(to);
  }

  return {
    redirectTo,
    setScrollTarget,
  };
}
