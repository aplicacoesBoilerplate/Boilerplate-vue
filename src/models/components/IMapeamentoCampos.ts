import type { IHeadersDataTable } from './lHeaderTable';
import type { ICampoFiltro } from '@/models/filters/ICampoFiltro';

/**
 * @description Configuração canônica de um campo que pode alimentar filtros e colunas de tabela.
 * @template TCampo - União das chaves configuráveis.
 * @template TRegistro - Registro consultado pela configuração auxiliar de filtros.
 * 
 * @property {string} rotulo - É a descrição amigável extraído por ICampoFiltro e IHeadersDataTable possuem atributos diferentes com a mesma finalidade.
 * @property {Omit<ICampoFiltro<TCampo, TRegistro>, 'valor' | 'descricao'>} filtro - Mapeamento para os atributos de filtros de um Model.
 * @property {Omit<IHeadersDataTable, 'key' | 'title'>} tabela - Mapeamentos para os atributos de tabela de um Model.
 */
export interface IConfiguracaoCampo<TCampo extends string, TRegistro extends object> {
  rotulo: string;
  filtro?: Omit<ICampoFiltro<TCampo, TRegistro>, 'valor' | 'descricao'>;
  tabela?: Omit<IHeadersDataTable, 'key' | 'title'>;
}

/**
 * @description Mapeamento completo das configurações de campos de um domínio.
 * @template TCampo - União das chaves configuráveis do domínio.
 * @template TConfiguracao - Configuração associada ao campo.
 */
export type TMapeamentoCampos<TCampo extends string, TConfiguracao> = Record<
  TCampo,
  TConfiguracao
>;

/**
 * @description Representa uma entrada tipada de um mapeamento de campos.
 * @template TCampo - União das chaves configuráveis do domínio.
 * @template TConfiguracao - Configuração associada ao campo.
 */
export type TEntradaMapeamentoCampos<TCampo extends string, TConfiguracao> = [
  TCampo,
  TConfiguracao,
];

/**
 * @description Converte um mapeamento de campos em entradas tipadas.
 * @template TCampo - União das chaves configuráveis do domínio.
 * @template TConfiguracao - Configuração associada ao campo.
 * 
 * @param pMapeamento - Mapeamento canônico dos campos do domínio.
 * @returns Entradas tipadas contendo a chave e sua configuração.
 */
export function obterEntradasMapeamentoCampos<TCampo extends string, TConfiguracao>(
  pMapeamento: TMapeamentoCampos<TCampo, TConfiguracao>,
): TEntradaMapeamentoCampos<TCampo, TConfiguracao>[] {
  return Object.entries(pMapeamento) as TEntradaMapeamentoCampos<TCampo, TConfiguracao>[];
}
