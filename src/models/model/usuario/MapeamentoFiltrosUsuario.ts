// Types e Interfaces
import { DESCRICAO_PAPEL, PAPEIS_VALIDOS, type IUsuario } from './lUsuario';
import type { ICampoFiltro } from '@/models/filters/ICampoFiltro';
import type { IConsultaRegistrosFiltro } from '@/models/filters/IConsultaRegistrosFiltro';

// Enums
import { ETipoFiltro } from '@/models/filters/enums/ETipoFiltro';
import { EOperadoresFiltro } from '@/models/filters/enums/EOperadoresFiltro';

// Services
import { CConsultaUsuariosFiltroService } from '@/services/filters/CConsultaUsuariosFiltroService';

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
  id: 'mdi-pound',
  nome: 'mdi-account',
  email: 'mdi-email',
  papel: 'mdi-badge-account',
  telefone: 'mdi-phone',
  ativo: 'mdi-check-circle',
};

const TIPOS_CAMPOS_FILTRO_USUARIO: Record<keyof TCamposFiltroUsuario, ETipoFiltro[]> = {
  id: [ETipoFiltro.NUMBER, ETipoFiltro.SELECT],
  nome: [ETipoFiltro.STRING, ETipoFiltro.SELECT],
  email: [ETipoFiltro.STRING, ETipoFiltro.SELECT],
  papel: [ETipoFiltro.SELECT],
  telefone: [ETipoFiltro.STRING, ETipoFiltro.SELECT],
  ativo: [ETipoFiltro.BOOLEAN],
};

const OPCOES_CAMPOS_FILTRO_USUARIO: Partial<Record<keyof TCamposFiltroUsuario, { valor: unknown; descricao: string }[]>> = {
  papel: PAPEIS_VALIDOS.map((pPapel) => ({
    valor: pPapel,
    descricao: DESCRICAO_PAPEL[pPapel],
  })),
};

// Mapeamento de quais campos terão consulta de registros, assim como as configurações de chave, atributos, service e parâmetros
const CONSULTA_REGISTROS_FILTRO_USUARIO: Partial<Record<keyof TCamposFiltroUsuario, IConsultaRegistrosFiltro<IUsuario>>> = {
  id: {
    atributoValor: 'id',
    atributoDescricao: 'nome',
    buscarRegistros: CConsultaUsuariosFiltroService.buscarRegistros,
    limiteInicial: 5,
    textoVazio: 'Nenhum usuário encontrado.',
  },
  nome: {
    atributoValor: 'nome',
    atributoDescricao: 'nome',
    buscarRegistros: CConsultaUsuariosFiltroService.buscarRegistros,
    limiteInicial: 5,
    textoVazio: 'Nenhum usuário encontrado.',
  },
  email: {
    atributoValor: 'email',
    atributoDescricao: 'nome',
    buscarRegistros: CConsultaUsuariosFiltroService.buscarRegistros,
    limiteInicial: 5,
    textoVazio: 'Nenhum usuário encontrado.',
  },
  telefone: {
    atributoValor: 'telefone',
    atributoDescricao: 'nome',
    buscarRegistros: CConsultaUsuariosFiltroService.buscarRegistros,
    limiteInicial: 5,
    textoVazio: 'Nenhum usuário encontrado.',
  },
};

export const DISPONIVEL_AGRUPAMENTO_CAMPOS_FILTRO_USUARIO: Partial<Record<keyof TCamposFiltroUsuario, boolean>> = {
  papel: true,
  ativo: true
};

export const MAPEAMENTO_CAMPOS_FILTRO_USUARIO: ICampoFiltro<keyof TCamposFiltroUsuario, IUsuario>[] = (
  Object.keys(DESCRICAO_CAMPOS_FILTRO_USUARIO) as Array<keyof TCamposFiltroUsuario>
).map((key) => ({
  valor: key,
  descricao: DESCRICAO_CAMPOS_FILTRO_USUARIO[key],
  icone: ICONE_CAMPOS_FILTRO_USUARIO[key],
  tipos: TIPOS_CAMPOS_FILTRO_USUARIO[key],
  opcoes: OPCOES_CAMPOS_FILTRO_USUARIO[key],
  pesquisaPadrao: key === 'nome',
  operadorPesquisaPadrao: key === 'nome' ? EOperadoresFiltro.CONTEM : undefined,
  consultaRegistros: CONSULTA_REGISTROS_FILTRO_USUARIO[key],
  disponivelAgrupamento: DISPONIVEL_AGRUPAMENTO_CAMPOS_FILTRO_USUARIO[key],
}));
