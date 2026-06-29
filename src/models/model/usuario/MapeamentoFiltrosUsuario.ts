// Types e Interfaces
import type { IUsuario } from './lUsuario';
import type { ICampoFiltro } from '@/models/filters/ICampoFiltro';

// Enums
import { ETipoFiltro } from '@/models/filters/enums/ETipoFiltro';
import { EOperadoresFiltro } from '@/models/filters/enums/EOperadoresFiltro';

// Define com base na interface do Model, um tipo com os campos que os filtros são aplicaveis.
export type TCamposFiltroUsuario = Omit<IUsuario, 'avatar' | 'notificar'>;

const DESCRICAO_CAMPOS_FILTRO_USUARIO: Record<keyof TCamposFiltroUsuario, string> = {
  id: 'Código',
  nome: 'Nome',
  email: 'Email',
  papel: 'Cargo',
  telefone: 'Telefone',
  ativo: 'Ativo',
};

const ICONE_CAMPOS_FILTRO_USUARIO: Record<keyof TCamposFiltroUsuario, string> = {
  id: 'mdi-account',
  nome: 'mdi-account',
  email: 'mdi-email',
  papel: 'mdi-account-tie',
  telefone: 'mdi-phone',
  ativo: 'mdi-check-circle',
};

const TIPOS_CAMPOS_FILTRO_USUARIO: Record<keyof TCamposFiltroUsuario, ETipoFiltro[]> = {
  id: [ETipoFiltro.NUMBER],
  nome: [ETipoFiltro.STRING],
  email: [ETipoFiltro.STRING],
  papel: [ETipoFiltro.SELECT],
  telefone: [ETipoFiltro.STRING],
  ativo: [ETipoFiltro.BOOLEAN],
};

export const MAPEAMENTO_CAMPOS_FILTRO_USUARIO: ICampoFiltro<keyof TCamposFiltroUsuario>[] = (
  Object.keys(DESCRICAO_CAMPOS_FILTRO_USUARIO) as Array<keyof TCamposFiltroUsuario>
).map((key) => ({
  valor: key,
  descricao: DESCRICAO_CAMPOS_FILTRO_USUARIO[key],
  icone: ICONE_CAMPOS_FILTRO_USUARIO[key],
  tipos: TIPOS_CAMPOS_FILTRO_USUARIO[key],
  pesquisaPadrao: key === 'nome',
  operadorPesquisaPadrao: key === 'nome' ? EOperadoresFiltro.CONTEM : undefined,
}));
