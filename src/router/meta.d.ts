import type { IRouteMeta } from '@/classes/models/ModelRouteMeta'
import 'vue-router'

export {}

declare module 'vue-router' {
  interface IModuleRouteMeta extends IRouteMeta {}
}
