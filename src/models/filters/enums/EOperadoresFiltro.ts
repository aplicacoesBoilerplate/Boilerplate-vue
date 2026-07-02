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
  [EOperadoresFiltro.IGUAL]: 'mdi-filter',
  [EOperadoresFiltro.DIFERENTE]: 'mdi-filter-off',
  [EOperadoresFiltro.COMECA_COM]: 'mdi-filter-plus',
  [EOperadoresFiltro.CONTEM]: 'mdi-filter-variant',
  [EOperadoresFiltro.NAO_CONTEM]: 'mdi-filter-remove',
  [EOperadoresFiltro.TERMINA_COM]: 'mdi-filter-check',
  [EOperadoresFiltro.ENTRE]: 'mdi-filter-outline',
  [EOperadoresFiltro.MAIOR_QUE]: 'mdi-filter-plus',
  [EOperadoresFiltro.MAIOR_IGUAL]: 'mdi-filter-plus',
  [EOperadoresFiltro.MENOR_QUE]: 'mdi-filter-minus',
  [EOperadoresFiltro.MENOR_IGUAL]: 'mdi-filter-minus',
  [EOperadoresFiltro.SELECAO]: 'mdi-filter-check',
  [EOperadoresFiltro.EXCECAO]: 'mdi-filter-off',
  [EOperadoresFiltro.VERDADEIRO]: 'mdi-filter-check',
  [EOperadoresFiltro.FALSO]: 'mdi-filter-off',
};

export const MAPEAMENTO_OPERADORES: IMapeamentoOperador[] = (
  Object.values(EOperadoresFiltro) as Array<EOperadoresFiltro>
).map((key) => ({
  valor: key,
  descricao: DESCRICAO_OPERADORES[key],
  icone: ICONE_OPERADORES[key],
}));
