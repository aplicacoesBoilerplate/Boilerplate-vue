/**
 * @description Ações de API liberadas automaticamente para a rota inicial do cargo.
 */
export const ACOES_API_REDIRECIONAMENTO_INICIAL_RBAC = ['consultar'] as const;

export const RECURSO_PERMISSAO_ROTAS_RBAC = 'rotas';
export const RECURSO_PERMISSAO_GERAL_RBAC = 'geral';
export const RECURSO_PERMISSAO_API_RBAC = 'api';

/**
 * @description Mapeamento das ações que podem ser concedidas a um cargo.
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

/**
 * @description Constante que alimenta o formulário do ControlePermissoesCargo.
 * A chave do objeto é o recurso e o valor é um objeto com as ações e os endpoints da API associados a cada rota.
 */
export const MAPEAMENTO_ROTAS_API_RBAC: Partial<Record<string, IMapeamentoRotaApiRbac>> = {
  Usuarios: {
    acoes: {
      consultar: [
        { metodo: 'GET', path: '/usuarios/**' },
        { metodo: 'POST', path: '/usuarios/consulta' },
        { metodo: 'POST', path: '/usuarios/search' },
      ],
      gravar: [{ metodo: 'POST', path: '/usuarios' }],
      editar: [{ metodo: 'PUT', path: '/usuarios/**' }],
      remover: [{ metodo: 'DELETE', path: '/usuarios/**' }],
    },
  },
  Rbac: {
    acoes: {
      consultar: [
        { metodo: 'GET', path: '/rbac/cargos/**' },
        { metodo: 'POST', path: '/rbac/cargos/consulta' },
      ],
      gravar: [{ metodo: 'POST', path: '/rbac/cargos' }],
      editar: [{ metodo: 'PUT', path: '/rbac/cargos/**' }],
      remover: [{ metodo: 'DELETE', path: '/rbac/cargos/**' }],
    },
  },
  Erros: {
    acoes: {
      consultar: [
        { metodo: 'GET', path: '/erros/**' },
        { metodo: 'POST', path: '/erros/consulta' },
      ],
    },
  },
};

/**
 * @description Achatamento dos endpoints aninhados em uma única lista plana.
 */
export const RECURSOS_API_RBAC: IMapeamentoRotaApiRbac[] = Object.values(MAPEAMENTO_ROTAS_API_RBAC).filter(
  (pRecursoApi): pRecursoApi is IMapeamentoRotaApiRbac => Boolean(pRecursoApi),
);

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

import type { IAcaoRecursoRbac, IEndpointApiRbac, IMapeamentoRotaApiRbac } from './rbac.types';
