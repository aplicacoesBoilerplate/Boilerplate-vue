type TDadoComCor = {
  cor?: string;
  valorOriginal?: unknown;
};

const CORES_BOOLEANAS: Record<string, string> = {
  false: '#C62828',
  true: '#2E7D32',
};

/**
 * @description Gera cores para dados de gráficos, priorizando cores configuradas e valores booleanos semânticos.
 * @param {readonly TDadoComCor[]} pDados Dados renderizados no gráfico.
 * @param {Record<string, string>} pMapeamentoCores Cores opcionais indexadas pelo valor original do dado.
 * @returns Cores a serem aplicadas aos dados na mesma ordem recebida.
 */
export function gerarCores(pDados: readonly object[], pMapeamentoCores: Record<string, string> = {}): string[] {
  return pDados.map((pDado, pIndex) => {
    const lDado = pDado as TDadoComCor;
    const lValorOriginal = lDado.valorOriginal;
    const lCorMapeada = pMapeamentoCores[String(lValorOriginal)];

    if (lCorMapeada) return lCorMapeada;
    if (lDado.cor) return lDado.cor;
    if (typeof lValorOriginal === 'boolean') return CORES_BOOLEANAS[String(lValorOriginal)];

    const hue = Math.floor((360 / pDados.length) * pIndex);
    return `hsl(${hue}, 70%, 50%)`;
  });
}
