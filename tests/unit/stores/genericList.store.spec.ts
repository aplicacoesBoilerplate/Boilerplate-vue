import { createPinia, setActivePinia } from 'pinia';

import { useGenericListStore } from '@/stores/genericList.store';

import { beforeEach, describe, expect, it } from 'vitest';

describe('genericList store retention', () => {
  beforeEach(() => {
    sessionStorage.clear();
    setActivePinia(createPinia());
  });

  it('bounds retained contexts and cleans all metadata', () => {
    const store = useGenericListStore();

    for (let index = 0; index < 13; index += 1) {
      store.initContext(`context-${index}`);
    }

    expect(store.contextCount).toBeLessThanOrEqual(12);
    store.removeContext('context-12');
    expect(store.hasContextOptions('context-12')).toBe(false);

    store.clearAllContexts();
    expect(store.contextCount).toBe(0);
    expect(store.contextOptionsCount).toBe(0);
  });

  it('evicts an oversized context when its component releases ownership', () => {
    const store = useGenericListStore();
    store.initContext('large');
    store.addItems(
      'large',
      Array.from({ length: 501 }, (pUnused, pId) => {
        void pUnused;
        return { id: pId };
      }),
      501,
      true,
    );

    store.deactivateContext('large');

    expect(store.getExistingContext('large')).toBeUndefined();
    expect(sessionStorage.getItem('boilerplate.generic-list.context.large')).toBeNull();
  });
});
