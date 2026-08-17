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
  [EOperadoresFiltro.IGUAL]: { descricao: EOperadoresFiltro.IGUAL, icone: 'mdi-equal' },
  [EOperadoresFiltro.DIFERENTE]: { descricao: EOperadoresFiltro.DIFERENTE, icone: 'mdi-not-equal-variant' },
  [EOperadoresFiltro.COMECA_COM]: { descricao: EOperadoresFiltro.COMECA_COM, icone: 'mdi-contain-start' },
  [EOperadoresFiltro.CONTEM]: { descricao: EOperadoresFiltro.CONTEM, icone: 'mdi-contain' },
  [EOperadoresFiltro.NAO_CONTEM]: { descricao: EOperadoresFiltro.NAO_CONTEM, icone: 'mdi-label-off-outline' },
  [EOperadoresFiltro.TERMINA_COM]: { descricao: EOperadoresFiltro.TERMINA_COM, icone: 'mdi-contain-end' },
  [EOperadoresFiltro.ENTRE]: { descricao: EOperadoresFiltro.ENTRE, icone: 'mdi-ray-start-end' },
  [EOperadoresFiltro.MAIOR_QUE]: { descricao: EOperadoresFiltro.MAIOR_QUE, icone: 'mdi-greater-than' },
  [EOperadoresFiltro.MAIOR_IGUAL]: { descricao: EOperadoresFiltro.MAIOR_IGUAL, icone: 'mdi-greater-than-or-equal' },
  [EOperadoresFiltro.MENOR_QUE]: { descricao: EOperadoresFiltro.MENOR_QUE, icone: 'mdi-less-than' },
  [EOperadoresFiltro.MENOR_IGUAL]: { descricao: EOperadoresFiltro.MENOR_IGUAL, icone: 'mdi-less-than-or-equal' },
  [EOperadoresFiltro.SELECAO]: { descricao: EOperadoresFiltro.SELECAO, icone: 'mdi-check-circle' },
  [EOperadoresFiltro.EXCECAO]: { descricao: EOperadoresFiltro.EXCECAO, icone: 'mdi-close-circle-outline' },
  [EOperadoresFiltro.VERDADEIRO]: { descricao: EOperadoresFiltro.VERDADEIRO, icone: 'mdi-check-circle' },
  [EOperadoresFiltro.FALSO]: { descricao: EOperadoresFiltro.FALSO, icone: 'mdi-circle-off-outline' },
};

export const MAPEAMENTO_OPERADORES: IOpcaoSelecao[] = (
  Object.entries(MAPEAMENTO_MODEL_OPERADORES) as [EOperadoresFiltro, TMapear][]
).map(([pOperador, pConfig]) => ({
  valor: pOperador,
  ...pConfig,
}));
