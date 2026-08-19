// Models
import type { TFiltroConsultaSerializado } from '@/models/filters/IFiltrosConsulta';

export type TComportamentoPadraoPermissao = 'bloquear' | 'liberar';

export const METODOS_HTTP_PERMISSAO_API_RBAC = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const;
export type TMetodoHttpPermissaoApi = (typeof METODOS_HTTP_PERMISSAO_API_RBAC)[number];

export const ACOES_API_RBAC = ['consultar', 'gravar', 'editar', 'remover'] as const;
export type TAcaoApiRbac = (typeof ACOES_API_RBAC)[number];

/**
 * @description Define o mapeamento para as permissões gerais do RBAC.
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
 * @property {TFiltroConsultaSerializado[]} filtros - Filtros serializáveis aplicados na URL da rota inicial.
 */
export interface IRedirecionamentoInicialRbac {
  path: string;
  name?: string;
  filtros: TFiltroConsultaSerializado[];
}
