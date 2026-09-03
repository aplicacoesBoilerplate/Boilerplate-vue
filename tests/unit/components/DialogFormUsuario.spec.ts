import { nextTick } from 'vue';

import DialogFormUsuario from '@/components/dialogs/core/DialogFormUsuario.vue';

import { shallowMount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

vi.mock('vue-i18n', async (pImportOriginal) => ({
  ...(await pImportOriginal<typeof import('vue-i18n')>()),
  useI18n: () => ({ t: (pKey: string) => pKey }),
}));

describe('DialogFormUsuario', () => {
  it('mantém o salvamento desabilitado até que um usuário existente seja alterado', async () => {
    const wrapper = shallowMount(DialogFormUsuario, {
      props: {
        exibirDialog: false,
        modoEdicao: true,
        usuario: {},
      },
    });

    await wrapper.setProps({ exibirDialog: true });
    await nextTick();

    const { formAlterado, isFormValid } = wrapper.vm.$.setupState as { formAlterado: boolean; isFormValid: boolean };

    expect(formAlterado).toBe(false);
    expect(isFormValid).toBe(true);
  });

  it('clears loading when the dialog closes after a save', async () => {
    const wrapper = shallowMount(DialogFormUsuario, {
      props: {
        exibirDialog: true,
        modoEdicao: false,
        usuario: {},
      },
      global: {
        directives: {
          tooltip: () => undefined,
        },
        stubs: {
          BaseDialog: {
            props: ['loading'],
            template: '<div :data-loading="loading"><slot name="content" /><slot name="actions" /></div>',
          },
          'v-btn': true,
          'v-spacer': true,
        },
      },
    });

    wrapper.findComponent({ name: 'FormUsuario' }).vm.$emit('onSubmit');
    await wrapper.vm.$nextTick();
    expect(wrapper.find('[data-loading="true"]').exists()).toBe(true);

    await wrapper.setProps({ exibirDialog: false });
    expect(wrapper.find('[data-loading="false"]').exists()).toBe(true);
  });
});
