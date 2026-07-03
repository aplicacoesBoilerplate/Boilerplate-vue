// Enumeração que representa os operadores disponíveis para aplicação de filtros.
export enum EOperadoresFiltro {
  /** Usado para filtros de texto e seleção. */
  IGUAL = 'igual',
  /** Usado para filtros de texto e seleção. */
  DIFERENTE = 'diferente',
  /** Usado para filtros de texto. */
  COMECA_COM = 'comecaCom',
  /** Usado para filtros de texto. */
  CONTEM = 'contem',
  /** Usado para filtros de texto. */
  NAO_CONTEM = 'naoContem',
  /** Usado para filtros de texto. */
  TERMINA_COM = 'terminaCom',
  /** Usado para filtros de intervalo. */
  ENTRE = 'entre',
  /** Usado para filtros numéricos. */
  MAIOR_QUE = 'maiorQue',
  /** Usado para filtros numéricos. */
  MAIOR_IGUAL = 'maiorIgual',
  /** Usado para filtros numéricos. */
  MENOR_QUE = 'menorQue',
  /** Usado para filtros de data e número. */
  MENOR_IGUAL = 'menorIgual',
  /** Usado para filtros de seleção. */
  SELECAO = 'selecao',
  /** Usado para filtros de seleção. */
  EXCECAO = 'excecao',
  /** Usado para filtros booleanos. */
  VERDADEIRO = 'verdadeiro',
  /** Usado para filtros booleanos. */
  FALSO = 'falso',
}

export interface IMapeamentoOperador {
  valor: EOperadoresFiltro;
  descricao: string;
  icone: string;
}

const DESCRICAO_OPERADORES: Record<EOperadoresFiltro, string> = {
  [EOperadoresFiltro.IGUAL]: 'Igual',
  [EOperadoresFiltro.DIFERENTE]: 'Diferente',
  [EOperadoresFiltro.COMECA_COM]: 'Começa com',
  [EOperadoresFiltro.CONTEM]: 'Contém',
  [EOperadoresFiltro.NAO_CONTEM]: 'Não contém',
  [EOperadoresFiltro.TERMINA_COM]: 'Termina com',
  [EOperadoresFiltro.ENTRE]: 'Entre',
  [EOperadoresFiltro.MAIOR_QUE]: 'Maior que',
  [EOperadoresFiltro.MAIOR_IGUAL]: 'Maior ou igual',
  [EOperadoresFiltro.MENOR_QUE]: 'Menor que',
  [EOperadoresFiltro.MENOR_IGUAL]: 'Menor ou igual',
  [EOperadoresFiltro.SELECAO]: 'Seleção',
  [EOperadoresFiltro.EXCECAO]: 'Exceção',
  [EOperadoresFiltro.VERDADEIRO]: 'Verdadeiro',
  [EOperadoresFiltro.FALSO]: 'Falso',
};

const ICONE_OPERADORES: Record<EOperadoresFiltro, string> = {
  [EOperadoresFiltro.IGUAL]: 'mdi-equal',
  [EOperadoresFiltro.DIFERENTE]: 'mdi-not-equal-variant',
  [EOperadoresFiltro.COMECA_COM]: 'mdi-contain-start',
  [EOperadoresFiltro.CONTEM]: 'mdi-contain',
  [EOperadoresFiltro.NAO_CONTEM]: 'mdi-label-off-outline',
  [EOperadoresFiltro.TERMINA_COM]: 'mdi-contain-end',
  [EOperadoresFiltro.ENTRE]: 'mdi-ray-start-end',
  [EOperadoresFiltro.MAIOR_QUE]: 'mdi-greater-than',
  [EOperadoresFiltro.MAIOR_IGUAL]: 'mdi-greater-than-or-equal',
  [EOperadoresFiltro.MENOR_QUE]: 'mdi-less-than',
  [EOperadoresFiltro.MENOR_IGUAL]: 'mdi-less-than-or-equal',
  [EOperadoresFiltro.SELECAO]: 'mdi-check-circle',
  [EOperadoresFiltro.EXCECAO]: 'mdi-close-circle-outline',
  [EOperadoresFiltro.VERDADEIRO]: 'mdi-check-circle',
  [EOperadoresFiltro.FALSO]: 'mdi-circle-off-outline',
};

export const MAPEAMENTO_OPERADORES: IMapeamentoOperador[] = (
  Object.values(EOperadoresFiltro) as Array<EOperadoresFiltro>
).map((key) => ({
  valor: key,
  descricao: DESCRICAO_OPERADORES[key],
  icone: ICONE_OPERADORES[key],
}));
