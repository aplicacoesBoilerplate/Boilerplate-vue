import { nextTick } from 'vue';

import DialogFormCargoRbac from '@/components/dialogs/core/DialogFormCargoRbac.vue';

import { shallowMount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

vi.mock('vue-i18n', async (pImportOriginal) => ({
  ...(await pImportOriginal<typeof import('vue-i18n')>()),
  useI18n: () => ({ t: (pChave: string) => pChave }),
}));

describe('DialogFormCargoRbac', () => {
  it('habilita o salvamento ao abrir um cargo existente para edição', async () => {
    const wrapper = shallowMount(DialogFormCargoRbac, {
      props: {
        exibirDialog: false,
        modoEdicao: true,
        cargosDisponiveis: [],
        usuarios: [],
      },
    });

    await wrapper.setProps({ exibirDialog: true });
    await nextTick();

    const { formAlterado, formValido } = wrapper.vm.$.setupState as { formAlterado: boolean; formValido: boolean };

    expect(formAlterado).toBe(false);
    expect(formValido).toBe(true);
  });

  it('mantém o salvamento desabilitado ao abrir um novo cargo', async () => {
    const wrapper = shallowMount(DialogFormCargoRbac, {
      props: {
        exibirDialog: false,
        modoEdicao: false,
        cargosDisponiveis: [],
        usuarios: [],
      },
    });

    await wrapper.setProps({ exibirDialog: true });
    await nextTick();

    const { formValido } = wrapper.vm.$.setupState as { formValido: boolean };

    expect(formValido).toBe(false);
  });
});
