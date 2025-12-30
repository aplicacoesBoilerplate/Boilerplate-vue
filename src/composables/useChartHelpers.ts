import type { ValueDataChart } from "@/classes/models/modelComponents/ModelGridDataChart";
import { stringToColor } from "@/utils/generateColors";

export function useChartHelpers(
  items: any[],
  campoAgrupamento: string,
  chartAgregacao: 'sum' | 'count' = 'count'
): ValueDataChart[] {
  if (!items || items.length === 0) {
    return [];
  }

  const agrupado: Record<string, number> = {};

  items.forEach(item => {
    const chave = String(item[campoAgrupamento]);

    let valorInicial = 1;

    if (chartAgregacao === 'sum') {
        valorInicial = Number(item[campoAgrupamento]) || 0;
    }

    if (!agrupado[chave]) {
      agrupado[chave] = 0;
    }

    agrupado[chave] += valorInicial;
  });

  return Object.keys(agrupado).map((key, index) => ({
    key: key,
    id: index,
    title: key,
    value: agrupado[key],
    color: stringToColor(key)
  }));
}
