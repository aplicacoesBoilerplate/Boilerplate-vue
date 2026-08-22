import { createPinia, setActivePinia } from 'pinia';

import { useAuthStore } from '@/stores/auth.store';

import { criarCargoRbacPadrao } from '@/models/model/core/rbac/rbac.model';
import { criarUsuarioPadrao } from '@/models/model/core/usuario.model';

import { usePermissoesRbac } from '@/composables/usePermissoesRbac';

import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('vue-i18n', async (pImportOriginal) => ({
  ...(await pImportOriginal<typeof import('vue-i18n')>()),
  useI18n: () => ({ t: (pChave: string) => pChave }),
}));

vi.mock('vue-router', async (pImportOriginal) => ({
  ...(await pImportOriginal<typeof import('vue-router')>()),
  useRoute: () => ({ meta: {}, name: 'Home', path: '/', query: {}, fullPath: '/' }),
}));

describe('usePermissoesRbac', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('permite gerenciar o registro criado pelo usuário sem a permissão global', () => {
    const authStore = useAuthStore();
    authStore.user = criarUsuarioPadrao({ id: 1 });
    authStore.cargoAtual = criarCargoRbacPadrao();

    expect(usePermissoesRbac().podeGerenciarRegistro({ auditoria: { criadoPor: 1 } })).toBe(true);
  });

  it('bloqueia o gerenciamento de registro de terceiro sem a permissão global', () => {
    const authStore = useAuthStore();
    authStore.user = criarUsuarioPadrao({ id: 1 });
    authStore.cargoAtual = criarCargoRbacPadrao();

    expect(usePermissoesRbac().podeGerenciarRegistro({ auditoria: { criadoPor: 2 } })).toBe(false);
  });

  it('permite gerenciar registros de terceiros com a permissão global', () => {
    const authStore = useAuthStore();
    authStore.user = criarUsuarioPadrao({ id: 1 });
    authStore.cargoAtual = criarCargoRbacPadrao({
      permissoes: [{ recurso: 'geral', acao: 'gerenciarRegistros', liberado: true }],
    });

    expect(usePermissoesRbac().podeGerenciarRegistro({ auditoria: { criadoPor: 2 } })).toBe(true);
  });
});
