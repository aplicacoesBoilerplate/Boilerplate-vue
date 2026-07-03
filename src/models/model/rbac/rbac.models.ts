// Types e Interfaces
import type { TPapel } from '@/models/model/usuario/lUsuario';

export type TComportamentoPadraoPermissao = 'bloquear' | 'liberar';

export interface IAcaoRecursoRbac {
  /**
   * Identificador estável da ação dentro do recurso.
   */
  valor: string;

  /**
   * Texto exibido para o usuário.
   */
  descricao: string;

  /**
   * Ícone usado na matriz de permissões.
   */
  icone: string;
}

export interface IPermissaoCargoRbac {
  /**
   * Grupo ao qual a permissão pertence, como rotas ou permissões gerais.
   */
  recurso: string;

  /**
   * Ação ou identificador controlado pela permissão.
   */
  acao: string;

  /**
   * Define se o cargo possui a ação liberada.
   */
  liberado: boolean;
}

export interface ICargoRbac {
  /**
   * Identificador temporário do cargo até existir backend.
   */
  id?: number;

  /**
   * Código usado nas permissões e no vínculo com usuários.
   */
  codigo: TPapel;

  /**
   * Nome de exibição do cargo.
   */
  nome: string;

  /**
   * Ícone usado para representar o cargo na interface.
   */
  icone: string;

  /**
   * Descrição curta para orientar administradores.
   */
  descricao?: string;

  /**
   * Comportamento usado quando uma permissão específica ainda não foi configurada.
   */
  comportamentoPadrao: TComportamentoPadraoPermissao;

  /**
   * Permissões configuradas explicitamente para o cargo.
   */
  permissoes: IPermissaoCargoRbac[];

  /**
   * Controla se o cargo pode ser atribuído a usuários.
   */
  ativo: boolean;
}

export const COMPORTAMENTOS_PADRAO_PERMISSAO: {
  valor: TComportamentoPadraoPermissao;
  descricao: string;
  icone: string;
  cor: string;
}[] = [
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

export const RECURSO_PERMISSAO_ROTAS_RBAC = 'rotas';
export const RECURSO_PERMISSAO_GERAL_RBAC = 'geral';

export const PERMISSOES_GERAIS_RBAC: IAcaoRecursoRbac[] = [
  {
    valor: 'exportarDados',
    descricao: 'Exportar dados',
    icone: 'mdi-export',
  },
  {
    valor: 'visualizarGraficos',
    descricao: 'Visualizar gráficos',
    icone: 'mdi-chart-box-outline',
  },
  {
    valor: 'usarFiltros',
    descricao: 'Usar filtros',
    icone: 'mdi-filter-cog-outline',
  },
  {
    valor: 'gerenciarRegistros',
    descricao: 'Gerenciar registros',
    icone: 'mdi-database-edit-outline',
  },
];

export function normalizarCodigoCargo(pValor: string): TPapel {
  return pValor
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_ -]/g, '')
    .replace(/[\s-]+/g, '_')
    .toUpperCase() as TPapel;
}

export function criarCargoRbacPadrao(pDados: Partial<ICargoRbac> = {}): ICargoRbac {
  return {
    id: pDados.id,
    codigo: pDados.codigo ?? '',
    nome: pDados.nome ?? '',
    icone: pDados.icone ?? 'mdi-shield-account-outline',
    descricao: pDados.descricao ?? '',
    comportamentoPadrao: pDados.comportamentoPadrao ?? 'bloquear',
    permissoes: pDados.permissoes ? [...pDados.permissoes] : [],
    ativo: pDados.ativo ?? true,
  };
}

export function permissaoEstaLiberada(
  pCargo: Pick<ICargoRbac, 'comportamentoPadrao' | 'permissoes'>,
  pRecurso: string,
  pAcao: string,
): boolean {
  const permissao = pCargo.permissoes.find((pPermissao) => pPermissao.recurso === pRecurso && pPermissao.acao === pAcao);

  return permissao?.liberado ?? pCargo.comportamentoPadrao === 'liberar';
}

export const CARGOS_RBAC_INICIAIS: ICargoRbac[] = [
  criarCargoRbacPadrao({
    id: 1,
    codigo: 'ADMIN',
    nome: 'Administrador',
    icone: 'mdi-shield-crown-outline',
    descricao: 'Acesso operacional completo ao boilerplate.',
    comportamentoPadrao: 'liberar',
    permissoes: [],
  }),
  criarCargoRbacPadrao({
    id: 2,
    codigo: 'USER',
    nome: 'Usuário',
    icone: 'mdi-account-outline',
    descricao: 'Acesso básico para uso diário do sistema.',
    comportamentoPadrao: 'bloquear',
    permissoes: [
      { recurso: RECURSO_PERMISSAO_ROTAS_RBAC, acao: 'Home', liberado: true },
      { recurso: RECURSO_PERMISSAO_ROTAS_RBAC, acao: 'Users', liberado: true },
      { recurso: RECURSO_PERMISSAO_GERAL_RBAC, acao: 'usarFiltros', liberado: true },
    ],
  }),
];
