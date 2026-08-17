import { ref } from 'vue';
import { createPinia, setActivePinia } from 'pinia';

import AppBar from '@/components/layouts/base/appbar/AppBar.vue';

import { shallowMount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('vue-i18n', async (pImportOriginal) => ({
  ...(await pImportOriginal<typeof import('vue-i18n')>()),
  useI18n: () => ({ t: (pKey: string) => pKey }),
}));
vi.mock('vuetify', async (pImportOriginal) => ({
  ...(await pImportOriginal<typeof import('vuetify')>()),
  useDisplay: () => ({ smAndDown: ref(false), mdAndUp: ref(true) }),
}));

describe('AppBar lifecycle', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('clears its pending search timeout on unmount', () => {
    vi.useFakeTimers();
    setActivePinia(createPinia());
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
    const wrapper = shallowMount(AppBar);

    wrapper.findComponent({ name: 'AppBarSearchForm' }).vm.$emit('search', {});
    wrapper.unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
