import BaseForm from '@/components/forms/base/BaseForm.vue';

import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('BaseForm', () => {
  it('emite que o formulário foi alterado quando o modelo diverge do estado inicial', async () => {
    const wrapper = mount(BaseForm, {
      props: {
        formModel: { nome: 'Cargo original' },
        isDirty: false,
      },
      global: {
        stubs: {
          'v-form': { template: '<form><slot /></form>' },
        },
      },
    });

    wrapper.vm.registrarModeloInicial();
    await wrapper.setProps({ formModel: { nome: 'Cargo alterado' } });

    expect(wrapper.emitted('update:isDirty')).toContainEqual([true]);
  });
});
