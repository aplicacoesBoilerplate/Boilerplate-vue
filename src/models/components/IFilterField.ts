// Interface para uso no componente DialogFiltros - Tipo do campo selecionado pelo usuário para aplicar filtro.
export interface IFilterField {
  /** Chave do campo equivalente ao backend (ex: 'cdClient'). */
  key: string;
  /** Label de exibicao amigavel (ex: 'Codigo do Cliente'). */
  label: string;
  /** Icone do Vuetify (ex: 'mdi-account'). */
  icon?: string;
  /** Tipo primitivo para definir as operacoes permitidas (ex: 'string', 'number', 'date', 'boolean'). */
  type?: "string" | "number" | "date" | "boolean";
  /** Suporte a campos de objetos aninhados (recursivo). */
  children?: IFilterField[];
}
