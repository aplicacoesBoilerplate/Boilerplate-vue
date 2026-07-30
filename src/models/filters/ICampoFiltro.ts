// Types e Interfaces
import type { EOperadoresFiltro } from './enums/EOperadoresFiltro';
import type { ETipoFiltro } from './enums/ETipoFiltro';
import type { IConsultaRegistrosFiltro } from './IConsultaRegistrosFiltro';

export interface IOpcaoSelecao {
  valor: unknown;
  descricao: string;
  icone?: string;
}

/**
 * @description Interface genérica responsável por representar os campos disponíveis para o filtro.
 * @template T - O tipo do valor do campo.
 * @template TRegistroConsulta - O tipo do registro de consulta auxiliar.
 * @property {T} valor - O valor da opção do campo selecionado que será utilizado no filtro
 * @property {string} descricao - A descrição do campo que será exibida no filtro
 * @property {string} icone - O ícone que será exibido no filtro
 * @property {ETipoFiltro[]} tipos - Os tipos de dados do campo que serão aceitos no filtro
 * @property {ICampoFiltro<T>[]} filhos - Suporte a campos de objetos aninhados (recursivo)
 * @property {IOpcaoSelecao[]} opcoes - Opções disponíveis quando o tipo for SELECT
 * @property {EOperadoresFiltro[]} operadores - Operadores específicos permitidos para este campo
 * @property {boolean} pesquisaPadrao - Indica se este é o campo utilizado por padrão quando o usuário usar a barra de busca rápida (Ex: Nome)
 * @property {EOperadoresFiltro} operadorPesquisaPadrao - Operador utilizado pela busca rápida para o campo padrão (Ex: CONTEM, IGUAL)
 * @property {IConsultaRegistrosFiltro<TRegistroConsulta>} consultaRegistros - Configuração da consulta auxiliar de registros disponível para este campo
 * @property {boolean} disponivelAgrupamento - Indica se este campo está disponível para agrupamento no gráfico.
 */
export interface ICampoFiltro<T, TRegistroConsulta extends object = Record<string, unknown>> {
  valor: T;
  descricao: string;
  icone: string;
  tipos: ETipoFiltro[];
  filhos?: ICampoFiltro<T>[];
  opcoes?: IOpcaoSelecao[];
  operadores?: EOperadoresFiltro[];
  pesquisaPadrao?: boolean;
  operadorPesquisaPadrao?: EOperadoresFiltro;
  consultaRegistros?: IConsultaRegistrosFiltro<TRegistroConsulta>;
  disponivelAgrupamento?: boolean;
}
