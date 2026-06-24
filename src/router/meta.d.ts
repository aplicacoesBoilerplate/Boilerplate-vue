// Ecossistema Vue
import "vue-router";

// Types e Interfaces
import type { IRouteMeta } from "@/models/model/ModelRouteMeta";

export {};

declare module "vue-router" {
  interface IModuleRouteMeta extends IRouteMeta {}
}
