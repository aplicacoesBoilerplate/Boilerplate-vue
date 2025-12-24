export interface IRouteMeta {
  path: string;
  name?: string;
  title?: string;
  icon?: string;
  hotKey?: string;
  hidden?: boolean;
  requiresAuth?: boolean;
  authorize?: string[];
  children?: IRouteMeta[];
}
