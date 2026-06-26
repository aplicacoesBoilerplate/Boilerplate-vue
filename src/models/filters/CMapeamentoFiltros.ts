// Types e Interfaces
import type { ICampoFiltro } from './ICampoFiltro';

// Enums
import { ERecursosFiltro } from './enums/ERecursosFiltro';

// Constantes
import { MAPEAMENTO_CAMPOS_FILTRO_USUARIO } from '@/models/model/usuario/MapeamentoFiltrosUsuario';

// Mapeamentos dos recursos para aplicação de filtros.
export const MAPEAMENTO_FILTROS: Record<ERecursosFiltro, ICampoFiltro<any>[]> = {
  [ERecursosFiltro.USUARIOS]: MAPEAMENTO_CAMPOS_FILTRO_USUARIO,
};
