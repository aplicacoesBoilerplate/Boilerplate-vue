// Models
import { type IConfiguracaoCampo, obterEntradasMapeamentoCampos, type TMapeamentoCampos } from '@/models/components/IMapeamentoCampos';
import { EOperadoresFiltro } from '@/models/filters/enums/EOperadoresFiltro';
import { ETipoFiltro } from '@/models/filters/enums/ETipoFiltro';
import type { ICargoRbac } from './rbac/rbac.model';
import type { IFiltroPreDefinido, IOpcaoSelecao } from '@/models/filters/ICampoFiltro';
import type { IAuditoriaRegistro } from '@/models/model/common/IAuditoriaRegistro';

// Utils
import { criarCabecalhosTabela, criarCamposFiltro } from '@/utils/MapeamentoCampos';

// Services
import { cargoRbacService } from '@/services/core/CCargoRbacService';
import { usuarioService } from '@/services/core/CUsuarioService';

// Classes
import { CFormatters } from '@/classes/Utils/CFormatters';
import { CTradutor } from '@/classes/Utils/CTradutor';

export const PAPEIS_VALIDOS = ['ADMIN', 'USER'] as const;
export type TPapelPadrao = (typeof PAPEIS_VALIDOS)[number];
export type TPapel = TPapelPadrao | (string & {});

export const DESCRICAO_PAPEL: Record<TPapelPadrao, string> = {
  get ADMIN() { return CTradutor.traduzir('common.roles.admin'); },
  get USER() { return CTradutor.traduzir('common.roles.user'); },
};

export const ICONE_PAPEL: Record<TPapelPadrao, string> = {
  ADMIN: 'mdi-account-tie',
  USER: 'mdi-account',
};

export const MAPEAMENTO_OPCOES_PAPEIS_PADROES: Record<TPapelPadrao, IOpcaoSelecao> = {
  ADMIN: {
    valor: 'ADMIN',
    get descricao() { return CTradutor.traduzir('common.roles.admin'); },
    icone: 'mdi-account-tie',
  },
  USER: {
    valor: 'USER',
    get descricao() { return CTradutor.traduzir('common.roles.user'); },
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

export type TCamposMapeamentoUsuario = keyof Omit<IUsuario, 'auditoria'>;
export type TCamposFiltroUsuario = keyof Exclude<IUsuario, 'avatar' | 'notificar' | 'auditoria'>;

// A consulta auxiliar pode usar consulta de cargos para os filtros de usuários.
type TConfiguracaoCampoUsuario =
  | IConfiguracaoCampo<TCamposMapeamentoUsuario, IUsuario>
  | IConfiguracaoCampo<TCamposMapeamentoUsuario, ICargoRbac>;

type TMapeamentoUsuario = TMapeamentoCampos<
  TCamposMapeamentoUsuario,
  TConfiguracaoCampoUsuario
>;

const MAPEAMENTO_MODEL_USUARIO = {
  id: {
    rotuloChave: 'common.fields.user.id',
    filtro: {
      icone: 'mdi-pound',
      tipos: [ETipoFiltro.NUMBER, ETipoFiltro.SELECT],
      consultaRegistros: {
        atributoValor: 'id',
        atributoDescricao: 'nome',
        buscarRegistros: usuarioService.consultar,
        limiteInicial: 5,
        get textoVazio() { return CTradutor.traduzir('common.empty.users'); },
      }
    },
    tabela: {
      width: 50,
      maxWidth: 100,
      sortable: true
    }
  },
  nome: {
    rotuloChave: 'common.fields.user.name',
    filtro: {
      icone: 'mdi-account',
      tipos: [ETipoFiltro.STRING, ETipoFiltro.SELECT],
      pesquisaPadrao: true,
      operadorPesquisaPadrao: EOperadoresFiltro.CONTEM,
      consultaRegistros: {
        atributoValor: 'nome',
        atributoDescricao: 'nome',
        buscarRegistros: usuarioService.consultar,
        limiteInicial: 5,
        get textoVazio() { return CTradutor.traduzir('common.empty.users'); },
      }
    },
    tabela: {
      width: 200,
      maxWidth: 300,
      sortable: true
    }
  },
  email: {
    rotuloChave: 'common.fields.user.email',
    filtro: {
      icone: 'mdi-email',
      tipos: [ETipoFiltro.STRING, ETipoFiltro.SELECT],      
      consultaRegistros: {
        atributoValor: 'email',
        atributoDescricao: 'nome',
        buscarRegistros: usuarioService.consultar,
        limiteInicial: 5,
        get textoVazio() { return CTradutor.traduzir('common.empty.users'); },
      }
    },
    tabela: {
      width: 200,
      maxWidth: 350,
      sortable: true
    }
  },
  avatar: {
    rotuloChave: 'common.fields.user.avatar',
    tabela: {
      width: 150,
      maxWidth: 200,
      height: 200,
      maxHeigth: 300
    }
  },
  telefone: {
    rotuloChave: 'common.fields.user.phone',
    filtro: {
      icone: 'mdi-card-account-phone',
      tipos: [ETipoFiltro.STRING, ETipoFiltro.SELECT],
      consultaRegistros: {
        atributoValor: 'telefone',
        atributoDescricao: 'nome',
        buscarRegistros: usuarioService.consultar,
        limiteInicial: 5,
        get textoVazio() { return CTradutor.traduzir('common.empty.users'); },
      }
    },
    tabela: {
      width: 150,
      maxWidth: 200,
      sortable: true
    }
  },
  notificar: {
    rotuloChave: 'common.fields.user.notify',
    tabela: {
      width: 150,
      maxWidth: 200,
      sortable: true,
      value: (pItem: IUsuario) => CFormatters.formatarBooleano(pItem.notificar)
    }
  },
  ativo: {
    rotuloChave: 'common.fields.user.active',
    filtro: {
      icone: 'mdi-check-circle',
      tipos: [ETipoFiltro.BOOLEAN],
      disponivelAgrupamento: true,
    },
    tabela: {
      align: 'center',
      width: 50,
      maxWidth: 100,
      sortable: true,
      value: (pItem: IUsuario) => CFormatters.formatarBooleano(pItem.ativo),
      chartFormatter: CFormatters.formatarBooleano,
    }
  },
  papel: {
    rotuloChave: 'common.fields.user.role',
    filtro: {
      icone: 'mdi-badge-account',
      tipos: [ETipoFiltro.SELECT],
      consultaRegistros: {
        atributoValor: 'papel',
        atributoDescricao: 'nome',
        buscarRegistros: cargoRbacService.consultar,
        limiteInicial: 5,
        get textoVazio() { return CTradutor.traduzir('common.empty.roles'); }
      },
      disponivelAgrupamento: true,
    },
    tabela: {
      width: 150,
      maxWidth: 200,
      sortable: true
    }
  }
} satisfies TMapeamentoUsuario;

const ENTRADAS_MAPEAMENTO_USUARIO = obterEntradasMapeamentoCampos<
  TCamposMapeamentoUsuario,
  TConfiguracaoCampoUsuario
>(MAPEAMENTO_MODEL_USUARIO);

export const CAMPOS_FILTRO_USUARIO = criarCamposFiltro(ENTRADAS_MAPEAMENTO_USUARIO);
export const CABECALHOS_TABELA_USUARIO = criarCabecalhosTabela(ENTRADAS_MAPEAMENTO_USUARIO);
export const FILTROS_PRE_DEFINIDOS_USUARIO = [
  {
    chave: 'ativos',
    campo: 'ativo',
    condicao: EOperadoresFiltro.VERDADEIRO,
    icone: 'mdi-check-circle-outline',
    modo: 'aplicar',
    rotuloChave: 'components.dialogFiltro.filtrosPreDefinidos.ativos',
  },
  {
    chave: 'por-cargo',
    campo: 'papel',
    condicao: EOperadoresFiltro.SELECAO,
    icone: 'mdi-account-tag-outline',
    modo: 'preparar',
    rotuloChave: 'components.dialogFiltro.filtrosPreDefinidos.porCargo',
  },
] satisfies IFiltroPreDefinido[];
