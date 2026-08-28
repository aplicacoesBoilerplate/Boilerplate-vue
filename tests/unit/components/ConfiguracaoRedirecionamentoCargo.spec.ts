import ConfiguracaoRedirecionamentoCargo from '@/components/forms/core/fixtures/rbac/ConfiguracaoRedirecionamentoCargo.vue';

import { shallowMount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

vi.mock('vue-i18n', async (pImportOriginal) => ({
  ...(await pImportOriginal<typeof import('vue-i18n')>()),
  useI18n: () => ({ t: (pKey: string) => pKey }),
}));

vi.mock('vue-router', async (pImportOriginal) => ({
  ...(await pImportOriginal<typeof import('vue-router')>()),
  useRouter: () => ({
    options: {
      routes: [
        {
          path: '/admin',
          name: 'Admin',
          redirect: { name: 'Usuarios' },
          meta: { title: 'routes.adm.title' },
          children: [
            {
              path: 'usuarios',
              name: 'Usuarios',
              meta: { title: 'routes.adm.children.users.title' },
            },
          ],
        },
      ],
    },
  }),
}));

describe('ConfiguracaoRedirecionamentoCargo', () => {
  it('omits redirect routes while preserving their child routes as initial options', () => {
    const wrapper = shallowMount(ConfiguracaoRedirecionamentoCargo, {
      props: {
        redirecionamento: { path: '', filtros: [] },
      },
      global: {
        stubs: {
          DialogFiltro: true,
          'v-alert': true,
          'v-autocomplete': {
            props: ['items'],
            template: '<div />',
          },
          'v-badge': true,
          'v-btn': true,
          'v-card': true,
          'v-card-text': true,
          'v-icon': true,
          'v-list-item': true,
          'v-tooltip': true,
        },
      },
    });

    const { rotasDisponiveis } = wrapper.vm.$.setupState as {
      rotasDisponiveis: { name: string; path: string }[];
    };

    expect(rotasDisponiveis).toEqual([
      expect.objectContaining({ name: 'Usuarios', path: '/admin/usuarios' }),
    ]);
  });
});
