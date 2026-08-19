import { nextTick } from 'vue';

import InputDebouncer from '@/components/forms/fixtures/InputDebouncer.vue';

import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('InputDebouncer lifecycle', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('does not emit a pending search after unmount', async () => {
    vi.useFakeTimers();
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
    const wrapper = mount(InputDebouncer, {
      props: { pesquisaCampo: '' },
      global: { stubs: { VTextField: true } },
    });

    await wrapper.setProps({ pesquisaCampo: 'consulta' });
    await nextTick();
    wrapper.unmount();
    await vi.runAllTimersAsync();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    expect(wrapper.emitted('onSearch')).toBeUndefined();
  });
});
