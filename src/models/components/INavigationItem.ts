/**
 * @description Item de navegação usado no menu lateral e barra superior.
 * @property {string} title - Título exibido no item do menu.
 * @property {string} icon - Ícone opcional exibido à esquerda do item.
 * @property {string} hotkey - Tecla de atalho para acessar a rota (ex: 'ctrl + m').
 * @property {string} to - Caminho (path) da rota.
 * @property {string} name - Nome registrado da rota no Vue Router.
 * @property {INavigationItem[]} children - Filhos aninhados (submenus), processados recursivamente.
 */
export interface INavigationItem {
  title: string;
  icon?: string;
  hotkey?: string;
  to?: string;
  name?: string;
  children?: INavigationItem[];
}
