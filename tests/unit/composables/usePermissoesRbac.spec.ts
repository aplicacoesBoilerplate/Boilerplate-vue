import { createPinia, setActivePinia } from 'pinia';

import { useAuthStore } from '@/stores/auth.store';

import { criarCargoRbacPadrao } from '@/models/model/core/rbac/rbac.model';
import { criarUsuarioPadrao } from '@/models/model/core/usuario.model';
import type { IPermissaoCargoRbac } from '@/models/model/core/rbac/rbac.types';

import { usePermissoesRbac } from '@/composables/usePermissoesRbac';

import { beforeEach, describe, expect, it, vi } from 'vitest';

const PERMISSOES_EDICAO_USUARIO = [
  { recurso: 'api', acao: 'PUT /usuarios', liberado: true },
  { recurso: 'api', acao: 'PATCH /usuarios', liberado: true },
] satisfies IPermissaoCargoRbac[];

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

  it('bloqueia o gerenciamento do próprio registro sem a permissão específica de edição', () => {
    const authStore = useAuthStore();
    authStore.user = criarUsuarioPadrao({ id: 1 });
    authStore.cargoAtual = criarCargoRbacPadrao();

    expect(usePermissoesRbac().podeGerenciarRegistro('Usuarios', 'editar', { auditoria: { criadoPor: 1 } })).toBe(false);
  });

  it('permite gerenciar o próprio registro com a permissão específica de edição', () => {
    const authStore = useAuthStore();
    authStore.user = criarUsuarioPadrao({ id: 1 });
    authStore.cargoAtual = criarCargoRbacPadrao({ permissoes: PERMISSOES_EDICAO_USUARIO });

    expect(usePermissoesRbac().podeGerenciarRegistro('Usuarios', 'editar', { auditoria: { criadoPor: 1 } })).toBe(true);
  });

  it('bloqueia o gerenciamento de registro de terceiro sem a funcionalidade', () => {
    const authStore = useAuthStore();
    authStore.user = criarUsuarioPadrao({ id: 1 });
    authStore.cargoAtual = criarCargoRbacPadrao({
      permissoes: PERMISSOES_EDICAO_USUARIO,
    });

    expect(usePermissoesRbac().podeGerenciarRegistro('Usuarios', 'editar', { auditoria: { criadoPor: 2 } })).toBe(false);
  });

  it('exige a permissão específica mesmo com a funcionalidade de gerenciar registros de terceiros', () => {
    const authStore = useAuthStore();
    authStore.user = criarUsuarioPadrao({ id: 1 });
    authStore.cargoAtual = criarCargoRbacPadrao({
      funcionalidades: [{ funcionalidade: 'gerenciarRegistrosOutros', liberado: true }],
    });

    expect(usePermissoesRbac().podeGerenciarRegistro('Usuarios', 'editar', { auditoria: { criadoPor: 2 } })).toBe(false);
  });

  it('permite gerenciar registros de terceiros com a permissão específica e a funcionalidade', () => {
    const authStore = useAuthStore();
    authStore.user = criarUsuarioPadrao({ id: 1 });
    authStore.cargoAtual = criarCargoRbacPadrao({
      permissoes: PERMISSOES_EDICAO_USUARIO,
      funcionalidades: [{ funcionalidade: 'gerenciarRegistrosOutros', liberado: true }],
    });

    expect(usePermissoesRbac().podeGerenciarRegistro('Usuarios', 'editar', { auditoria: { criadoPor: 2 } })).toBe(true);
  });
});
