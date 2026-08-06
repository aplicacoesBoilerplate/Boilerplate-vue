// Models
import type { IConfiguracaoCampo, TEntradaMapeamentoCampos } from "@/models/components/IMapeamentoCampos";
import type { IHeadersDataTable } from "@/models/components/lHeaderTable";
import type { ICampoFiltro } from "@/models/filters/ICampoFiltro";

/**
 * @description Contrato estrutural mínimo de uma configuração canônica de campo.
 * Permite projetar filtros e cabeçalhos sem depender do tipo concreto do registro
 * usado pela consulta auxiliar.
 *
 * @property {string} rotulo - Texto canônico reutilizado como descrição do filtro e título da tabela.
 * @property {object} filtro - Configuração opcional destinada à projeção de filtros.
 * @property {object} tabela - Configuração opcional destinada à projeção de cabeçalhos.
 */
type TConfiguracaoCampoBase = {
  rotulo: string;
  filtro?: object;
  tabela?: object;
};

/**
 * @description Projeta uma configuração canônica em seu respectivo campo de filtro.
 * Quando a configuração for uma união, o conditional type é distribuído e preserva
 * o tipo concreto de registro de cada consulta auxiliar.
 *
 * @template TCampo - União das chaves configuráveis do domínio.
 * @template TConfiguracao - Configuração canônica individual ou união de configurações.
 */
export type TCampoFiltroConfiguracao<TCampo extends string, TConfiguracao> =
  TConfiguracao extends IConfiguracaoCampo<TCampo, infer TRegistro>
    ? ICampoFiltro<TCampo, TRegistro>
    : never;

/**
 * @description Cria os campos de filtro a partir das entradas de um mapeamento canônico.
 * Ignora configurações que não possuem a propriedade `filtro`.
 *
 * @template TCampo - União das chaves configuráveis do domínio.
 * @template TConfiguracao - Configuração canônica individual ou união de configurações.
 * @param pEntradas - Entradas tipadas do mapeamento canônico.
 * @returns Campos disponíveis para o componente de filtros, preservando a união
 * dos tipos de consulta auxiliar.
 */
export function criarCamposFiltro<
  TCampo extends string,
  TConfiguracao extends TConfiguracaoCampoBase
>(
  pEntradas: TEntradaMapeamentoCampos<TCampo, TConfiguracao>[]
): TCampoFiltroConfiguracao<TCampo, TConfiguracao>[] {
  const lCampos = pEntradas.flatMap(([pValor, pConfiguracao]) => {
    if (!pConfiguracao.filtro) {
      return [];
    }

    return [
      {
        valor: pValor,
        descricao: pConfiguracao.rotulo,
        ...pConfiguracao.filtro,
      },
    ];
  });

  return lCampos as TCampoFiltroConfiguracao<TCampo, TConfiguracao>[];
}

/**
 * @description Cria os cabeçalhos de tabela a partir das entradas de um mapeamento canônico.
 * Ignora configurações que não possuem a propriedade `tabela`.
 *
 * @template TCampo - União das chaves configuráveis do domínio.
 * @template TConfiguracao - Configuração canônica individual ou união de configurações.
 * @param pEntradas - Entradas tipadas do mapeamento canônico.
 * @returns Cabeçalhos no formato esperado pelos componentes de tabela.
 */
export function criarCabecalhosTabela<
  TCampo extends string,
  TConfiguracao extends TConfiguracaoCampoBase
>(
  pEntradas: TEntradaMapeamentoCampos<TCampo, TConfiguracao>[],
): IHeadersDataTable[] {
  return pEntradas.flatMap(([pChave, pConfiguracao]) => {
    if (!pConfiguracao.tabela) {
      return [];
    }

    return [
      {
        key: pChave,
        title: pConfiguracao.rotulo,
        ...pConfiguracao.tabela,
      },
    ];
  });
}
