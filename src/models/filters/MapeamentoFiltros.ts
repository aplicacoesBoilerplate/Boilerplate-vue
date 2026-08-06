// Models
import { ERecursosFiltro } from '@/models/filters/enums/ERecursosFiltro';
import { CAMPOS_FILTRO_ERRO } from '@/models/model/common/IErros';
import { CAMPOS_FILTRO_RBAC } from '@/models/model/core/rbac/rbac.model';
import { CAMPOS_FILTRO_USUARIO } from '@/models/model/core/usuario.model';

type TMapeamentoFiltros = {
  [ERecursosFiltro.USUARIOS]: typeof CAMPOS_FILTRO_USUARIO;
  [ERecursosFiltro.RBAC]: typeof CAMPOS_FILTRO_RBAC;
  [ERecursosFiltro.ERROS]: typeof CAMPOS_FILTRO_ERRO;
};

export const MAPEAMENTO_FILTROS = {
  [ERecursosFiltro.USUARIOS]: CAMPOS_FILTRO_USUARIO,
  [ERecursosFiltro.RBAC]: CAMPOS_FILTRO_RBAC,
  [ERecursosFiltro.ERROS]: CAMPOS_FILTRO_ERRO,
} satisfies TMapeamentoFiltros;
