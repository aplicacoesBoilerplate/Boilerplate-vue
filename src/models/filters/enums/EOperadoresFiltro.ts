// Types e Interfaces
import type { IOpcaoSelecao } from '@/models/filters/ICampoFiltro';

export enum EOperadoresFiltro {
  IGUAL = 'igual',
  DIFERENTE = 'diferente',
  COMECA_COM = 'comecaCom',
  CONTEM = 'contem',
  NAO_CONTEM = 'naoContem',
  TERMINA_COM = 'terminaCom',
  ENTRE = 'entre',
  MAIOR_QUE = 'maiorQue',
  MAIOR_IGUAL = 'maiorIgual',
  MENOR_QUE = 'menorQue',
  MENOR_IGUAL = 'menorIgual',
  SELECAO = 'selecao',
  EXCECAO = 'excecao',
  VERDADEIRO = 'verdadeiro',
  FALSO = 'falso',
}

type TMapear = Omit<IOpcaoSelecao, 'valor'>;
type TMapeamentoEOperadoresFiltro = Record<EOperadoresFiltro, TMapear>;

const MAPEAMENTO_MODEL_OPERADORES: TMapeamentoEOperadoresFiltro = {
  [EOperadoresFiltro.IGUAL]: { descricao: 'Igual', icone: 'mdi-equal' },
  [EOperadoresFiltro.DIFERENTE]: { descricao: 'Diferente', icone: 'mdi-not-equal-variant' },
  [EOperadoresFiltro.COMECA_COM]: { descricao: 'Começa com', icone: 'mdi-contain-start' },
  [EOperadoresFiltro.CONTEM]: { descricao: 'Contém', icone: 'mdi-contain' },
  [EOperadoresFiltro.NAO_CONTEM]: { descricao: 'Não contém', icone: 'mdi-label-off-outline' },
  [EOperadoresFiltro.TERMINA_COM]: { descricao: 'Termina com', icone: 'mdi-contain-end' },
  [EOperadoresFiltro.ENTRE]: { descricao: 'Entre', icone: 'mdi-ray-start-end' },
  [EOperadoresFiltro.MAIOR_QUE]: { descricao: 'Maior que', icone: 'mdi-greater-than' },
  [EOperadoresFiltro.MAIOR_IGUAL]: { descricao: 'Maior ou igual', icone: 'mdi-greater-than-or-equal' },
  [EOperadoresFiltro.MENOR_QUE]: { descricao: 'Menor que', icone: 'mdi-less-than' },
  [EOperadoresFiltro.MENOR_IGUAL]: { descricao: 'Menor ou igual', icone: 'mdi-less-than-or-equal' },
  [EOperadoresFiltro.SELECAO]: { descricao: 'Seleção', icone: 'mdi-check-circle' },
  [EOperadoresFiltro.EXCECAO]: { descricao: 'Exceção', icone: 'mdi-close-circle-outline' },
  [EOperadoresFiltro.VERDADEIRO]: { descricao: 'Verdadeiro', icone: 'mdi-check-circle' },
  [EOperadoresFiltro.FALSO]: { descricao: 'Falso', icone: 'mdi-circle-off-outline' },
};

export const MAPEAMENTO_OPERADORES: IOpcaoSelecao[] = (
  Object.entries(MAPEAMENTO_MODEL_OPERADORES) as [EOperadoresFiltro, TMapear][]
).map(([pOperador, pConfig]) => ({
  valor: pOperador,
  ...pConfig,
}));
