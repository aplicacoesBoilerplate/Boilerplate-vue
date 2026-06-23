// Ecossistema vue
import type { RouteLocationNormalizedLoaded } from 'vue-router';

/**
 * Chave para obter o seletor de scroll do parâmetro da URL no browser usando vue router.
 */
export const ROUTE_SCROLL_SELECTOR_QUERY = 'scrollTarget';

/**
 * Classe css padrão para marcar o elemento que será restaurado o scroll.
 */
export const ROUTE_SCROLL_TARGET_CLASS = 'route-scroll-restore-target';

/**
 * Classe css padrão para marcar o último elemento visualizado.
 */
export const ROUTE_SCROLL_LAST_VIEWED_CLASS = 'route-scroll-restore--last-viewed';

/**
 * Tempo padrão para aguardar o elemento ser encontrado.
 */
const DEFAULT_WAIT_TIMEOUT_MS = 3000;

/**
 * Intervalo padrão para aguardar o elemento ser encontrado.
 */
const DEFAULT_WAIT_INTERVAL_MS = 50;

// Função para obter o seletor de scroll pelo parâmetro da URL no browser usando vue router
export function getRouteScrollSelector(route: Pick<RouteLocationNormalizedLoaded, 'query'>) {
  const scrollTarget = route.query[ROUTE_SCROLL_SELECTOR_QUERY];

  if (Array.isArray(scrollTarget)) {
    return scrollTarget[0] ?? null;
  }

  return scrollTarget ?? null;
}

/**
 * Função que constrói o seletor composto para evitar colisao quando listas diferentes renderizam ids iguais.
 */
export function buildRouteScrollSelector(contextId: string, itemKey: string | number) {
  return [
    `[data-scroll-context="${escapeAttributeValue(contextId)}"]`,
    `[data-scroll-key="${escapeAttributeValue(itemKey)}"]`,
  ].join('');
}

/**
 * Função que cria os bindings para o item ser encontrado depois que a lista restaurar seu contexto.
 */
export function createRouteScrollItemBindings(
  contextId: string,
  itemKey: string | number,
) {
  return {
    class: ROUTE_SCROLL_TARGET_CLASS,
    'data-scroll-context': contextId,
    'data-scroll-key': String(itemKey),
    'data-scroll-selector': buildRouteScrollSelector(contextId, itemKey),
  };
}

/**
 * Função que aguarda o elemento ser encontrado.
 */
export function waitForRouteScrollTarget(
  selector: string,
  timeoutMs = DEFAULT_WAIT_TIMEOUT_MS,
): Promise<Element | null> {
  const startedAt = Date.now();

  // Infinite scroll/cache pode renderizar depois do scrollBehavior iniciar; aguardamos por janela curta.
  return new Promise((resolve) => {
    const tick = () => {
      const element = document.querySelector(selector);

      if (element) {
        resolve(element);
        return;
      }

      if (Date.now() - startedAt >= timeoutMs) {
        resolve(null);
        return;
      }

      window.setTimeout(tick, DEFAULT_WAIT_INTERVAL_MS);
    };

    tick();
  });
}

/**
 * Função que marca o item como último visualizado.
 */
export function markRouteScrollTarget(element: Element) {
  // Apenas um item deve ter o destaque visual de "ultimo visualizado".
  document
    .querySelectorAll(`.${ROUTE_SCROLL_LAST_VIEWED_CLASS}`)
    .forEach((currentElement) => currentElement.classList.remove(ROUTE_SCROLL_LAST_VIEWED_CLASS));

  element.classList.add(ROUTE_SCROLL_LAST_VIEWED_CLASS);
}

/**
 * Função que protege o seletor quando ids/contextos possuem aspas ou barras.
 */
function escapeAttributeValue(value: string | number) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"');
}
