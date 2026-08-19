// Types e Interfaces
import type { IValorGrafico } from '@/models/components/IValorGrafico';

export function useChartHelpers(
  pItems: readonly object[],
  pCampoAgrupamento: string,
  pChartAgregacao: 'sum' | 'count' = 'count',
): IValorGrafico[] {
  if (!pItems || pItems.length === 0) {
    return [];
  }

  const agrupado = new Map<string, { valor: number; valorOriginal: unknown }>();

  pItems.forEach((pItem) => {
    const item = pItem as Record<string, unknown>;
    const valorOriginal = item[pCampoAgrupamento];
    const chave = String(valorOriginal);

    let valorInicial = 1;

    if (pChartAgregacao === 'sum') {
      valorInicial = Number(item[pCampoAgrupamento]) || 0;
    }

    if (!agrupado.has(chave)) {
      agrupado.set(chave, {
        valor: 0,
        valorOriginal,
      });
    }

    const grupo = agrupado.get(chave);
    if (grupo) {
      grupo.valor += valorInicial;
    }
  });

  return Array.from(agrupado.entries()).map(([pKey, pGrupo], pIndex) => ({
    id: pIndex,
    titulo: pKey,
    valorOriginal: pGrupo.valorOriginal,
    valor: pGrupo.valor,
  }));
}
