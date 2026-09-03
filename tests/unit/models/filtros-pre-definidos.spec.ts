import { FILTROS_PRE_DEFINIDOS_RBAC } from '@/models/model/core/rbac/rbac.model';
import { FILTROS_PRE_DEFINIDOS_USUARIO } from '@/models/model/core/usuario.model';

import { describe, expect, it } from 'vitest';

import { routes } from '@/router/routes';

const FILTROS_ESPERADOS_USUARIO = [
  {
    chave: 'ativos',
    campo: 'ativo',
    condicao: 'verdadeiro',
    icone: 'mdi-check-circle-outline',
    modo: 'aplicar',
    rotuloChave: 'components.dialogFiltro.filtrosPreDefinidos.ativos',
  },
  {
    chave: 'por-cargo',
    campo: 'papel',
    condicao: 'selecao',
    icone: 'mdi-account-tag-outline',
    modo: 'preparar',
    rotuloChave: 'components.dialogFiltro.filtrosPreDefinidos.porCargo',
  },
];

const FILTROS_ESPERADOS_RBAC = [
  {
    chave: 'ativos',
    campo: 'ativo',
    condicao: 'verdadeiro',
    icone: 'mdi-check-circle-outline',
    modo: 'aplicar',
    rotuloChave: 'components.dialogFiltro.filtrosPreDefinidos.ativos',
  },
];

describe('Filtros pre-definidos por recurso', () => {
  it('define as sugestões literais do recurso de usuários', () => {
    expect(FILTROS_PRE_DEFINIDOS_USUARIO).toEqual(FILTROS_ESPERADOS_USUARIO);
  });

  it('define somente a sugestão literal de ativos para o recurso de cargos', () => {
    expect(FILTROS_PRE_DEFINIDOS_RBAC).toEqual(FILTROS_ESPERADOS_RBAC);
  });

  it('expõe os filtros predefinidos nas rotas consumidas por usuários e cargos', () => {
    const rotaAdministracao = routes.find((pRota) => pRota.name === 'Admin');
    const rotaUsuarios = rotaAdministracao?.children?.find((pRota) => pRota.name === 'Usuarios');
    const rotaRbac = rotaAdministracao?.children?.find((pRota) => pRota.name === 'Rbac');

    expect(rotaUsuarios?.meta?.predefinedFilters).toEqual(FILTROS_ESPERADOS_USUARIO);
    expect(rotaRbac?.meta?.predefinedFilters).toEqual(FILTROS_ESPERADOS_RBAC);
  });
});
