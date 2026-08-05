// Models
import { EOperadoresFiltro } from '@/models/filters/enums/EOperadoresFiltro';
import { ETipoFiltro } from '@/models/filters/enums/ETipoFiltro';
import type { IHeadersDataTable } from '@/models/components/lHeaderTable';
import type { ICampoFiltro } from '@/models/filters/ICampoFiltro';
import type { IConsultaRegistrosFiltro } from '@/models/filters/IConsultaRegistrosFiltro';
import type { IAuditoriaRegistro } from '@/models/model/common/IAuditoriaRegistro';

// Services
import { usuarioService } from '@/services/core/CUsuarioService';

// Plugins
import { i18n } from '@/plugins/i18n';

// -------- Tipos e Constantes ----------

export const PAPEIS_VALIDOS = ['ADMIN', 'USER'] as const;
export type TPapelPadrao = (typeof PAPEIS_VALIDOS)[number];
export type TPapel = TPapelPadrao | (string & {});

export const DESCRICAO_PAPEL: Record<TPapelPadrao, string> = {
  ADMIN: 'Administrador',
  USER: 'Usuário',
};

export const ICONE_PAPEL: Record<TPapelPadrao, string> = {
  ADMIN: 'mdi-account-tie',
  USER: 'mdi-account',
};

type TMapeamentoPapeis = {
  valor: string;
  label: string;
  icone: string;
};

export const MAPEAMENTO_PAPEIS: Record<TPapelPadrao, TMapeamentoPapeis> = {
  ADMIN: {
    valor: 'ADMIN',
    label: 'Administrador',
    icone: 'mdi-account-tie',
  },
  USER: {
    valor: 'USER',
    label: 'Usuário',
    icone: 'mdi-account',
  },
};

export type TPapelUsuario = {
  papel: TPapel;
};

/**
 * @description Representa um usuário do sistema.
 * @property {number} id - Identificador único do usuário.
 * @property {string} nome - Nome de exibição do usuário.
 * @property {string} email - E-mail usado para autenticação e notificações.
 * @property {string} avatar - URL ou identificador do avatar do usuário.
 * @property {string} telefone - Número de telefone do usuário.
 * @property {boolean} notificar - Define se o usuário recebe notificações.
 * @property {boolean} ativo - Define se o usuário está ativo.
 * @property {TPapel} papel - Papel do usuário usado em permissões.
 * @property {IAuditoriaRegistro} auditoria - Metadados de criação e atualização.
 */
export interface IUsuario extends TPapelUsuario {
  id?: number;
  nome: string;
  email: string;
  avatar?: string;
  telefone?: string;
  notificar?: boolean;
  ativo?: boolean;
  auditoria?: IAuditoriaRegistro;
}

/**
 * @description Cria um objeto usuário com dados padrão.
 * @param pDados - Dados parciais para inicializar o usuário.
 * @returns Objeto IUsuario com valores padrão.
 */
export function criarUsuarioPadrao(pDados: Partial<IUsuario> = {}): IUsuario {
  return {
    id: pDados.id,
    nome: pDados.nome ?? '',
    email: pDados.email ?? '',
    papel: pDados.papel ?? 'USER',
    telefone: pDados.telefone ?? '',
    notificar: pDados.notificar ?? false,
    ativo: pDados.ativo ?? true,
    auditoria: pDados.auditoria,
  };
}

// -------- Formatação ----------

function traduzir(pChave: string): string {
  const tradutor = i18n.global as unknown as { t: (pChaveTraducao: string) => string };
  return tradutor.t(pChave);
}

export function formatarBooleanoUsuario(pValor?: boolean): string {
  return pValor ? traduzir('messages.yes') : traduzir('messages.no');
}

// -------- Mapeamento de Filtros (type-safe sem any) ----------

export type TCamposFiltroUsuario = keyof Omit<IUsuario, 'avatar' | 'notificar' | 'auditoria'>;

type TMapeamentoFiltroUsuario = Omit<ICampoFiltro<TCamposFiltroUsuario, IUsuario>, 'valor'>;

const DESCRICAO_CAMPOS_FILTRO_USUARIO: Record<TCamposFiltroUsuario, string> = {
  id: 'Código',
  nome: 'Nome',
  email: 'Email',
  papel: 'Cargo',
  telefone: 'Telefone',
  ativo: 'Ativo',
};

const ICONE_CAMPOS_FILTRO_USUARIO: Record<TCamposFiltroUsuario, string> = {
  id: 'mdi-pound',
  nome: 'mdi-account',
  email: 'mdi-email',
  papel: 'mdi-badge-account',
  telefone: 'mdi-phone',
  ativo: 'mdi-check-circle',
};

const TIPOS_CAMPOS_FILTRO_USUARIO: Record<TCamposFiltroUsuario, ETipoFiltro[]> = {
  id: [ETipoFiltro.NUMBER, ETipoFiltro.SELECT],
  nome: [ETipoFiltro.STRING, ETipoFiltro.SELECT],
  email: [ETipoFiltro.STRING, ETipoFiltro.SELECT],
  papel: [ETipoFiltro.SELECT],
  telefone: [ETipoFiltro.STRING, ETipoFiltro.SELECT],
  ativo: [ETipoFiltro.BOOLEAN],
};

const OPCOES_CAMPOS_FILTRO_USUARIO: Partial<Record<TCamposFiltroUsuario, { valor: unknown; descricao: string }[]>> = {
  papel: PAPEIS_VALIDOS.map((pPapel) => ({
    valor: pPapel,
    descricao: DESCRICAO_PAPEL[pPapel],
  })),
};

const CONSULTA_REGISTROS_FILTRO_USUARIO: Partial<Record<TCamposFiltroUsuario, IConsultaRegistrosFiltro<IUsuario>>> = {
  id: {
    atributoValor: 'id',
    atributoDescricao: 'nome',
    buscarRegistros: usuarioService.consultar,
    limiteInicial: 5,
    textoVazio: 'Nenhum usuário encontrado.',
  },
  nome: {
    atributoValor: 'nome',
    atributoDescricao: 'nome',
    buscarRegistros: usuarioService.consultar,
    limiteInicial: 5,
    textoVazio: 'Nenhum usuário encontrado.',
  },
  email: {
    atributoValor: 'email',
    atributoDescricao: 'nome',
    buscarRegistros: usuarioService.consultar,
    limiteInicial: 5,
    textoVazio: 'Nenhum usuário encontrado.',
  },
  telefone: {
    atributoValor: 'telefone',
    atributoDescricao: 'nome',
    buscarRegistros: usuarioService.consultar,
    limiteInicial: 5,
    textoVazio: 'Nenhum usuário encontrado.',
  },
};

const DISPONIVEL_AGRUPAMENTO_CAMPOS_FILTRO_USUARIO: Partial<Record<TCamposFiltroUsuario, boolean>> = {
  papel: true,
  ativo: true,
};

// -------- Mapeamento de Tabela ----------

export const MAPEAMENTO_CORES_AGRUPAMENTO_USUARIO: Partial<Record<keyof IUsuario, Record<string, string>>> = {
  ativo: {
    true: 'success',
    false: 'error',
  },
};

export const MAPEAMENTO_TABELA_USUARIO: IHeadersDataTable[] = [
  {
    title: traduzir('dataTable.users.headers.id'),
    align: 'start',
    key: 'id',
    width: 50,
  },
  {
    title: traduzir('dataTable.users.headers.username'),
    align: 'start',
    key: 'nome',
    width: 250,
  },
  {
    title: traduzir('dataTable.users.headers.email'),
    align: 'start',
    key: 'email',
    width: 200,
  },
  {
    title: traduzir('dataTable.users.headers.role'),
    align: 'start',
    key: 'papel',
    width: 'auto',
    maxWidth: 100,
  },
  {
    title: traduzir('dataTable.users.headers.phoneNumber'),
    align: 'end',
    key: 'telefone',
    width: 'auto',
    maxWidth: 200,
  },
  {
    title: traduzir('dataTable.users.headers.receiveNotifications'),
    key: 'notificar',
    align: 'center',
    value: (pItem: IUsuario) => formatarBooleanoUsuario(pItem.notificar),
    chartFormatter: formatarBooleanoUsuario,
  },
  {
    title: traduzir('dataTable.users.headers.active'),
    key: 'ativo',
    align: 'center',
    value: (pItem: IUsuario) => formatarBooleanoUsuario(pItem.ativo),
    chartFormatter: formatarBooleanoUsuario,
  },
  {
    title: traduzir('dataTable.headersDefault.actions'),
    key: 'actions',
    align: 'center',
  },
];

// -------- Mapeamento Consolidado ----------

export const MAPEAMENTO_USUARIO = {
  FILTERS: (Object.keys(DESCRICAO_CAMPOS_FILTRO_USUARIO) as TCamposFiltroUsuario[]).reduce(
    (pAcc, pCampo) => {
      pAcc[pCampo] = {
        descricao: DESCRICAO_CAMPOS_FILTRO_USUARIO[pCampo],
        icone: ICONE_CAMPOS_FILTRO_USUARIO[pCampo],
        tipos: TIPOS_CAMPOS_FILTRO_USUARIO[pCampo],
        opcoes: OPCOES_CAMPOS_FILTRO_USUARIO[pCampo],
        pesquisaPadrao: pCampo === 'nome',
        operadorPesquisaPadrao: pCampo === 'nome' ? EOperadoresFiltro.CONTEM : undefined,
        consultaRegistros: CONSULTA_REGISTROS_FILTRO_USUARIO[pCampo],
        disponivelAgrupamento: DISPONIVEL_AGRUPAMENTO_CAMPOS_FILTRO_USUARIO[pCampo],
      } as TMapeamentoFiltroUsuario;
      return pAcc;
    },
    {} as Record<TCamposFiltroUsuario, TMapeamentoFiltroUsuario>,
  ),
  TABLE: MAPEAMENTO_TABELA_USUARIO,
  CHART_COLORS: MAPEAMENTO_CORES_AGRUPAMENTO_USUARIO,
  VALID_FILTER_FIELDS: new Set<TCamposFiltroUsuario>(['id', 'nome', 'email', 'papel', 'telefone', 'ativo']),
} as const;

/* eslint-disable @typescript-eslint/no-explicit-any */
export const MAPEAMENTO_CAMPOS_FILTROS_USUARIO: ICampoFiltro<object, object>[] =
  Object.values(MAPEAMENTO_USUARIO.FILTERS) as any;
