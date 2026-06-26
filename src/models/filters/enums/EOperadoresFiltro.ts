// Enumeração que representa os operadores disponíveis para aplicação de filtros.
export enum EOperadoresFiltro {
  /** Usado para filtros de texto. */
  CONTEM = 'contem',
  /** Usado para filtros de texto. */
  NAO_CONTEM = 'naoContem',
  /** Usado para filtros de texto e seleção. */
  IGUAL = 'igual',
  /** Usado para filtros de texto e seleção. */
  DIFERENTE = 'diferente',
  /** Usado para filtros de texto. */
  COMECA_COM = 'comecaCom',
  /** Usado para filtros de texto. */
  TERMINA_COM = 'terminaCom',
  /** Usado para filtros numéricos. */
  MAIOR_QUE = 'maiorQue',
  /** Usado para filtros numéricos. */
  MENOR_QUE = 'menorQue',
  /** Usado para filtros de data e número. */
  ENTRE = 'entre',
  /** Usado para filtros de seleção. */
  SELECAO = 'selecao',
  /** Usado para filtros de seleção. */
  EXCECAO = 'excecao',
}

export interface IMapeamentoOperador {
  valor: EOperadoresFiltro;
  descricao: string;
  icone: string;
}

const DESCRICAO_OPERADORES: Record<EOperadoresFiltro, string> = {
  [EOperadoresFiltro.CONTEM]: 'Contém',
  [EOperadoresFiltro.NAO_CONTEM]: 'Não contém',
  [EOperadoresFiltro.IGUAL]: 'Igual',
  [EOperadoresFiltro.DIFERENTE]: 'Diferente',
  [EOperadoresFiltro.COMECA_COM]: 'Começa com',
  [EOperadoresFiltro.TERMINA_COM]: 'Termina com',
  [EOperadoresFiltro.MAIOR_QUE]: 'Maior que',
  [EOperadoresFiltro.MENOR_QUE]: 'Menor que',
  [EOperadoresFiltro.ENTRE]: 'Entre',
  [EOperadoresFiltro.SELECAO]: 'Seleção',
  [EOperadoresFiltro.EXCECAO]: 'Exceção',
};

const ICONE_OPERADORES: Record<EOperadoresFiltro, string> = {
  [EOperadoresFiltro.CONTEM]: 'mdi-filter-variant',
  [EOperadoresFiltro.NAO_CONTEM]: 'mdi-filter-remove',
  [EOperadoresFiltro.IGUAL]: 'mdi-filter',
  [EOperadoresFiltro.DIFERENTE]: 'mdi-filter-off',
  [EOperadoresFiltro.COMECA_COM]: 'mdi-filter-plus',
  [EOperadoresFiltro.TERMINA_COM]: 'mdi-filter-check',
  [EOperadoresFiltro.MAIOR_QUE]: 'mdi-filter-plus',
  [EOperadoresFiltro.MENOR_QUE]: 'mdi-filter-minus',
  [EOperadoresFiltro.ENTRE]: 'mdi-filter-outline',
  [EOperadoresFiltro.SELECAO]: 'mdi-filter-check',
  [EOperadoresFiltro.EXCECAO]: 'mdi-filter-off',
};

export const MAPEAMENTO_OPERADORES: IMapeamentoOperador[] = (
  Object.values(EOperadoresFiltro) as Array<EOperadoresFiltro>
).map((key) => ({
  valor: key,
  descricao: DESCRICAO_OPERADORES[key],
  icone: ICONE_OPERADORES[key],
}));
