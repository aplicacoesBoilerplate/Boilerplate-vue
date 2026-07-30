import { EOperadoresFiltro } from '@/models/filters/enums/EOperadoresFiltro';
import { ETipoFiltro } from '@/models/filters/enums/ETipoFiltro';
import type { IPermissaoCargoRbac, IRedirecionamentoInicialRbac, TComportamentoPadraoPermissao } from './rbac.types';
import type { ICampoFiltro } from '@/models/filters/ICampoFiltro';
import type { IConsultaRegistrosFiltro } from '@/models/filters/IConsultaRegistrosFiltro';
import type { IAuditoriaRegistro } from '@/models/model/common/IAuditoriaRegistro';
import type { TPapel } from '@/models/model/core/usuario.model';

// Services
import { CConsultaCargosFiltroService } from '@/services/core/filters/CConsultaCargosFiltroService';

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
  redirecionamentoInicial: IRedirecionamentoInicialRbac;
  ativo: boolean;
  auditoria?: IAuditoriaRegistro;
}

/**
 * @description Mapeamento das opções de comportamento padrão no caso de uma permissão não estar configurada de forma explícita.
 * @property {TComportamentoPadraoPermissao} valor - Identificador estável do comportamento padrão.
 * @property {string} descricao - Texto exibido para o usuário.
 * @property {string} icone - Ícone usado na interface.
 * @property {string} cor - Cor usada na interface.
 */
export interface IComportamentoPadrao {
  valor: TComportamentoPadraoPermissao;
  descricao: string;
  icone: string;
  cor: string;
}

export const COMPORTAMENTOS_PADRAO_PERMISSAO: IComportamentoPadrao[] = [
  {
    valor: 'bloquear',
    descricao: 'Bloquear por padrão',
    icone: 'mdi-lock-outline',
    cor: 'error',
  },
  {
    valor: 'liberar',
    descricao: 'Liberar por padrão',
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
  return {
    id: pDados.id,
    papel: pDados.papel ?? '',
    nome: pDados.nome ?? '',
    icone: pDados.icone ?? 'mdi-shield-account-outline',
    descricao: pDados.descricao ?? '',
    comportamentoPadrao: pDados.comportamentoPadrao ?? 'bloquear',
    permissoes: pDados.permissoes ? [...pDados.permissoes] : [],
    redirecionamentoInicial: {
      path: pDados.redirecionamentoInicial?.path ?? '',
      name: pDados.redirecionamentoInicial?.name,
      filtros: pDados.redirecionamentoInicial?.filtros ? [...pDados.redirecionamentoInicial.filtros] : [],
    },
    ativo: pDados.ativo ?? true,
    auditoria: pDados.auditoria,
  };
}

/**
 * @description Normaliza um valor string para ser usado como papel de cargo.
 * @param pValor - Valor string a ser normalizado.
 * @returns Papel de cargo normalizado.
 */
export function normalizarPapelCargo(pValor: string): TPapel {
  return pValor
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_ -]/g, '')
    .replace(/[\s-]+/g, '_')
    .toUpperCase() as TPapel;
}

/**
 * @description Verifica se uma permissão específica está liberada para um cargo.
 * @param pCargo - Cargo RBAC a ser verificado.
 * @param pRecurso - Recurso da permissão.
 * @param pAcao - Ação da permissão.
 * @returns True se a permissão estiver liberada, false caso contrário.
 */
// -------- Mapeamento de Filtros (type-safe sem any) ----------

export type TCamposFiltroRbac = keyof Pick<ICargoRbac, 'nome' | 'descricao' | 'comportamentoPadrao' | 'ativo'>;

type TMapeamentoFiltroRbac = Omit<ICampoFiltro<TCamposFiltroRbac, ICargoRbac>, 'valor'>;

const DESCRICAO_CAMPOS_FILTRO_RBAC: Record<TCamposFiltroRbac, string> = {
  nome: 'Nome',
  descricao: 'Descrição',
  comportamentoPadrao: 'Comportamento padrão',
  ativo: 'Ativo',
};

const ICONE_CAMPOS_FILTRO_RBAC: Record<TCamposFiltroRbac, string> = {
  nome: 'mdi-shield-account-outline',
  descricao: 'mdi-text-box-outline',
  comportamentoPadrao: 'mdi-lock-check-outline',
  ativo: 'mdi-check-circle',
};

const TIPOS_CAMPOS_FILTRO_RBAC: Record<TCamposFiltroRbac, ETipoFiltro[]> = {
  nome: [ETipoFiltro.STRING],
  descricao: [ETipoFiltro.STRING],
  comportamentoPadrao: [ETipoFiltro.SELECT],
  ativo: [ETipoFiltro.BOOLEAN],
};

const OPCOES_CAMPOS_FILTRO_RBAC: Partial<Record<TCamposFiltroRbac, { valor: unknown; descricao: string }[]>> = {
  comportamentoPadrao: COMPORTAMENTOS_PADRAO_PERMISSAO.map((pComportamento) => ({
    valor: pComportamento.valor,
    descricao: pComportamento.descricao,
  })),
};

const CONSULTA_REGISTROS_FILTRO_RBAC: Partial<Record<TCamposFiltroRbac, IConsultaRegistrosFiltro<ICargoRbac>>> = {
  nome: {
    atributoValor: 'nome',
    atributoDescricao: 'nome',
    buscarRegistros: CConsultaCargosFiltroService.buscarRegistros,
    limiteInicial: 5,
    textoVazio: 'Nenhum cargo encontrado.',
  },
};

export const MAPEAMENTO_RBAC = {
  FILTERS: (Object.keys(DESCRICAO_CAMPOS_FILTRO_RBAC) as TCamposFiltroRbac[]).reduce(
    (pAcc, pCampo) => {
      pAcc[pCampo] = {
        descricao: DESCRICAO_CAMPOS_FILTRO_RBAC[pCampo],
        icone: ICONE_CAMPOS_FILTRO_RBAC[pCampo],
        tipos: TIPOS_CAMPOS_FILTRO_RBAC[pCampo],
        opcoes: OPCOES_CAMPOS_FILTRO_RBAC[pCampo],
        pesquisaPadrao: pCampo === 'nome',
        operadorPesquisaPadrao: pCampo === 'nome' ? EOperadoresFiltro.CONTEM : undefined,
        consultaRegistros: CONSULTA_REGISTROS_FILTRO_RBAC[pCampo],
      } as TMapeamentoFiltroRbac;
      return pAcc;
    },
    {} as Record<TCamposFiltroRbac, TMapeamentoFiltroRbac>,
  ),
  VALID_FILTER_FIELDS: new Set<TCamposFiltroRbac>(['nome', 'descricao', 'comportamentoPadrao', 'ativo']),
} as const;

/* eslint-disable @typescript-eslint/no-explicit-any */
export const MAPEAMENTO_CAMPOS_FILTROS_RBAC: import('@/models/filters/ICampoFiltro').ICampoFiltro<any, any>[] =
  Object.values(MAPEAMENTO_RBAC.FILTERS) as any;
/* eslint-enable @typescript-eslint/no-explicit-any */

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
