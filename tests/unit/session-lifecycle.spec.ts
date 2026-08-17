import { createPinia, setActivePinia } from 'pinia';

import { useAuthStore } from '@/stores/auth.store';

import type { IUsuario } from '@/models/model/core/usuario.model';

import { clearPrivateBrowserState } from '@/services/base/sessionLifecycle';
import { autenticacaoService } from '@/services/core/CAutenticacaoService';

import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('vue-router', async (pImportOriginal) => ({
  ...(await pImportOriginal<typeof import('vue-router')>()),
  useRoute: () => ({ meta: {}, name: 'Home', path: '/', query: {}, fullPath: '/' }),
  useRouter: () => ({ replace: vi.fn() }),
}));

vi.mock('@/router', async () => {
  const { ref } = await import('vue');
  return {
    default: {
      currentRoute: ref({ name: 'Home' }),
      replace: vi.fn().mockResolvedValue(undefined),
    },
  };
});

describe('session lifecycle', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    setActivePinia(createPinia());
    vi.restoreAllMocks();
  });

  it('clears private keys and cache prefixes from both storage implementations', () => {
    sessionStorage.setItem('token', 'session-secret');
    localStorage.setItem('token', 'legacy-secret');
    localStorage.setItem('boilerplate.recuperacao-senha.estado', '{"codigoOtp":"123456"}');
    sessionStorage.setItem('boilerplate.generic-list.context.users', 'private-records');
    localStorage.setItem('boilerplate.generic-filter.context.users', 'private-filter');

    clearPrivateBrowserState();

    expect(sessionStorage.length).toBe(0);
    expect(localStorage.length).toBe(0);
  });

  it('deduplicates remote logout and always performs local cleanup after failure', async () => {
    const logoutSpy = vi.spyOn(autenticacaoService, 'logout').mockRejectedValue(new Error('offline'));
    const { default: router } = await import('@/router');
    const store = useAuthStore();
    store.user = { id: 1, papel: 'USER' } as IUsuario;
    store.token = 'secret';
    sessionStorage.setItem('token', 'secret');
    localStorage.setItem('token', 'legacy-secret');
    sessionStorage.setItem('boilerplate.generic-list.context.users', 'private-records');

    await Promise.all([store.logout(), store.logout(), store.logout()]);

    expect(logoutSpy).toHaveBeenCalledTimes(1);
    expect(router.replace).toHaveBeenCalledTimes(1);
    expect(store.token).toBeNull();
    expect(store.user).toBeUndefined();
    expect(sessionStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
    expect(sessionStorage.getItem('boilerplate.generic-list.context.users')).toBeNull();
  });
});
