import { expect, test } from '@playwright/test';

import { mockAuthenticatedApi } from './support/mockAuthenticatedApi';

function monitorarProblemasConsole(page: import('@playwright/test').Page): string[] {
  const problemas: string[] = [];

  page.on('console', (pMensagem) => {
    const texto = pMensagem.text();
    const avisoDoAmbienteDeTeste = texto.includes('Service Worker registration blocked by Playwright');
    if ((pMensagem.type() === 'error' || pMensagem.type() === 'warning') && !avisoDoAmbienteDeTeste) {
      problemas.push(texto);
    }
  });
  page.on('pageerror', (pErro) => problemas.push(pErro.message));

  return problemas;
}

test.beforeEach(async ({ page }) => {
  await mockAuthenticatedApi(page);
});

test('carrega a lista de usuários com a API isolada', async ({ page }) => {
  await page.goto('/admin/usuarios', { waitUntil: 'domcontentloaded' });

  await expect(page.getByText('Usuário E2E')).toBeVisible();
});

test('mantém a ação de gráficos exclusivamente dentro do drawer', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (pMessage) => {
    if (pMessage.type() === 'error') consoleErrors.push(pMessage.text());
  });
  page.on('pageerror', (pError) => consoleErrors.push(pError.message));

  await page.goto('/admin/usuarios', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('Usuário E2E')).toBeVisible();

  const main = page.locator('.v-main');
  const drawerTrigger = main.locator('button:has(.mdi-menu-open)');
  const graphAction = main.locator('button:has(.mdi-chart-pie)');

  await expect(drawerTrigger).toBeVisible();
  await expect(graphAction).toBeHidden();

  await drawerTrigger.hover();
  await expect(graphAction).toBeVisible();

  await main.hover({ position: { x: 80, y: 400 } });
  await expect(graphAction).toBeHidden();
  expect(consoleErrors).toEqual([]);
});

test('mantém filtro, gráficos e exportação interativos após a migração', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (pMessage) => {
    const mensagem = pMessage.text();
    const avisoDoAmbienteDeTeste = mensagem.includes('Service Worker registration blocked by Playwright');
    if ((pMessage.type() === 'error' || pMessage.type() === 'warning') && !avisoDoAmbienteDeTeste) {
      consoleErrors.push(mensagem);
    }
  });
  page.on('pageerror', (pError) => consoleErrors.push(pError.message));

  await page.goto('/admin/usuarios');
  await expect(page.getByText('Usuário E2E')).toBeVisible();

  const main = page.locator('.v-main');
  await page.locator('header button:has(.mdi-filter-cog)').click();
  const dialogFiltros = page.getByRole('dialog');
  await expect(dialogFiltros).toBeVisible();
  await expect(dialogFiltros).toContainText(/Selecione um campo|Select a field/);
  await dialogFiltros.locator('button:has(.mdi-close)').click();
  await expect(dialogFiltros).toBeHidden();

  await main.locator('button:has(.mdi-menu-open)').hover();
  await main.locator('button:has(.mdi-chart-pie)').click();
  await main.locator('button:has(.mdi-menu-open)').hover();
  await expect(main.locator('button:has(.mdi-table)')).toBeVisible();
  await main.locator('button:has(.mdi-table)').click();
  await expect(main.locator('button:has(.mdi-chart-pie)')).toBeVisible();

  await main.locator('button:has(.mdi-menu-open)').hover();
  await expect(main.locator('button:has(.mdi-export)')).toBeVisible();
  await main.locator('button:has(.mdi-export)').click();
  await expect(page.locator('.v-overlay--active .mdi-file-pdf-box')).toBeVisible();
  await page.keyboard.press('Escape');

  expect(consoleErrors).toEqual([]);
});

test('seleciona o agrupador pela lista dos controles do gráfico', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (pMessage) => {
    const mensagem = pMessage.text();
    const avisoDoAmbienteDeTeste = mensagem.includes('Service Worker registration blocked by Playwright');
    if ((pMessage.type() === 'error' || pMessage.type() === 'warning') && !avisoDoAmbienteDeTeste) {
      consoleErrors.push(mensagem);
    }
  });
  page.on('pageerror', (pError) => consoleErrors.push(pError.message));

  await page.goto('/admin/usuarios', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('Usuário E2E')).toBeVisible();

  const main = page.locator('.v-main');
  await main.locator('button:has(.mdi-menu-open)').hover();
  await main.locator('button:has(.mdi-chart-pie)').click();

  const chartCard = main.locator('.v-card').filter({
    has: page.locator('button:has(.mdi-tune)'),
  }).last();
  await expect(chartCard).toBeVisible();
  await expect(chartCard.getByRole('combobox')).toHaveCount(0, { timeout: 5_000 });

  await chartCard.locator('button:has(.mdi-tune)').click();

  const menuAgrupamento = page.locator('.v-overlay--active .v-list').filter({
    hasText: /Agrupar por|Group by/,
  });
  await expect(menuAgrupamento).toBeVisible();

  const opcaoAtivo = menuAgrupamento.locator('.v-list-item').filter({ hasText: /^(Ativo|Active)$/ });
  const opcaoCargo = menuAgrupamento.locator('.v-list-item').filter({ hasText: /^(Cargo|Role)$/ });
  await expect(opcaoAtivo).toHaveCount(1);
  await expect(opcaoCargo).toHaveCount(1);

  const ativoEstaSelecionado = (await opcaoAtivo.getAttribute('class'))?.includes('v-list-item--active') ?? false;
  const novaOpcao = ativoEstaSelecionado ? opcaoCargo : opcaoAtivo;
  const descricaoNovaOpcao = (await novaOpcao.locator('.v-list-item-title').textContent())?.trim() ?? '';

  await novaOpcao.click();

  await expect(novaOpcao).toHaveClass(/v-list-item--active/);
  await expect(novaOpcao.locator('.mdi-check')).toBeVisible();
  await expect(chartCard.locator('.v-card-title')).toContainText(new RegExp(descricaoNovaOpcao, 'i'));
  await expect(menuAgrupamento).toBeVisible();
  expect(consoleErrors).toEqual([]);
});

test('alterna a ordenação e refaz a consulta com a nova direção', async ({ page }) => {
  const ordensConsultadas: string[] = [];

  page.on('request', (pRequest) => {
    if (!pRequest.url().endsWith('/usuarios/consulta') || pRequest.method() !== 'POST') return;

    const payload = pRequest.postDataJSON() as { ordenacao?: string };
    if (payload.ordenacao) ordensConsultadas.push(payload.ordenacao);
  });

  await page.goto('/admin/usuarios');
  await expect(page.getByText('Usuário E2E')).toBeVisible();

  const main = page.locator('.v-main');
  const ordenarCrescente = main.locator('button:has(.mdi-sort-descending)');

  await expect(ordenarCrescente).toBeVisible({ timeout: 5_000 });
  await expect.poll(() => ordensConsultadas.at(-1)).toBe('desc');

  await ordenarCrescente.click();

  await expect(main.locator('button:has(.mdi-sort-ascending)')).toBeVisible();
  await expect.poll(() => ordensConsultadas.at(-1)).toBe('asc');
});

test('não exibe o seletor de ícones de desenvolvimento na página inicial', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  await expect(page).toHaveURL('/');

  await expect(page.locator('.v-main')).not.toContainText('Ícone', { timeout: 5_000 });
  await expect(page.locator('.v-main input')).toHaveCount(0, { timeout: 5_000 });
});

test('abre o formulário de usuário pelo drawer e mantém o campo interativo', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (pMessage) => {
    if (pMessage.type() === 'error') consoleErrors.push(pMessage.text());
  });
  page.on('pageerror', (pError) => consoleErrors.push(pError.message));

  await page.goto('/admin/usuarios');
  await expect(page.getByText('Usuário E2E')).toBeVisible();

  const main = page.locator('.v-main');
  await main.locator('button:has(.mdi-menu-open)').hover();
  await main.locator('button:has(.mdi-plus)').click();

  const dialog = page.getByRole('dialog');
  const nomeUsuario = dialog.getByRole('textbox', { name: /Nome de usuário|Username/ });

  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: /Salvar|Save/ })).toBeDisabled();
  await nomeUsuario.fill('Usuário em edição E2E');
  await expect(nomeUsuario).toHaveValue('Usuário em edição E2E');
  await expect(dialog.getByRole('button', { name: /Salvar|Save/ })).toBeDisabled();
  expect(consoleErrors).toEqual([]);
});

test('mantém o formulário de usuário montado para editar um registro da lista', async ({ page }) => {
  await page.goto('/admin/usuarios');
  await expect(page.getByText('Usuário E2E')).toBeVisible();

  const linhaUsuario = page.locator('.v-list-item').filter({ hasText: 'Usuário E2E' }).first();
  await linhaUsuario.locator('button:has(.mdi-pencil)').click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('textbox', { name: /Nome de usuário|Username/ })).toHaveValue('Usuário E2E');
});

test('abre o formulário de cargo pelo drawer e mantém o campo interativo', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (pMessage) => {
    if (pMessage.type() === 'error') consoleErrors.push(pMessage.text());
  });
  page.on('pageerror', (pError) => consoleErrors.push(pError.message));

  await page.goto('/admin/rbac');
  await expect(page.getByText(/Todos os cargos foram carregados|All roles have been loaded/)).toBeVisible();

  const main = page.locator('.v-main');
  await main.locator('button:has(.mdi-menu-open)').hover();
  await main.locator('button:has(.mdi-plus)').click();

  const dialog = page.getByRole('dialog');
  const nomeCargo = dialog.getByRole('textbox', { name: /Nome do cargo|Role name/ });

  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: /Salvar|Save/ })).toBeDisabled();
  await nomeCargo.fill('Cargo temporário E2E');
  await expect(nomeCargo).toHaveValue('Cargo temporário E2E');
  expect(consoleErrors).toEqual([]);
});

test('fecha o formulário de cargo e encerra o loading após salvar', async ({ page }) => {
  await page.goto('/admin/rbac');
  await expect(page.getByText(/Todos os cargos foram carregados|All roles have been loaded/)).toBeVisible();

  const main = page.locator('.v-main');
  await main.locator('button:has(.mdi-menu-open)').hover();
  await main.locator('button:has(.mdi-plus)').click();

  const dialog = page.getByRole('dialog');
  await dialog.getByRole('textbox', { name: /Nome do cargo|Role name/ }).fill('Cargo salvo E2E');
  const salvar = dialog.getByRole('button', { name: /Salvar|Save/ });
  await expect(salvar).toBeEnabled();
  await salvar.click();
  await expect(dialog).toBeHidden();
  await expect(main.getByText('Cargo salvo E2E')).toBeVisible();

  await page.reload();
  await expect(page.getByText('Cargo salvo E2E')).toBeVisible();

  await main.locator('button:has(.mdi-menu-open)').hover();
  await main.locator('button:has(.mdi-plus)').click();
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: /Salvar|Save/ }).locator('.v-progress-circular')).toHaveCount(0);
});

test('mantém o tema escolhido após recarregar sem depender da abertura do drawer', async ({ page }) => {
  await page.goto('/admin/usuarios');
  await expect(page.getByText('Usuário E2E')).toBeVisible();

  const app = page.locator('.v-application');
  const drawerOpcoes = page.locator('header button:has(.mdi-menu-open)').first();

  await expect(app).toHaveClass(/v-theme--dark/);
  await drawerOpcoes.hover();
  await page.locator('header button:has(.mdi-weather-sunny)').click();
  await expect(app).toHaveClass(/v-theme--light/);

  await page.reload();
  await expect(page.getByText('Usuário E2E')).toBeVisible();
  await expect(app).toHaveClass(/v-theme--light/, { timeout: 5_000 });
});

test('mantém contraste AA nos títulos primários do tema escuro', async ({ page }) => {
  await page.goto('/admin/rbac');
  await expect(page.getByText(/Todos os cargos foram carregados|All roles have been loaded/)).toBeVisible();

  const taxaContraste = await page.locator('.v-list-item-title.text-primary').first().evaluate((pElemento) => {
    function converterCor(pValor: string): [number, number, number, number] {
      const corSrgb = pValor.match(
        /color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)/,
      );
      if (corSrgb) {
        return [
          Number(corSrgb[1]) * 255,
          Number(corSrgb[2]) * 255,
          Number(corSrgb[3]) * 255,
          corSrgb[4] ? Number(corSrgb[4]) : 1,
        ];
      }

      const corRgb = pValor.match(/rgba?\(([^)]+)\)/);
      if (!corRgb) return [0, 0, 0, 0];

      const partes = corRgb[1].split(/[\s,/]+/).filter(Boolean).map(Number);
      return [partes[0], partes[1], partes[2], partes.length > 3 ? partes[3] : 1];
    }

    function combinarCores(
      pFrente: [number, number, number, number],
      pFundo: [number, number, number, number],
    ): [number, number, number, number] {
      const alfa = pFrente[3] + pFundo[3] * (1 - pFrente[3]);
      return [
        (pFrente[0] * pFrente[3] + pFundo[0] * pFundo[3] * (1 - pFrente[3])) / alfa,
        (pFrente[1] * pFrente[3] + pFundo[1] * pFundo[3] * (1 - pFrente[3])) / alfa,
        (pFrente[2] * pFrente[3] + pFundo[2] * pFundo[3] * (1 - pFrente[3])) / alfa,
        alfa,
      ];
    }

    function calcularLuminancia(pCor: [number, number, number, number]): number {
      const canais = pCor.slice(0, 3).map((pCanal) => {
        const canalNormalizado = pCanal / 255;
        return canalNormalizado <= 0.04045
          ? canalNormalizado / 12.92
          : ((canalNormalizado + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * canais[0] + 0.7152 * canais[1] + 0.0722 * canais[2];
    }

    const camadasFundo: [number, number, number, number][] = [];
    for (let elementoAtual: Element | null = pElemento; elementoAtual; elementoAtual = elementoAtual.parentElement) {
      camadasFundo.push(converterCor(getComputedStyle(elementoAtual).backgroundColor));
    }

    let corFundo: [number, number, number, number] = [255, 255, 255, 1];
    camadasFundo.reverse().forEach((pCamada) => {
      corFundo = combinarCores(pCamada, corFundo);
    });

    const corTexto = combinarCores(converterCor(getComputedStyle(pElemento).color), corFundo);
    const luminanciaTexto = calcularLuminancia(corTexto);
    const luminanciaFundo = calcularLuminancia(corFundo);

    return (Math.max(luminanciaTexto, luminanciaFundo) + 0.05) /
      (Math.min(luminanciaTexto, luminanciaFundo) + 0.05);
  });

  expect(taxaContraste).toBeGreaterThanOrEqual(4.5);
});

test('mantém navegação, idiomas e abas de informações interativos', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (pMessage) => {
    if (pMessage.type() === 'error') consoleErrors.push(pMessage.text());
  });
  page.on('pageerror', (pError) => consoleErrors.push(pError.message));

  await page.goto('/admin/usuarios');
  await expect(page.getByText('Usuário E2E')).toBeVisible();
  const navigationDrawer = page.locator('.v-navigation-drawer');
  const navigationTrigger = page.locator('header .v-app-bar-nav-icon');

  await expect(navigationDrawer).toHaveClass(/v-navigation-drawer--active/);
  await navigationTrigger.click();
  await expect(navigationDrawer).not.toHaveClass(/v-navigation-drawer--active/);
  await navigationTrigger.click();
  await expect(navigationDrawer).toHaveClass(/v-navigation-drawer--active/);

  const drawerOpcoes = page.locator('header button:has(.mdi-menu-open)');
  await drawerOpcoes.hover();
  await page.locator('header button:has(.mdi-translate)').click();
  await expect(page.getByText('Português (BR)')).toBeVisible();
  await expect(page.getByText('English (US)')).toBeVisible();
  await expect(page.getByText('Español (ES)')).toBeVisible();
  await page.keyboard.press('Escape');

  await page.goto('/info-sistema');
  const abaVersoes = page.getByRole('tab', { name: /Versões|Versions/ });
  const abaGeral = page.getByRole('tab', { name: /Geral|General/ });
  await abaVersoes.click();
  await expect(abaVersoes).toHaveAttribute('aria-selected', 'true');
  await abaGeral.click();
  await expect(abaGeral).toHaveAttribute('aria-selected', 'true');

  expect(consoleErrors).toEqual([]);
});

test('mantém o diálogo de licença montado ao sair do drawer de ações', async ({ page }) => {
  const problemasConsole = monitorarProblemasConsole(page);

  await page.goto('/admin/usuarios', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('Usuário E2E')).toBeVisible();

  const drawerOpcoes = page.locator('header button:has(.mdi-menu-open)').first();
  await drawerOpcoes.hover();
  await page.locator('header button:has(.mdi-license)').click();
  await page.waitForTimeout(500);
  expect(problemasConsole).toEqual([]);

  const dialogo = page.getByRole('dialog');
  await expect(dialogo).toBeVisible({ timeout: 5_000 });

  await page.mouse.move(100, 400);
  await expect(dialogo).toBeVisible();
  await dialogo.getByRole('button', { name: /^(Fechar|Close)$/ }).click();
  await expect(dialogo).toBeHidden();
  expect(problemasConsole).toEqual([]);
});

test('edita um filtro numérico sem atualizações recursivas ou avisos de renderização', async ({ page }) => {
  const problemasConsole = monitorarProblemasConsole(page);

  await page.goto('/admin/usuarios', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('Usuário E2E')).toBeVisible();

  await page.locator('header button:has(.mdi-filter-cog)').click();
  const dialogo = page.getByRole('dialog');
  await expect(dialogo).toBeVisible();

  await dialogo.locator('.v-list-item').filter({ hasText: /^(Código|Code)$/ }).first().click();
  await page.waitForTimeout(500);
  expect(problemasConsole).toEqual([]);
  const entradaNumerica = dialogo.getByRole('spinbutton');
  await expect(entradaNumerica).toBeVisible({ timeout: 5_000 });
  await entradaNumerica.fill('42');
  await expect(entradaNumerica).toHaveValue('42');

  await dialogo.locator('button:has(.mdi-close)').click();
  await expect(dialogo).toBeHidden();
  expect(problemasConsole).toEqual([]);
});

test('usa scrim translúcido claro no overlay do tema light', async ({ page }) => {
  await page.goto('/admin/usuarios');
  await expect(page.getByText('Usuário E2E')).toBeVisible();

  const drawerOpcoes = page.locator('header button:has(.mdi-menu-open)').first();
  await drawerOpcoes.hover();
  await page.locator('header button:has(.mdi-weather-sunny)').click();
  await expect(page.locator('.v-application')).toHaveClass(/v-theme--light/);

  await page.route('**/actuator/health-check/public', async (pRota) => {
    await new Promise((pResolve) => setTimeout(pResolve, 2_000));
    await pRota.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status: 'UP', components: {} }),
    });
  });

  await page.reload({ waitUntil: 'domcontentloaded' });
  const scrim = page.locator('.v-overlay--active .v-overlay__scrim');
  await expect(scrim).toBeVisible();

  const estilo = await scrim.evaluate((pElemento) => {
    const calculado = getComputedStyle(pElemento);
    return { backgroundColor: calculado.backgroundColor, opacity: Number(calculado.opacity) };
  });

  expect(estilo.backgroundColor).toMatch(/rgb\(255, 255, 255\)|rgb\(250, 250, 250\)/);
  expect(estilo.opacity).toBeGreaterThan(0);
  expect(estilo.opacity).toBeLessThan(0.5);
});

test('renderiza radial e restaura preferências do gráfico por usuário e recurso', async ({ page }) => {
  const problemasConsole = monitorarProblemasConsole(page);

  await page.goto('/admin/usuarios', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('Usuário E2E')).toBeVisible();

  const main = page.locator('.v-main');
  await main.locator('button:has(.mdi-menu-open)').hover();
  await main.locator('button:has(.mdi-chart-pie)').click();

  const chartCard = main.locator('.v-card').filter({ has: page.locator('button:has(.mdi-tune)') }).last();
  await expect(chartCard).toBeVisible();
  await chartCard.locator('button:has(.mdi-tune)').click();

  const menu = page.locator('.v-overlay--active .v-list').filter({ hasText: /Group by|Agrupar por/ });
  const opcaoCargo = menu.locator('.v-list-item').filter({ hasText: /^(Cargo|Role)$/ });
  await opcaoCargo.click();

  const opcaoRadial = menu.locator('.v-list-item').filter({ hasText: /^(Radial|Radial bar)$/i });
  await opcaoRadial.click();

  const switches = menu.getByRole('checkbox');
  await expect(switches).toHaveCount(2);
  for (let indice = 0; indice < 2; indice += 1) {
    if (await switches.nth(indice).isChecked()) await switches.nth(indice).click();
  }

  const arcoRadial = chartCard.locator('.apexcharts-radialbar-area').first();
  await expect(arcoRadial).toBeVisible();
  const comprimentoArco = await arcoRadial.evaluate((pElemento) =>
    (pElemento as SVGGeometryElement).getTotalLength(),
  );
  expect(comprimentoArco).toBeGreaterThan(50);

  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.getByText('Usuário E2E')).toBeVisible();

  const chartRestaurado = page.locator('.v-main .v-card').filter({ has: page.locator('button:has(.mdi-tune)') }).last();
  await expect(chartRestaurado).toBeVisible();
  await chartRestaurado.locator('button:has(.mdi-tune)').click();

  const menuRestaurado = page.locator('.v-overlay--active .v-list').filter({ hasText: /Group by|Agrupar por/ });
  await expect(menuRestaurado.locator('.v-list-item').filter({ hasText: /^(Cargo|Role)$/ })).toHaveClass(
    /v-list-item--active/,
  );
  await expect(menuRestaurado.locator('.v-list-item').filter({ hasText: /^(Radial|Radial bar)$/i })).toHaveClass(
    /v-list-item--active/,
  );
  await expect(menuRestaurado.getByRole('checkbox').nth(0)).not.toBeChecked();
  await expect(menuRestaurado.getByRole('checkbox').nth(1)).not.toBeChecked();
  expect(problemasConsole).toEqual([]);
});

test('pesquisa usuário não vinculado e o vincula rapidamente ao cargo aberto', async ({ page }) => {
  const problemasConsole = monitorarProblemasConsole(page);

  await page.goto('/admin/rbac', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText(/Todos os cargos foram carregados|All roles have been loaded/)).toBeVisible();

  const linhaCargo = page.locator('.v-list-item').filter({ hasText: 'Administrador' }).first();
  await linhaCargo.locator('button:has(.mdi-pencil)').click();

  const dialogo = page.getByRole('dialog');
  await expect(dialogo).toBeVisible();
  await dialogo.getByRole('tab', { name: /Usuários|Users/ }).click();

  const pesquisa = dialogo.getByRole('textbox', { name: /Pesquisar usuários|Search users/ });
  await pesquisa.fill('disponível');
  const usuarioEncontrado = dialogo.locator('.v-list-item').filter({ hasText: 'Usuário disponível E2E' });
  await expect(usuarioEncontrado).toBeVisible();

  await usuarioEncontrado.getByRole('button', { name: /Vincular.*Administrador|Link.*Administrador/i }).click();
  await expect(usuarioEncontrado).toContainText(/Alteração pendente|Pending change/);
  expect(problemasConsole).toEqual([]);
});

test('abre os filtros locais da rota inicial do cargo', async ({ page }) => {
  await page.goto('/admin/rbac', { waitUntil: 'commit' });
  await expect(page.getByText(/Todos os cargos foram carregados|All roles have been loaded/)).toBeVisible();

  const linhaCargo = page.locator('.v-list-item').filter({ hasText: 'Administrador' }).first();
  await linhaCargo.locator('button:has(.mdi-pencil)').click();

  const dialogoCargo = page.getByRole('dialog');
  await dialogoCargo.getByRole('combobox', { name: /Rota inicial após login|Initial route after login/ }).click();
  await page.getByRole('option', { name: /\/admin\/usuarios/ }).click();

  await dialogoCargo.locator('button:has(.mdi-filter-cog-outline)').click();
  await expect(page.getByRole('dialog')).toHaveCount(2);
});

test('centraliza ícone grande e mantém o título no rodapé do cartão', async ({ page }) => {
  await page.goto('/admin/rbac', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText(/Todos os cargos foram carregados|All roles have been loaded/)).toBeVisible();

  const main = page.locator('.v-main');
  await main.locator('button:has(.mdi-menu-open)').hover();
  await main.locator('button:has(.mdi-plus)').click();

  const formularioCargo = page.getByRole('dialog');
  await formularioCargo.getByRole('textbox', { name: /Ícone|Icon/ }).click();

  const seletor = page.getByRole('dialog').last();
  const card = seletor.locator('.grade-icones-material-design__card').first();
  await expect(card).toBeVisible();

  const medidas = await card.evaluate((pElemento) => {
    const icone = pElemento.querySelector('.v-icon') as HTMLElement;
    const rodape = pElemento.querySelector('.grade-icones-material-design__rodape') as HTMLElement | null;
    const cardRect = pElemento.getBoundingClientRect();
    const iconRect = icone.getBoundingClientRect();
    const footerRect = rodape?.getBoundingClientRect();
    return {
      iconSize: Math.min(iconRect.width, iconRect.height),
      iconCenterDelta: Math.abs(iconRect.left + iconRect.width / 2 - (cardRect.left + cardRect.width / 2)),
      footerTop: footerRect?.top ?? 0,
      cardMiddle: cardRect.top + cardRect.height / 2,
    };
  });

  expect(medidas.iconSize).toBeGreaterThanOrEqual(56);
  expect(medidas.iconCenterDelta).toBeLessThanOrEqual(2);
  expect(medidas.footerTop).toBeGreaterThan(medidas.cardMiddle);
});

test('traduz integralmente os fluxos de licença, filtros e abas RBAC para inglês', async ({ page }) => {
  const problemasConsole = monitorarProblemasConsole(page);

  await page.goto('/admin/usuarios', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('Usuário E2E')).toBeVisible();

  const drawerOpcoes = page.locator('header button:has(.mdi-menu-open)').first();
  await drawerOpcoes.hover();
  await page.locator('header button:has(.mdi-translate)').click();
  await page.getByText('English (US)').click();

  await drawerOpcoes.hover();
  await page.locator('header button:has(.mdi-license)').click();
  const dialogoLicenca = page.getByRole('dialog');
  await expect(dialogoLicenca.getByRole('button', { name: 'Close', exact: true })).toBeVisible();
  await expect(dialogoLicenca).not.toContainText('Fechar');
  await dialogoLicenca.getByRole('button', { name: 'Close', exact: true }).click();

  await page.locator('header button:has(.mdi-filter-cog)').click();
  const dialogoFiltro = page.getByRole('dialog');
  await dialogoFiltro.locator('.v-list-item').filter({ hasText: /^Code$/ }).first().click();
  await expect(dialogoFiltro.getByRole('button', { name: /Add filter/i })).toBeVisible();
  await expect(dialogoFiltro).not.toContainText(/Limpar|Selecione um campo|ADICIONAR FILTRO/);
  await dialogoFiltro.locator('button:has(.mdi-close)').click();

  await page.goto('/admin/rbac');
  const linhaCargo = page.locator('.v-list-item').filter({ hasText: 'Administrador' }).first();
  await linhaCargo.locator('button:has(.mdi-pencil)').click();
  const dialogoCargo = page.getByRole('dialog');
  await expect(dialogoCargo.getByRole('tab', { name: 'Data' })).toBeVisible();
  await expect(dialogoCargo.getByRole('tab', { name: 'Permissions' })).toBeVisible();
  await expect(dialogoCargo.getByRole('tab', { name: 'Users' })).toBeVisible();
  expect(problemasConsole).toEqual([]);
});

test('mantém contraste AA no texto do botão salvar em tema escuro', async ({ page }) => {
  await page.goto('/admin/rbac', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.v-application')).toHaveClass(/v-theme--dark/);

  const main = page.locator('.v-main');
  await main.locator('button:has(.mdi-menu-open)').hover();
  await main.locator('button:has(.mdi-plus)').click();
  const dialogo = page.getByRole('dialog');
  await dialogo.getByRole('textbox', { name: /Nome do cargo|Role name/ }).fill('Contraste E2E');
  const salvar = dialogo.getByRole('button', { name: /Salvar|Save/ });
  await expect(salvar).toBeEnabled();

  const contraste = await salvar.evaluate((pElemento) => {
    const parse = (pValor: string): number[] => pValor.match(/[\d.]+/g)?.map(Number).slice(0, 3) ?? [0, 0, 0];
    const luminancia = (pCor: number[]) => {
      const canais = pCor.map((pCanal) => {
        const normalizado = pCanal / 255;
        return normalizado <= 0.04045 ? normalizado / 12.92 : ((normalizado + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * canais[0] + 0.7152 * canais[1] + 0.0722 * canais[2];
    };
    const estilo = getComputedStyle(pElemento);
    const texto = luminancia(parse(estilo.color));
    const fundo = luminancia(parse(estilo.backgroundColor));
    return (Math.max(texto, fundo) + 0.05) / (Math.min(texto, fundo) + 0.05);
  });

  expect(contraste).toBeGreaterThanOrEqual(4.5);
});

test('mantém tooltip do gráfico visível acima das camadas e dentro da viewport', async ({ page }) => {
  const problemasConsole = monitorarProblemasConsole(page);

  await page.goto('/admin/usuarios', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('Usuário E2E')).toBeVisible();

  const main = page.locator('.v-main');
  await main.locator('button:has(.mdi-menu-open)').hover();
  await main.locator('button:has(.mdi-chart-pie)').click();

  const chartCard = main.locator('.v-card').filter({ has: page.locator('button:has(.mdi-tune)') }).last();
  await expect(chartCard).toBeVisible();
  const segmento = chartCard.locator('.apexcharts-series path').first();
  await expect(segmento).toBeVisible();
  await segmento.hover({ force: true });

  const tooltip = chartCard.locator('.apexcharts-tooltip').first();
  await expect(tooltip).toBeVisible();
  const geometria = await tooltip.evaluate((pElemento) => {
    const rect = pElemento.getBoundingClientRect();
    const zIndex = Number(getComputedStyle(pElemento).zIndex);
    return {
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      zIndex,
    };
  });

  expect(geometria.left).toBeGreaterThanOrEqual(0);
  expect(geometria.top).toBeGreaterThanOrEqual(0);
  expect(geometria.right).toBeLessThanOrEqual(geometria.viewportWidth);
  expect(geometria.bottom).toBeLessThanOrEqual(geometria.viewportHeight);
  expect(geometria.zIndex).toBeGreaterThanOrEqual(20);
  expect(problemasConsole).toEqual([]);
});
