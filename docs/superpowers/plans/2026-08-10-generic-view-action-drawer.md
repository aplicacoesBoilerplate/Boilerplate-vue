# GenericView Action Drawer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Garantir que as ações do `GenericView`, incluindo o botão de gráficos, apareçam exclusivamente dentro do `BtnActionDrawer` e fiquem ocultas quando ele estiver fechado.

**Architecture:** O `GenericView` continuará agregando as ações e o `BtnActionDrawer` continuará controlando apresentação, hover e transição. A correção elimina o outlet duplicado de `list-header-actions` e monta o drawer somente quando existir ao menos uma ação efetiva. Um teste E2E isolará o frontend do backend com mocks de rede e validará o comportamento fechado → aberto → fechado.

**Tech Stack:** Vue 3.5, Vuetify 4.1, TypeScript 5.8, Vite 6 e Playwright Test 1.61.

## Global Constraints

- Quando fechado, o drawer deve exibir somente seu botão principal.
- Quando aberto por hover ou pelo estado forçado, deve exibir todas as ações agrupadas.
- Ações personalizadas, gráficos, exportação e criação devem permanecer funcionais.
- O conteúdo de `list-header-actions` deve ser renderizado uma única vez.
- O contrato público e a animação do `BtnActionDrawer` não serão alterados.
- Não incluir refatorações, mudanças visuais ou alterações de permissão fora deste comportamento.
- O worktree já possui mudanças do usuário; revisar o diff e não sobrescrever nem incluir alterações preexistentes em commits.

---

### Task 1: Criar a infraestrutura E2E isolada

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `playwright.config.ts`
- Create: `tests/e2e/support/mockAuthenticatedApi.ts`
- Create: `tests/e2e/generic-view-action-drawer.spec.ts`

**Interfaces:**
- Consumes: rota `/usuarios`, token `sessionStorage['token']` e endpoints HTTP usados pelo carregamento autenticado.
- Produces: `mockAuthenticatedApi(pPage: Page): Promise<void>` e comando `npm run test:e2e`.

- [ ] **Step 1: Instalar o runner Playwright**

Run:

```powershell
npm install --save-dev @playwright/test@^1.61.0
npx playwright install chromium
```

Expected: `@playwright/test` é adicionado às dependências de desenvolvimento e o Chromium fica disponível localmente.

- [ ] **Step 2: Adicionar o script E2E ao package.json**

Adicionar em `scripts`:

```json
"test:e2e": "playwright test"
```

- [ ] **Step 3: Criar a configuração do Playwright**

Criar `playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4174',
    serviceWorkers: 'block',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 4174 --strictPort',
    url: 'http://127.0.0.1:4174',
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
```

- [ ] **Step 4: Criar o mock autenticado reutilizável**

Criar `tests/e2e/support/mockAuthenticatedApi.ts`:

```ts
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

const cargo = {
  id: 1,
  papel: 'ADMIN',
  nome: 'Administrador',
  icone: 'mdi-account-tie',
  descricao: 'Acesso do teste E2E',
  comportamentoPadrao: 'liberar',
  permissoes: [],
  redirecionamentoInicial: { path: '/', filtros: [] },
  ativo: true,
};

export async function mockAuthenticatedApi(pPage: Page): Promise<void> {
  await pPage.addInitScript(() => sessionStorage.setItem('token', 'e2e-token'));

  await pPage.route('**/actuator/health-check', async (pRoute) => {
    await pRoute.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status: 'UP', components: {} }),
    });
  });

  await pPage.route('**/api/v1/**', async (pRoute) => {
    const path = new URL(pRoute.request().url()).pathname;
    let payload: unknown = {};

    if (path.endsWith('/auth/me')) payload = { idUsuario: 1 };
    else if (path.endsWith('/auth/me/cargo')) payload = cargo;
    else if (path.endsWith('/usuarios/1')) payload = usuario;
    else if (path.endsWith('/usuarios/consulta')) {
      payload = { registros: [usuario], proximaEntrada: null, possuiMais: false };
    } else if (path.endsWith('/rbac/cargos/consulta')) {
      payload = { registros: [cargo], proximaEntrada: null, possuiMais: false };
    } else if (path.endsWith('/preferencias/me')) {
      payload = { preferencias: [] };
    }

    await pRoute.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(payload),
    });
  });
}
```

- [ ] **Step 5: Criar e executar um smoke test da infraestrutura**

Criar inicialmente `tests/e2e/generic-view-action-drawer.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

import { mockAuthenticatedApi } from './support/mockAuthenticatedApi';

test.beforeEach(async ({ page }) => {
  await mockAuthenticatedApi(page);
});

test('carrega a lista de usuários com a API isolada', async ({ page }) => {
  await page.goto('/usuarios');

  await expect(page.getByText('Usuário E2E')).toBeVisible();
});
```

Run:

```powershell
npm run test:e2e -- tests/e2e/generic-view-action-drawer.spec.ts --project=chromium
```

Expected: PASS com 1 teste aprovado. Se a rota exigir outro endpoint, adicionar apenas a resposta exata desse endpoint ao helper e repetir.

- [ ] **Step 6: Criar checkpoint seguro da infraestrutura**

Run:

```powershell
git diff -- package.json package-lock.json playwright.config.ts tests/e2e
git diff --check -- package.json package-lock.json playwright.config.ts tests/e2e
```

Expected: somente a infraestrutura descrita nesta task, além das alterações preexistentes identificáveis em `package.json` e `package-lock.json`. Não fazer commit automático desses dois arquivos enquanto contiverem mudanças anteriores do usuário.

---

### Task 2: Reproduzir e corrigir a duplicação da ação de gráficos

**Files:**
- Modify: `tests/e2e/generic-view-action-drawer.spec.ts`
- Modify: `src/components/layouts/generic/GenericView.vue:16-28`
- Verify unchanged: `src/components/layouts/base/appbar/fixtures/BtnActionDrawer.vue`

**Interfaces:**
- Consumes: `list-header-actions`, `exibirGraficos`, `exibirExportacao`, `serviceExportacao`, `exibirNovoRegistro` e `activator-novo-registro`.
- Produces: exatamente um outlet `list-header-actions`, sempre dentro do `BtnActionDrawer`.

- [ ] **Step 1: Escrever o teste de regressão que falha**

Adicionar ao final de `tests/e2e/generic-view-action-drawer.spec.ts`:

```ts
test('mantém a ação de gráficos exclusivamente dentro do drawer', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (pMessage) => {
    if (pMessage.type() === 'error') consoleErrors.push(pMessage.text());
  });
  page.on('pageerror', (pError) => consoleErrors.push(pError.message));

  await page.goto('/usuarios');
  await expect(page.getByText('Usuário E2E')).toBeVisible();

  const main = page.locator('.v-main');
  const drawerTrigger = main.locator('button:has(.mdi-menu-open)');
  const graphAction = main.locator('.mdi-chart-pie');

  await expect(drawerTrigger).toBeVisible();
  await expect(graphAction).toHaveCount(0);

  await drawerTrigger.hover();
  await expect(graphAction).toHaveCount(1);

  await main.hover({ position: { x: 80, y: 400 } });
  await expect(graphAction).toHaveCount(0);
  expect(consoleErrors).toEqual([]);
});
```

- [ ] **Step 2: Executar o teste e confirmar o RED**

Run:

```powershell
npm run test:e2e -- tests/e2e/generic-view-action-drawer.spec.ts --project=chromium --grep "exclusivamente"
```

Expected: FAIL na primeira `toHaveCount(0)` porque o outlet externo mantém uma instância de `.mdi-chart-pie` no DOM.

- [ ] **Step 3: Aplicar a correção mínima em GenericView.vue**

Remover completamente o outlet externo:

```vue
<slot name="list-header-actions">
  <template v-if="$slots['list-header-actions']" />
</slot>
```

Substituir a condição que monta o drawer por:

```vue
<template
  v-if="
    $slots['list-header-actions'] ||
    exibirGraficos ||
    (exibirExportacao && serviceExportacao) ||
    (exibirNovoRegistro && $slots['activator-novo-registro'])
  "
>
```

Manter o único outlet dentro do drawer:

```vue
<slot name="list-header-actions" />
```

Não modificar `BtnActionDrawer.vue`.

- [ ] **Step 4: Executar o teste e confirmar o GREEN**

Run:

```powershell
npm run test:e2e -- tests/e2e/generic-view-action-drawer.spec.ts --project=chromium
```

Expected: PASS com o smoke test e a regressão do drawer aprovados.

- [ ] **Step 5: Revisar o diff funcional**

Run:

```powershell
git diff -- src/components/layouts/generic/GenericView.vue src/components/layouts/base/appbar/fixtures/BtnActionDrawer.vue tests/e2e/generic-view-action-drawer.spec.ts
git diff --check -- src/components/layouts/generic/GenericView.vue tests/e2e/generic-view-action-drawer.spec.ts
```

Expected: `GenericView.vue` perde o outlet duplicado e recebe somente a condição completa; `BtnActionDrawer.vue` permanece sem diff.

---

### Task 3: Executar a verificação final da entrega

**Files:**
- Verify: `src/components/layouts/generic/GenericView.vue`
- Verify: `src/components/layouts/base/appbar/fixtures/BtnActionDrawer.vue`
- Verify: `tests/e2e/generic-view-action-drawer.spec.ts`
- Verify: `playwright.config.ts`
- Verify: `package.json`
- Verify: `package-lock.json`

**Interfaces:**
- Consumes: implementação e teste das Tasks 1 e 2.
- Produces: evidência atual de E2E, lint direcionado, type-check e build.

- [ ] **Step 1: Executar a regressão E2E novamente**

Run:

```powershell
npm run test:e2e -- tests/e2e/generic-view-action-drawer.spec.ts --project=chromium
```

Expected: 2 testes aprovados, sem erros de console ou de página.

- [ ] **Step 2: Executar ESLint nos arquivos alterados**

Run:

```powershell
npx eslint --config config/eslint.config.js src/components/layouts/generic/GenericView.vue tests/e2e/generic-view-action-drawer.spec.ts
```

Expected: exit code 0. Avisos preexistentes fora desses arquivos não pertencem a esta correção.

- [ ] **Step 3: Executar type-check**

Run:

```powershell
npm run type-check
```

Expected: exit code 0.

- [ ] **Step 4: Executar build de produção**

Run:

```powershell
npm run build-only
```

Expected: exit code 0; avisos já conhecidos de tamanho de chunks não bloqueiam a entrega.

- [ ] **Step 5: Auditar requisitos e estado do worktree**

Run:

```powershell
git status --short
git diff --check
git diff -- src/components/layouts/generic/GenericView.vue src/components/layouts/base/appbar/fixtures/BtnActionDrawer.vue playwright.config.ts tests/e2e package.json package-lock.json
```

Expected: cada requisito da especificação está coberto por código ou teste; nenhum arquivo temporário foi incluído; as demais mudanças do usuário permanecem preservadas.
