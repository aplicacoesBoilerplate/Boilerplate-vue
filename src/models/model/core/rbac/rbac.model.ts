// Models
import { type IConfiguracaoCampo, obterEntradasMapeamentoCampos, type TMapeamentoCampos } from '@/models/components/IMapeamentoCampos';
import { EOperadoresFiltro } from '@/models/filters/enums/EOperadoresFiltro';
import { ETipoFiltro } from '@/models/filters/enums/ETipoFiltro';
import type {
  IFuncionalidadeCargoRbac,
  IPermissaoCargoRbac,
  IRedirecionamentoInicialRbac,
  TComportamentoPadraoPermissao,
} from './rbac.types';
import type { IOpcaoSelecao } from '@/models/filters/ICampoFiltro';
import type { IAuditoriaRegistro } from '@/models/model/common/IAuditoriaRegistro';
import type { TPapel } from '@/models/model/core/usuario.model';

import { criarCabecalhosTabela, criarCamposFiltro, criarConfiguracoesGrafico } from '@/utils/MapeamentoCampos';

// Services
import { cargoRbacService } from '@/services/core/CCargoRbacService';

import { CFormatters } from '@/classes/Utils/CFormatters';
// Utils
import { CTradutor } from '@/classes/Utils/CTradutor';

/**
 * @description Define um cargo com suas permissões.
 * @property {number} id - Identificador do cargo.
 * @property {TPapel} papel - Papel usado nas permissões e no vínculo com usuários.
 * @property {string} nome - Nome de exibição do cargo.
 * @property {string} icone - Ícone usado para representar o cargo na interface.
 * @property {string} descricao - Descrição curta para orientar administradores.
 * @property {TComportamentoPadraoPermissao} comportamentoPadrao - Comportamento usado quando uma permissão específica ainda não foi configurada.
 * @property {IPermissaoCargoRbac[]} permissoes - Permissões configuradas explicitamente para o cargo.
 * @property {IRedirecionamentoInicialRbac} redirecionamentoInicial - Rota inicial e filtros aplicados após autenticação.
 * @property {boolean} ativo - Controla se o cargo pode ser atribuído a usuários.
 * @property {IAuditoriaRegistro} auditoria - Metadados de criação e última atualização.
 */
export interface ICargoRbac {
  id?: number;
  papel: TPapel;
  nome: string;
  icone: string;
  descricao?: string;
  comportamentoPadrao: TComportamentoPadraoPermissao;
  permissoes: IPermissaoCargoRbac[];
  funcionalidades: IFuncionalidadeCargoRbac[];
  redirecionamentoInicial: IRedirecionamentoInicialRbac;
  ativo: boolean;
  auditoria?: IAuditoriaRegistro;
}

// Mapeamentos das opções para seleção de comportamento padrão do RBAC quanto as permissões.
export const COMPORTAMENTOS_PADRAO_PERMISSAO: IOpcaoSelecao<TComportamentoPadraoPermissao>[] = [
  {
    valor: 'bloquear',
    descricao: 'bloquear',
    icone: 'mdi-lock-outline',
    cor: 'error',
  },
  {
    valor: 'liberar',
    descricao: 'liberar',
    icone: 'mdi-lock-open-outline',
    cor: 'success',
  },
];

/**
 * @description Cria um cargo RBAC com valores padrão.
 * @param pDados - Dados parciais para inicializar o cargo.
 * @returns Cargo RBAC criado.
 */
export function criarCargoRbacPadrao(pDados: Partial<ICargoRbac> = {}): ICargoRbac {
  const funcionalidades = pDados.funcionalidades ? [...pDados.funcionalidades] : [];
  const gerenciavaRegistros = pDados.permissoes?.some(
    (pPermissao) => pPermissao.recurso === 'geral'
      && pPermissao.acao === 'gerenciarRegistros'
      && pPermissao.liberado,
  );

  if (gerenciavaRegistros && !funcionalidades.some((pItem) => pItem.funcionalidade === 'gerenciarRegistrosOutros')) {
    funcionalidades.push({ funcionalidade: 'gerenciarRegistrosOutros', liberado: true });
  }

  return {
    id: pDados.id,
    papel: pDados.papel ?? '',
    nome: pDados.nome ?? '',
    icone: pDados.icone ?? 'mdi-shield-account-outline',
    descricao: pDados.descricao ?? '',
    comportamentoPadrao: pDados.comportamentoPadrao ?? 'bloquear',
    permissoes: pDados.permissoes?.filter(
      (pPermissao) => pPermissao.recurso !== 'geral' || pPermissao.acao !== 'gerenciarRegistros',
    ) ?? [],
    funcionalidades,
    redirecionamentoInicial: {
      path: pDados.redirecionamentoInicial?.path ?? '',
      name: pDados.redirecionamentoInicial?.name,
      filtros: pDados.redirecionamentoInicial?.filtros ? [...pDados.redirecionamentoInicial.filtros] : [],
    },
    ativo: pDados.ativo ?? true,
    auditoria: pDados.auditoria,
  };
}

export type TCamposFiltroRbac = keyof Pick<ICargoRbac, 'nome' | 'descricao' | 'comportamentoPadrao' | 'ativo'>;
type TCamposMapeamentoRbac = keyof Omit<
  ICargoRbac,
  'id' | 'icone' | 'funcionalidades' | 'redirecionamentoInicial' | 'auditoria'
> | 'usuarios' | 'acoes';
export type TMapeamentoRbac = TMapeamentoCampos<
  TCamposMapeamentoRbac,
  IConfiguracaoCampo<TCamposMapeamentoRbac, ICargoRbac>
>;

const MAPEAMENTO_MODEL_RBAC = {
  nome: {
    rotuloChave: 'common.fields.rbac.name',
    filtro: {
      icone: 'mdi-shield-account-outline',
      tipos: [ETipoFiltro.STRING],
      pesquisaPadrao: true,
      operadorPesquisaPadrao: EOperadoresFiltro.CONTEM,
      consultaRegistros: {
        atributoValor: 'nome',
        atributoDescricao: 'nome',
        buscarRegistros: cargoRbacService.consultar,
        limiteInicial: 5,
        get textoVazio() { return CTradutor.traduzir('common.empty.roles'); },
      }
    },
    tabela: {
      minWidth: 200,
      maxWidth: 300,
      sortable: true
    }
  },
  descricao: {
    rotuloChave: 'common.fields.rbac.description',
    filtro: {
      icone: 'mdi-text-box-outline',
      tipos: [ETipoFiltro.STRING]
    },
    tabela: {
      minWidth: 200,
      width: 300,
      maxWidth: 600,
      sortable: true
    }
  },
  comportamentoPadrao: {
    rotuloChave: 'common.fields.rbac.defaultBehavior',
    filtro: {
      icone: 'mdi-lock-check-outline',
      tipos: [ETipoFiltro.SELECT],
      opcoes: COMPORTAMENTOS_PADRAO_PERMISSAO,
    },
    tabela:  {
      minWidth: 220,
      maxWidth: 300,
      sortable: true,
    }
  },
  papel: {
    rotuloChave: 'common.fields.user.role',
    tabela: {
      width: 120,
    },
  },
  ativo: {
    rotuloChave: 'common.fields.rbac.active',
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
      value: (pItem: ICargoRbac) => CFormatters.formatarBooleano(pItem.ativo),
    },
    grafico: {
      formatador: (pValor?: unknown) => CFormatters.formatarBooleano(
        typeof pValor === 'boolean' ? pValor : undefined,
      ),
    }
  },
  permissoes: {
    rotuloChave: 'common.rbacTabs.permissions',
    tabela: {
      align: 'center',
      sortable: false,
      width: 110,
    },
  },
  usuarios: {
    rotuloChave: 'common.rbacTabs.users',
    tabela: {
      align: 'center',
      sortable: false,
      width: 100,
    },
  },
  acoes: {
    rotuloChave: 'dataTable.headersDefault.actions',
    tabela: {
      align: 'center',
      sortable: false,
      minWidth: 180,
    },
  },
} satisfies TMapeamentoRbac;

const ENTRADAS_MAPEAMENTO_RBAC = obterEntradasMapeamentoCampos<
  TCamposMapeamentoRbac,
  IConfiguracaoCampo<TCamposMapeamentoRbac, ICargoRbac>
>(MAPEAMENTO_MODEL_RBAC);

export const CAMPOS_FILTRO_RBAC = criarCamposFiltro(ENTRADAS_MAPEAMENTO_RBAC);
export const CABECALHOS_TABELA_RBAC = criarCabecalhosTabela(ENTRADAS_MAPEAMENTO_RBAC);
export const CONFIGURACOES_GRAFICO_RBAC = criarConfiguracoesGrafico(ENTRADAS_MAPEAMENTO_RBAC);

/**
 * @description Verifica se uma permissão específica está liberada para um cargo.
 * @param pCargo - Cargo RBAC a ser verificado.
 * @param pRecurso - Recurso da permissão.
 * @param pAcao - Ação da permissão.
 * @returns True se a permissão estiver liberada, false caso contrário.
 */
export function permissaoEstaLiberada(
  pCargo: Pick<ICargoRbac, 'comportamentoPadrao' | 'permissoes'>,
  pRecurso: string,
  pAcao: string,
): boolean {
  const permissao = pCargo.permissoes.find(
    (pPermissao) => pPermissao.recurso === pRecurso && pPermissao.acao === pAcao,
  );

  return permissao?.liberado ?? pCargo.comportamentoPadrao === 'liberar';
}

export function funcionalidadeEstaLiberada(
  pCargo: Pick<ICargoRbac, 'comportamentoPadrao' | 'funcionalidades'>,
  pFuncionalidade: string,
): boolean {
  return pCargo.funcionalidades.find((pItem) => pItem.funcionalidade === pFuncionalidade)?.liberado
    ?? pCargo.comportamentoPadrao === 'liberar';
}
