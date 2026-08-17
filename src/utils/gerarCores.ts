/**
 * @description Divide o Espectro de 360 graus pelo número de fatias (series).
 * @param {number} pSeries - Quantidade de cores que devem ser geradas baseado nos dados renderizados no gráfico.
 * @returns Hexadecimais de cores para serem renderizadas em gráficos, sem repetição.
 */
export function gerarCores(pSeries: number) {
  const cores = [];
  for(let i = 0; i < pSeries; i++) {
    const hue = Math.floor((360 / pSeries) * i);
    cores.push(`hsl(${hue}, 70%, 50%)`);
  }
  return cores;
}
