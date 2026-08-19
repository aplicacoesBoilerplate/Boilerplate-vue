import { createPinia, setActivePinia } from 'pinia';

import { useAuthStore } from '@/stores/auth.store';

vi.mock('vue-router', async (pImportOriginal) => ({
  ...(await pImportOriginal<typeof import('vue-router')>()),
  useRoute: () => ({ meta: {}, name: 'Home', path: '/', query: {}, fullPath: '/' }),
  useRouter: () => ({ replace: vi.fn() }),
}));

import type { ICargoRbac } from '@/models/model/core/rbac/rbac.model';
import type { IUsuario } from '@/models/model/core/usuario.model';

import { autenticacaoService } from '@/services/core/CAutenticacaoService';

import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('auth store permission refresh', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    setActivePinia(createPinia());
    vi.restoreAllMocks();
  });

  it('shares one in-flight permission request between concurrent callers', async () => {
    let resolveRequest!: (cargo: ICargoRbac) => void;
    const deferred = new Promise<ICargoRbac>((pResolve) => {
      resolveRequest = pResolve;
    });
    const requestSpy = vi
      .spyOn(autenticacaoService, 'buscarCargoUsuarioAutenticado')
      .mockReturnValue(deferred);
    const store = useAuthStore();
    store.user = { papel: 'USER' } as IUsuario;

    const requests = [
      store.atualizarPermissoesUsuarioAutenticado(),
      store.atualizarPermissoesUsuarioAutenticado(),
      store.atualizarPermissoesUsuarioAutenticado(),
    ];

    expect(requestSpy).toHaveBeenCalledTimes(1);
    const cargo = { id: 7, nome: 'Operador' } as ICargoRbac;
    resolveRequest(cargo);
    await expect(Promise.all(requests)).resolves.toEqual([cargo, cargo, cargo]);
  });

  it('clears the local session before a remote logout request settles', async () => {
    sessionStorage.setItem('token', 'session-token');
    localStorage.setItem('boilerplate.generic-list.context.private-cache', 'sensitive');
    const remoteLogout = new Promise<void>(() => undefined);
    const logoutSpy = vi.spyOn(autenticacaoService, 'logout').mockReturnValue(remoteLogout);
    const store = useAuthStore();

    void store.logout();

    expect(store.isAuthenticated).toBe(false);
    expect(sessionStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('boilerplate.generic-list.context.private-cache')).toBeNull();
    expect(logoutSpy).toHaveBeenCalledWith('session-token', expect.any(AbortSignal));
  });
});
