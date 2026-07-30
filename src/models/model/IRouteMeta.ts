// Types e Interfaces
import type { ICampoFiltro } from '../filters/ICampoFiltro';

/**
 * @description Metadados associados a cada rota do sistema, usados para navegação, filtros e controle de exibição.
 * @property {string} path - Caminho da rota.
 * @property {string} name - Nome registrado da rota no Vue Router.
 * @property {string} title - Título exibido na interface para a rota.
 * @property {string} icon - Ícone associado à rota.
 * @property {string} hotkey - Tecla de atalho para navegação (ex: 'ctrl + m').
 * @property {boolean} hidden - Se verdadeiro, a rota não aparece na navegação e usa layout Default.
 * @property {boolean} requiresAuth - Se a rota requer autenticação.
 * @property {IRouteMeta[]} children - Rotas filhas para agrupamento na navegação.
 * @property {ICampoFiltro<any>[]} filterResource - Campos disponíveis para filtro nesta rota.
 * @property {string} filterContext - Contexto usado para isolar filtros aplicados por recurso.
 */
export interface IRouteMeta {
  path: string;
  name?: string;
  title?: string;
  icon?: string;
  hotkey?: string;
  hidden?: boolean;
  requiresAuth?: boolean;
  children?: IRouteMeta[];
  filterResource?: ICampoFiltro<any>[];
  filterContext?: string;
}
