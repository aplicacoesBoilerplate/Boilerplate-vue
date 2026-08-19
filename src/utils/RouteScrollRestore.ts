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
export function getRouteScrollSelector(pRoute: Pick<RouteLocationNormalizedLoaded, 'query'>) {
  const scrollTarget = pRoute.query[ROUTE_SCROLL_SELECTOR_QUERY];

  if (Array.isArray(scrollTarget)) {
    return scrollTarget[0] ?? null;
  }

  return scrollTarget ?? null;
}

/**
 * @description Constrói um seletor composto para evitar colisão quando listas diferentes renderizam ids iguais.
 * @param pContextId Identificador do contexto da lista.
 * @param pItemKey Chave do item dentro da lista.
 * @returns Seletor CSS composto para localizar o item.
 */
export function buildRouteScrollSelector(pContextId: string, pItemKey: string | number) {
  return [
    `[data-scroll-context="${escapeAttributeValue(pContextId)}"]`,
    `[data-scroll-key="${escapeAttributeValue(pItemKey)}"]`,
  ].join('');
}

/**
 * @description Cria os bindings usados para encontrar um item depois que a lista restaura seu contexto.
 * @param pContextId Identificador do contexto da lista.
 * @param pItemKey Chave do item dentro da lista.
 * @returns Atributos de classe e dados para o elemento restaurável.
 */
export function createRouteScrollItemBindings(pContextId: string, pItemKey: string | number) {
  return {
    class: ROUTE_SCROLL_TARGET_CLASS,
    'data-scroll-context': pContextId,
    'data-scroll-key': String(pItemKey),
    'data-scroll-selector': buildRouteScrollSelector(pContextId, pItemKey),
  };
}

/**
 * @description Aguarda por uma janela curta até que o elemento de scroll seja renderizado.
 * @param pSelector Seletor CSS do elemento aguardado.
 * @param pTimeoutMs Tempo máximo de espera em milissegundos.
 * @returns Elemento encontrado ou `null` quando o tempo se esgota.
 */
export function waitForRouteScrollTarget(
  pSelector: string,
  pTimeoutMs = DEFAULT_WAIT_TIMEOUT_MS,
): Promise<Element | null> {
  const startedAt = Date.now();

  // Infinite scroll/cache pode renderizar depois do scrollBehavior iniciar; aguardamos por janela curta.
  return new Promise((pResolve) => {
    const tick = () => {
      const element = document.querySelector(pSelector);

      if (element) {
        pResolve(element);
        return;
      }

      if (Date.now() - startedAt >= pTimeoutMs) {
        pResolve(null);
        return;
      }

      window.setTimeout(tick, DEFAULT_WAIT_INTERVAL_MS);
    };

    tick();
  });
}

/**
 * @description Marca visualmente o item como o último visualizado na navegação.
 * @param pElement Elemento que receberá a marcação.
 */
export function markRouteScrollTarget(pElement: Element) {
  // Apenas um item deve ter o destaque visual de "ultimo visualizado".
  document
    .querySelectorAll(`.${ROUTE_SCROLL_LAST_VIEWED_CLASS}`)
    .forEach((pCurrentElement) => pCurrentElement.classList.remove(ROUTE_SCROLL_LAST_VIEWED_CLASS));

  pElement.classList.add(ROUTE_SCROLL_LAST_VIEWED_CLASS);
}

/**
 * @description Protege o valor do seletor quando ids ou contextos possuem aspas e barras.
 * @param pValue Valor inserido no seletor de atributo.
 * @returns Valor escapado para uso seguro no seletor CSS.
 */
function escapeAttributeValue(pValue: string | number) {
  return String(pValue).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}
