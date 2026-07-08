// Types e Interfaces
import type { ICampoFiltro } from '../filters/ICampoFiltro';

export interface IRouteMeta {
  /** O caminho da rota. */
  path: string;

  name?: string;
  title?: string;
  icon?: string;

  /** A tecla de atalho da rota. */
  hotkey?: string;
  /** Se a rota deve ser oculta na navegação (também determina que ela usará o layout Default). */
  hidden?: boolean;
  /** Se a rota requer autenticação. */
  requiresAuth?: boolean;
  /** As rotas filhas. */
  children?: IRouteMeta[];
  /** Os campos disponíveis para filtro nesta rota. */
  filterResource?: ICampoFiltro<any>[];
  /** Contexto usado para isolar filtros aplicados por recurso. */
  filterContext?: string;
}
