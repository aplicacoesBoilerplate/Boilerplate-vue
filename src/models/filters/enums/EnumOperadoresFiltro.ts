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
