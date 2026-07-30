/**
 * @description Gera cores HSL consistentes baseadas no valor do texto.
 * @param pValor Texto usado para gerar a cor.
 * @returns Cor em formato hexadecimal.
 */
export function gerarCores(pValor: string): string {
  let hash = 0;
  for (let i = 0; i < pValor.length; i += 1) {
    hash = pValor.charCodeAt(i) + ((hash << 5) - hash);
  }

  const matiz = Math.abs(hash) % 360;
  return converterHslParaHex(matiz, 68, 48);
}

function converterHslParaHex(pMatiz: number, pSaturacao: number, pLuminosidade: number): string {
  const saturacao = pSaturacao / 100;
  const luminosidade = pLuminosidade / 100;
  const croma = (1 - Math.abs(2 * luminosidade - 1)) * saturacao;
  const x = croma * (1 - Math.abs(((pMatiz / 60) % 2) - 1));
  const ajuste = luminosidade - croma / 2;

  let vermelho = 0;
  let verde = 0;
  let azul = 0;

  if (pMatiz < 60) {
    vermelho = croma;
    verde = x;
  } else if (pMatiz < 120) {
    vermelho = x;
    verde = croma;
  } else if (pMatiz < 180) {
    verde = croma;
    azul = x;
  } else if (pMatiz < 240) {
    verde = x;
    azul = croma;
  } else if (pMatiz < 300) {
    vermelho = x;
    azul = croma;
  } else {
    vermelho = croma;
    azul = x;
  }

  return `#${[vermelho, verde, azul]
    .map((pCanal) =>
      Math.round((pCanal + ajuste) * 255)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;
}

export function stringToColor(pStr: string): string {
  return gerarCores(pStr);
}
