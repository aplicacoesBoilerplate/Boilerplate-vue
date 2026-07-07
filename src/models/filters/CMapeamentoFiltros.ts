// Types e Interfaces
import type { ICampoFiltro } from './ICampoFiltro';

// Enums
import { ERecursosFiltro } from './enums/ERecursosFiltro';

// Constantes
import { MAPEAMENTO_CAMPOS_FILTRO_USUARIO } from '@/models/model/usuario/MapeamentoFiltrosUsuario';
import { MAPEAMENTO_CAMPOS_FILTRO_RBAC } from '@/models/model/rbac/MapeamentoFiltrosRbac';
import { MAPEAMENTO_CAMPOS_FILTRO_ERROS } from '@/models/model/errors/MapeamentoFiltrosErros';

// Mapeamentos dos recursos para aplicação de filtros.
export const MAPEAMENTO_FILTROS: Record<ERecursosFiltro, ICampoFiltro<any, any>[]> = {
  [ERecursosFiltro.USUARIOS]: MAPEAMENTO_CAMPOS_FILTRO_USUARIO,
  [ERecursosFiltro.RBAC]: MAPEAMENTO_CAMPOS_FILTRO_RBAC,
  [ERecursosFiltro.ERROS]: MAPEAMENTO_CAMPOS_FILTRO_ERROS,
};
