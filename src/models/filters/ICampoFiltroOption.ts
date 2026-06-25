// Types e Interfaces
import type { EFilterType } from "./enums/EnumFilterType";

export interface ICampoFiltroOption<T> {
  /** O valor da opção do campo selecionado que será utilizado no filtro */
  valor: T;
  /** A descrição do campo que será exibida no filtro */
  descricao: string;
  /** O ícone que será exibido no filtro */
  icone: string;
  /** Os tipos de dados do campo que serão aceitos no filtro */
  tipos: EFilterType[];
}
