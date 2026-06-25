// Types e Interfaces
import type { EFilterResources } from '../filters/enums/EFilterResource';
import type { TRole } from './users/lUser';

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
  /** Cargos para os quais a rota está disponível. */
  authorize?: TRole[];
  /** As rotas filhas. */
  children?: IRouteMeta[];
  /** O recurso de filtros da rota. */
  filterResource?: EFilterResources;
}
