export interface INavigationItem {
  /** Titulo exibido no item do menu. */
  title: string;
  /** Icone opcional exibido a esquerda do item. */
  icon?: string;
  /** Tecla de atalho para acessar a rota, ex: 'ctrl+m'. */
  hotkey?: string;
  /** Caminho (path) da rota. */
  to?: string;
  /** Nome registrado da rota no Vue Router. */
  name?: string;
  /**
   * Filhos aninhados (submenus).
   * Componente lida com esse atributo de forma recursiva.
   * */
  children?: INavigationItem[];
}
