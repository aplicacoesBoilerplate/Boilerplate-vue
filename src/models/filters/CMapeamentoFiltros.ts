// Types e Interfaces
import { ERecursosFiltro } from './enums/ERecursosFiltro';
import type { ICampoFiltro } from './ICampoFiltro';
import { MAPEAMENTO_CAMPOS_FILTRO_USUARIO } from '@/models/model/usuario/MapeamentoFiltrosUsuario';

// Mapeamentos dos recursos para aplicação de filtros.
export const MAPEAMENTO_FILTROS: Record<ERecursosFiltro, ICampoFiltro<any>[]> = {
  [ERecursosFiltro.USUARIOS]: MAPEAMENTO_CAMPOS_FILTRO_USUARIO,
};
