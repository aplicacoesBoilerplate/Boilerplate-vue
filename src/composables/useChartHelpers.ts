// Types e Interfaces
import type { IValorGrafico } from '@/models/components/IValorGrafico';

export function useChartHelpers(
  items: any[],
  campoAgrupamento: string,
  chartAgregacao: 'sum' | 'count' = 'count'
): IValorGrafico[] {
  if (!items || items.length === 0) {
    return [];
  }

  const agrupado = new Map<string, { valor: number; valorOriginal: unknown }>();

  items.forEach(item => {
    const valorOriginal = item[campoAgrupamento];
    const chave = String(valorOriginal);

    let valorInicial = 1;

    if (chartAgregacao === 'sum') {
      valorInicial = Number(item[campoAgrupamento]) || 0;
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

  return Array.from(agrupado.entries()).map(([key, grupo], index) => ({
    id: index,
    titulo: key,
    valorOriginal: grupo.valorOriginal,
    valor: grupo.valor,
  }));
}
