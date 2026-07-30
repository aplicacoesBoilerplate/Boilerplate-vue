// Enums
import { MAPEAMENTO_CAMPOS_FILTROS_RBAC } from '@/models/model/core/rbac/rbac.model';
// Models
import { MAPEAMENTO_CAMPOS_FILTROS_USUARIO } from '@/models/model/core/usuario.model';
import { MAPEAMENTO_CAMPOS_FILTRO_ERROS } from '@/models/model/errors/MapeamentoFiltrosErros';
// Types e Interfaces
import type { ICampoFiltro } from './ICampoFiltro';

import { ERecursosFiltro } from './enums/ERecursosFiltro';

// Mapeamentos dos recursos para aplicação de filtros.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MAPEAMENTO_FILTROS: Record<ERecursosFiltro, ICampoFiltro<any, any>[]> = {
  [ERecursosFiltro.USUARIOS]: MAPEAMENTO_CAMPOS_FILTROS_USUARIO,
  [ERecursosFiltro.RBAC]: MAPEAMENTO_CAMPOS_FILTROS_RBAC,
  [ERecursosFiltro.ERROS]: MAPEAMENTO_CAMPOS_FILTRO_ERROS,
};
