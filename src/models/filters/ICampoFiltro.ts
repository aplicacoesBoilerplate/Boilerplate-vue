// Types e Interfaces
import type { ETipoFiltro } from './enums/ETipoFiltro';
import type { EOperadoresFiltro } from './enums/EOperadoresFiltro';

export interface IOpcaoFiltro {
  valor: any;
  descricao: string;
}

export interface ICampoFiltro<T> {
  /** O valor da opção do campo selecionado que será utilizado no filtro */
  valor: T;
  /** A descrição do campo que será exibida no filtro */
  descricao: string;
  /** O ícone que será exibido no filtro */
  icone: string;
  /** Os tipos de dados do campo que serão aceitos no filtro */
  tipos: ETipoFiltro[];
  /** Suporte a campos de objetos aninhados (recursivo). */
  filhos?: ICampoFiltro<T>[];
  /** Opções disponíveis quando o tipo for SELECT */
  opcoes?: IOpcaoFiltro[];
  /** Operadores específicos permitidos para este campo */
  operadores?: EOperadoresFiltro[];
  /** Indica se este é o campo utilizado por padrão quando o usuário usar a barra de busca rápida (Ex: Nome) */
  pesquisaPadrao?: boolean;
  /** Operador utilizado pela busca rápida para o campo padrão (Ex: CONTEM, IGUAL) */
  operadorPesquisaPadrao?: EOperadoresFiltro;
}
