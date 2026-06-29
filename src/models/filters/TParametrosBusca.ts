// Types e Interfaces
import type { IFiltrosConsulta } from '@/models/filters/IFiltrosConsulta';

export type TParametrosBusca = {
  queryBasica?: string;
  filtros?: IFiltrosConsulta[];
};
