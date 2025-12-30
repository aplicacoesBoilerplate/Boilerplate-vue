import type { ValueDataChart } from "@/classes/models/modelComponents/ModelGridDataChart";

const COLORS = [
  '#767119', '#9e850d', '#cb9700', '#ffa600',
  '#ff7b00', '#ff4d00', '#2196F3', '#4CAF50'
];

export function useChartHelpers(items: any[], campoKey: string): ValueDataChart[] {
  if (!items || items.length === 0) {
    return [];
  }

  const agrupado: Record<string, number> = {};
  const isNumericField = typeof items[0][campoKey] === 'number';

  items.forEach(item => {
    const valorChave = item[campoKey]; // ex: 2021
    const label = String(valorChave);

    if (!agrupado[label]) {
      agrupado[label] = 0;
    }

    agrupado[label] += 1;
  });

  return Object.keys(agrupado).map((key, index) => ({
    id: parseInt(key),
    title: key,
    value: agrupado[key],
    color: COLORS[index % COLORS.length]
  }));
}
