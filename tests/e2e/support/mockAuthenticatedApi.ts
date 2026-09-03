import type { Page } from '@playwright/test';

const usuario = {
  id: 1,
  nome: 'Usuário E2E',
  email: 'e2e@boilerplate.local',
  papel: 'ADMIN',
  telefone: '(11) 99999-9999',
  notificar: true,
  ativo: true,
};

const usuarioDisponivel = {
  id: 2,
  nome: 'Usuário disponível E2E',
  email: 'disponivel.e2e@boilerplate.local',
  papel: 'USER',
  telefone: '(11) 98888-8888',
  notificar: false,
  ativo: true,
};

const cargo = {
  id: 1,
  papel: 'ADMIN',
  nome: 'Administrador',
  icone: 'mdi-account-tie',
  descricao: 'Acesso do teste E2E',
  comportamentoPadrao: 'liberar',
  permissoes: [],
  funcionalidades: [],
  redirecionamentoInicial: { path: '/', filtros: [] },
  ativo: true,
};

export async function mockAuthenticatedApi(pPage: Page): Promise<void> {
  let preferencias: Array<{ contexto: string; chave: string; valorJson: string }> = [];

  await pPage.addInitScript(() => sessionStorage.setItem('token', 'e2e-token'));

  await pPage.route('**/api/v1/**', async (pRoute) => {
    const path = new URL(pRoute.request().url()).pathname;
    const method = pRoute.request().method();
    let payload: unknown = {};

    if (path.endsWith('/actuator/health-check/public')) payload = { status: 'UP', components: {} };
    else if (path.endsWith('/auth/me')) payload = usuario;
    else if (path.endsWith('/auth/me/cargo')) payload = cargo;
    else if (path.endsWith('/usuarios/1')) payload = usuario;
    else if (path.endsWith('/usuarios') && method === 'POST') {
      const request = pRoute.request().postDataJSON() as typeof usuario;
      payload = { ...usuario, ...request, id: 2 };
    }
    else if (path.endsWith('/usuarios/consulta')) {
      payload = { registros: [usuario, usuarioDisponivel], proximaEntrada: null, possuiMais: false };
    } else if (path.endsWith('/rbac/cargos') && method === 'POST') {
      const request = pRoute.request().postDataJSON() as typeof cargo;
      payload = { ...cargo, ...request, id: 2 };
    } else if (path.endsWith('/rbac/cargos/consulta')) {
      payload = { registros: [cargo], proximaEntrada: null, possuiMais: false };
    } else if (path.endsWith('/preferencias/me/item') && method === 'PUT') {
      const preferencia = pRoute.request().postDataJSON() as (typeof preferencias)[number];
      preferencias = [
        ...preferencias.filter(
          (pItem) => pItem.contexto !== preferencia.contexto || pItem.chave !== preferencia.chave,
        ),
        preferencia,
      ];
      payload = preferencia;
    } else if (path.endsWith('/preferencias/me') && method === 'PUT') {
      const resposta = pRoute.request().postDataJSON() as { preferencias: typeof preferencias };
      preferencias = resposta.preferencias;
      payload = { preferencias };
    } else if (path.endsWith('/preferencias/me')) {
      payload = { preferencias };
    }

    await pRoute.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(payload),
    });
  });
}
