/**
 * @description Icone do Material Design preparado para busca e renderizacao.
 *
 * @property {string} nome - Nome do icone sem o prefixo `mdi-`.
 * @property {string} valor - Nome do icone com o prefixo `mdi-`.
 * @property {string[]} aliases - Termos alternativos aceitos na busca.
 */
export interface IIconeMaterialDesign {
  nome: string;
  valor: string;
  aliases: string[];
}

/**
 * @description Estrutura relevante do metadado publico disponibilizado pelo pacote `@mdi/svg`.
 *
 * @property {string} name - Nome do icone sem o prefixo `mdi-`.
 * @property {string[]} aliases - Termos alternativos cadastrados para o icone.
 */
export interface IMetadadoIconeMaterialDesign {
  name: string;
  aliases: string[];
}
