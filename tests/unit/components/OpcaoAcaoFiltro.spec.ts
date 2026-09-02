import { createPinia, setActivePinia } from 'pinia';

import { useGenericFilterStore } from '@/stores/genericFilter.store';

import OpcaoAcaoFiltro from '@/components/dialogs/core/filtros/fixtures/OpcaoAcaoFiltro.vue';

import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('vue-router', async (pImportOriginal) => ({
  ...(await pImportOriginal<typeof import('vue-router')>()),
  useRoute: () => ({ meta: {}, name: 'Usuarios', path: '/usuarios', query: {}, fullPath: '/usuarios' }),
  useRouter: () => ({ replace: vi.fn() }),
}));

describe('OpcaoAcaoFiltro', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('sobrescreve os filtros e aplica a consulta', () => {
    const store = useGenericFilterStore();
    store.filtersApplied = [{ campo: 'ativo', condicao: 'igual', valor: true }];
    const confirmarAplicacaoFiltros = vi.spyOn(store, 'confirmarAplicacaoFiltros');
    const wrapper = mount(OpcaoAcaoFiltro, {
      props: {
        filtros: [{ campo: 'nome', condicao: 'contém', valor: 'Ana' }],
        rotulo: 'Filtro salvo',
      },
      global: {
        stubs: {
          VMenu: { template: '<div><slot name="activator" :props="{}" /><slot /></div>' },
          VChip: { template: '<button><slot /></button>' },
          VList: { template: '<div><slot /></div>' },
          VListItem: { template: '<button @click="$emit(\'click\')"><slot /></button>' },
        },
      },
    });

    wrapper.vm.executar('sobreescrever');

    expect(store.filtersApplied).toEqual([{ campo: 'nome', condicao: 'contém', valor: 'Ana', valoresSelecionados: [] }]);
    expect(confirmarAplicacaoFiltros).toHaveBeenCalledOnce();
  });
});
