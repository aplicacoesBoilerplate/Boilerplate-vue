import type { FilterColumn } from '../ClassDefinitions'

export interface IRouteMeta {
  path: string
  name?: string
  title?: string
  icon?: string
  hotkey?: string
  hidden?: boolean
  requiresAuth?: boolean
  authorize?: string[]
  children?: IRouteMeta[]
  hasFilters?: boolean
  filterConfig?: FilterColumn[]
}
