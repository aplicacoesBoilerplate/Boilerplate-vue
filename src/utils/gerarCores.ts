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
    const dado = pDado as TDadoComCor;
    const valorOriginal = dado.valorOriginal;
    const corMapeada = pMapeamentoCores[String(valorOriginal)];

    if (corMapeada) return corMapeada;
    if (dado.cor) return dado.cor;
    if (typeof valorOriginal === 'boolean') return CORES_BOOLEANAS[String(valorOriginal)];

    const hue = Math.floor((360 / pDados.length) * pIndex);
    return `hsl(${hue}, 70%, 50%)`;
  });
}
