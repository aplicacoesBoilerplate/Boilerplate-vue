import { createPinia, setActivePinia } from 'pinia';

import { useGenericFilterStore } from '@/stores/genericFilter.store';

import { beforeEach, describe, expect, it, vi } from 'vitest';

const { buscarPreferencias, salvarPreferencia } = vi.hoisted(() => ({
  buscarPreferencias: vi.fn(),
  salvarPreferencia: vi.fn(),
}));

vi.mock('vue-router', async (pImportOriginal) => ({
  ...(await pImportOriginal<typeof import('vue-router')>()),
  useRoute: () => ({ meta: { filterContext: 'usuarios' }, name: 'Usuarios', path: '/usuarios', query: {}, fullPath: '/usuarios' }),
  useRouter: () => ({ replace: vi.fn() }),
}));

vi.mock('@/services/CPreferenciaUsuarioService', () => ({
  preferenciaUsuarioService: {
    buscarPreferenciasUsuarioAutenticado: buscarPreferencias,
    salvarPreferenciaUsuarioAutenticado: salvarPreferencia,
  },
}));

describe('genericFilter store remote persistence', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    sessionStorage.setItem('token', 'token-teste');
    buscarPreferencias.mockReset();
    salvarPreferencia.mockReset();
    setActivePinia(createPinia());
  });

  it('restaura os contextos de filtros da preferência remota', async () => {
    buscarPreferencias.mockResolvedValue({
      preferencias: [
        {
          contexto: 'filters',
          chave: 'usuarios',
          valorJson: JSON.stringify({
            filtrosAplicados: [{ campo: 'nome', condicao: 'contém', valor: 'José' }],
            modeloFiltro: { campo: 'email' },
            pesquisaDrawerLeft: 'usuários',
          }),
        },
      ],
    });
    const store = useGenericFilterStore();

    await store.carregarFiltrosBackend();

    expect(store.estadosPorContexto.usuarios).toEqual({
      filtrosAplicados: [{ campo: 'nome', condicao: 'contém', valor: 'José' }],
      modeloFiltro: { campo: 'email' },
      pesquisaDrawerLeft: 'usuários',
    });
  });

  it('persiste alterações no serviço remoto sem gravar filtros no localStorage', async () => {
    salvarPreferencia.mockResolvedValue({});
    const store = useGenericFilterStore();

    store.filtersApplied = [{ campo: 'nome', condicao: 'contém', valor: 'José' }];
    await vi.waitFor(() => expect(salvarPreferencia).toHaveBeenCalledTimes(1));

    expect(salvarPreferencia).toHaveBeenCalledWith({
      contexto: 'filters',
      chave: 'usuarios',
      valorJson: JSON.stringify({
        filtrosAplicados: [{ campo: 'nome', condicao: 'contém', valor: 'José' }],
        modeloFiltro: {},
        pesquisaDrawerLeft: '',
      }),
    });
    expect(localStorage.getItem('boilerplate.generic-filter.context.usuarios')).toBeNull();
  });
});
