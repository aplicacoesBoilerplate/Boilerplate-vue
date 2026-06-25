// Types e Interfaces
import { EFilterResources } from '../EFilterResource';
import type { ICampoFiltroOption } from '../../ICampoFiltroOption';
import { MAPEAMENTO_CAMPOS_FILTRO_USERS } from '@/models/model/users/MapeamentoFiltrosUsuario';

// Mapeamentos dos recursos para aplicação de filtros.
export const cFILTERS_MAPPINGS: Record<EFilterResources, ICampoFiltroOption<any>[]> = {
  [EFilterResources.USERS]: MAPEAMENTO_CAMPOS_FILTRO_USERS,
}
