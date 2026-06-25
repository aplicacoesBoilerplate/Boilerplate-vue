// Types e Interfaces
import type { ETipoFiltro } from './enums/EnumTipoFiltro';

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
}
