// Types e Interfaces
import { ICONE_PAPEL, type TPapel } from '@/models/model/usuario/lUsuario';
import type { IFiltrosConsulta } from '@/models/filters/IFiltrosConsulta';

export type TComportamentoPadraoPermissao = 'bloquear' | 'liberar';

export const METODOS_HTTP_PERMISSAO_API_RBAC = ['GET', 'POST', 'PUT', 'DELETE'] as const;
export type TMetodoHttpPermissaoApi = (typeof METODOS_HTTP_PERMISSAO_API_RBAC)[number];

export const ACOES_API_RBAC = ['consultar', 'gravar', 'editar', 'remover'] as const;
export type TAcaoApiRbac = (typeof ACOES_API_RBAC)[number];

/**
 * @description Ações de API liberadas automaticamente para a rota inicial do cargo.
 */
export const ACOES_API_REDIRECIONAMENTO_INICIAL_RBAC = ['consultar', 'gravar'] as const;

/**
 * @description Define o mapeamento para as permissões gerais do RBAC
 * @property {string} valor - Identificador estável da ação dentro do recurso.
 * @property {string} descricao - Texto exibido para o usuário.
 * @property {string} icone - Ícone usado na matriz de permissões.
 */
export interface IAcaoRecursoRbac {
  valor: string;
  descricao: string;
  icone: string;
}

/**
 * @description Define uma permissão específica de um cargo.
 * @property {string} recurso - Identificador do recurso ao qual a permissão pertence.
 * @property {string} acao - Identificador da ação controlada pela permissão.
 * @property {boolean} liberado - Define se o cargo possui a ação liberada.
 */
export interface IPermissaoCargoRbac {
  recurso: string;
  acao: string;
  liberado: boolean;
}

/**
 * @description Define um endpoint técnico usado por uma ação semântica do RBAC.
 * @property {TMetodoHttpPermissaoApi} metodo - Método HTTP do endpoint protegido.
 * @property {string} path - Padrão de caminho usado pelo backend para comparar a requisição.
 */
export interface IEndpointApiRbac {
  metodo: TMetodoHttpPermissaoApi;
  path: string;
}

/**
 * @description Define quais ações variáveis da API pertencem a uma rota do frontend.
 * @property {Partial<Record<TAcaoApiRbac, IEndpointApiRbac[]>>} acoes - Endpoints técnicos agrupados por ação de negócio.
 */
export interface IMapeamentoRotaApiRbac {
  acoes: Partial<Record<TAcaoApiRbac, IEndpointApiRbac[]>>;
}

/**
 * @description Define a rota e os filtros usados no redirecionamento inicial do cargo.
 * @property {string} path - Caminho da rota inicial.
 * @property {string} name - Nome técnico da rota inicial.
 * @property {IFiltrosConsulta[]} filtros - Filtros iniciais aplicados na URL da rota inicial.
 */
export interface IRedirecionamentoInicialRbac {
  path: string;
  name?: string;
  filtros: IFiltrosConsulta[];
}

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
}

/**
 * @description Mapeamento das opções de comportamento padrão no caso de uma permissão não estar configurada de forma explicita.
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

export const RECURSO_PERMISSAO_ROTAS_RBAC = 'rotas';
export const RECURSO_PERMISSAO_GERAL_RBAC = 'geral';
export const RECURSO_PERMISSAO_API_RBAC = 'api';

/**
 * @description Mapeamento das ações que podem ser concedidas a um cargo.
 * @property {string} valor - Identificador da ação (deve ser único dentro do recurso).
 * @property {string} descricao - Descrição legível para o usuário.
 * @property {string} icone - Ícone associado à ação.
 */
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
    valor: 'gerenciarRegistros',
    descricao: 'Gerenciar registros',
    icone: 'mdi-database-edit-outline',
  },
];

export const MAPEAMENTO_ROTAS_API_RBAC: Partial<Record<string, IMapeamentoRotaApiRbac>> = {
  Users: {
    acoes: {
      consultar: [
        { metodo: 'GET', path: '/usuarios/**' },
        { metodo: 'POST', path: '/usuarios/consulta' },
        { metodo: 'POST', path: '/usuarios/search' },
      ],
      gravar: [
        { metodo: 'POST', path: '/usuarios' },
      ],
      editar: [
        { metodo: 'PUT', path: '/usuarios/**' },
      ],
      remover: [
        { metodo: 'DELETE', path: '/usuarios/**' },
      ],
    },
  },
  Rbac: {
    acoes: {
      consultar: [
        { metodo: 'GET', path: '/rbac/cargos/**' },
        { metodo: 'POST', path: '/rbac/cargos/consulta' },
      ],
      gravar: [
        { metodo: 'POST', path: '/rbac/cargos' },
      ],
      editar: [
        { metodo: 'PUT', path: '/rbac/cargos/**' },
      ],
      remover: [
        { metodo: 'DELETE', path: '/rbac/cargos/**' },
      ],
    },
  },
};

/**
 * @description Recursos da API com tratamento de validação contra undefined.
 */
export const RECURSOS_API_RBAC: IMapeamentoRotaApiRbac[] = Object
  .values(MAPEAMENTO_ROTAS_API_RBAC)
  .filter((pRecursoApi): pRecursoApi is IMapeamentoRotaApiRbac => Boolean(pRecursoApi));

/**
 * @description Achatamento dos endpoints aninhados em uma única lista plana.
 */
export const ENDPOINTS_API_RBAC: IEndpointApiRbac[] = RECURSOS_API_RBAC.flatMap((pRecursoApi) =>
  Object.values(pRecursoApi.acoes).flatMap((pEndpoints) => pEndpoints ?? []),
);

/**
 * @description Monta a ação técnica usada para armazenar permissões de API.
 * @param pEndpoint - Endpoint protegido pelo RBAC.
 * @returns Ação técnica da permissão esperada pelo backend no formato: metodo rota.
 */
export function montarAcaoEndpointApiRbac(pEndpoint: Pick<IEndpointApiRbac, 'metodo' | 'path'>): string {
  return `${pEndpoint.metodo} ${pEndpoint.path}`;
}

/**
 * @description Monta a chave estável usada para comparar permissões.
 * @param pRecurso - Recurso controlado pela permissão.
 * @param pAcao - Ação controlada pela permissão.
 * @returns Chave estável da permissão.
 */
export function montarChavePermissaoRbac(pRecurso: string, pAcao: string): string {
  return `${pRecurso}::${pAcao}`;
}

/**
 * @description Normaliza um valor string para ser usado como papel de cargo.
 * @param pValor - Valor string a ser normalizado.
 * @returns TPapel - Papel de cargo normalizado.
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
 * @description Cria um cargo RBAC com valores padrão.
 * @param pDados - Dados parciais para inicializar o cargo.
 * @returns ICargoRbac - Cargo RBAC criado.
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
  };
}

/**
 * @description Verifica se uma permissão específica está liberada para um cargo.
 * @param pCargo - Cargo RBAC a ser verificado.
 * @param pRecurso - Recurso da permissão.
 * @param pAcao - Ação da permissão.
 * @returns boolean - True se a permissão estiver liberada, false caso contrário.
 */
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
    papel: 'ADMIN',
    nome: 'Administrador',
    icone: ICONE_PAPEL['ADMIN'],
    descricao: 'Acesso operacional completo ao boilerplate.',
    comportamentoPadrao: 'liberar',
    redirecionamentoInicial: {
      path: '/',
      name: 'Home',
      filtros: [],
    },
    permissoes: [],
  }),
  criarCargoRbacPadrao({
    id: 2,
    papel: 'USER',
    nome: 'Usuário',
    icone: ICONE_PAPEL['USER'],
    descricao: 'Acesso básico para uso diário do sistema.',
    comportamentoPadrao: 'bloquear',
    redirecionamentoInicial: {
      path: '/users',
      name: 'Users',
      filtros: [],
    },
    permissoes: [
      { recurso: RECURSO_PERMISSAO_ROTAS_RBAC, acao: 'Home', liberado: true },
      { recurso: RECURSO_PERMISSAO_ROTAS_RBAC, acao: 'Users', liberado: true },
      { recurso: RECURSO_PERMISSAO_API_RBAC, acao: 'GET /usuarios/**', liberado: true },
      { recurso: RECURSO_PERMISSAO_API_RBAC, acao: 'POST /usuarios/consulta', liberado: true },
      { recurso: RECURSO_PERMISSAO_API_RBAC, acao: 'POST /usuarios/search', liberado: true },
    ],
  }),
];
