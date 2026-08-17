// Ecossistema Vue
import { toRaw } from 'vue';

/**
 * @description Clona profundamente um valor desembrulhando proxies reativos do Vue.
 * Retorna dados puros (sem reatividade) e sem referências compartilhadas com a origem.
 * Não preserva instâncias especiais como Date, Map ou Set (modelos de dados puros).
 * @param pValor Valor a ser clonado (objeto, array ou primitivo).
 * @returns Cópia profunda independente do valor informado.
 */
export function deepClone<T>(pValor: T): T {
  const valor = toRaw(pValor);

  if (Array.isArray(valor)) {
    return valor.map((pItem) => deepClone(pItem)) as T;
  }

  if (valor !== null && typeof valor === 'object') {
    const clonado: Record<string, unknown> = {};
    for (const chave of Object.keys(valor)) {
      clonado[chave] = deepClone((valor as Record<string, unknown>)[chave]);
    }
    return clonado as T;
  }

  return valor;
}
