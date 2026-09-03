import { expect, type Page, test } from '@playwright/test';

function monitorarConsole(pPage: Page): string[] {
  const problemas: string[] = [];

  pPage.on('console', (pMessage) => {
    const mensagem = pMessage.text();
    const avisoDoAmbienteDeTeste = mensagem.includes('Service Worker registration blocked by Playwright');
    if ((pMessage.type() === 'error' || pMessage.type() === 'warning') && !avisoDoAmbienteDeTeste) {
      problemas.push(mensagem);
    }
  });
  pPage.on('pageerror', (pError) => problemas.push(pError.message));

  return problemas;
}

async function esperarAplicacaoPublica(pPage: Page): Promise<void> {
  await pPage.route('**/api/v1/actuator/health-check/public', async (pRoute) => {
    await pRoute.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status: 'UP', components: {} }),
    });
  });
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('user_locale', JSON.stringify('pt-BR'));
  });
  await esperarAplicacaoPublica(page);
});

test('mantém login válido e não oferece auto-provisionamento público', async ({ page }) => {
  const problemasConsole = monitorarConsole(page);

  await page.goto('/login');
  await expect(page.getByText('Acessar sistema')).toBeVisible();

  const painelAtivo = page.locator('.v-window-item--active');
  const camposLogin = painelAtivo.locator('input');
  const botaoEntrar = painelAtivo.getByRole('button', { name: 'Entrar' });

  await expect(camposLogin).toHaveCount(2);
  await expect(botaoEntrar).toBeDisabled();
  await camposLogin.nth(0).fill('e2e@boilerplate.local');
  await camposLogin.nth(1).fill('Boilerplate@123');
  await expect(botaoEntrar).toBeEnabled();

  await painelAtivo.locator('button:has(.mdi-eye-off)').click();
  await expect(camposLogin.nth(1)).toHaveAttribute('type', 'text');

  await expect(page.getByRole('tab', { name: 'Registro' })).toHaveCount(0);
  await expect(page.getByText('Solicitar acesso')).toHaveCount(0);

  const possuiOverflowHorizontal = await page.evaluate(() => document.body.scrollWidth > document.body.clientWidth);
  expect(possuiOverflowHorizontal).toBe(false);
  expect(problemasConsole).toEqual([]);
});

test('mantém recuperação de senha responsiva sem submeter dados', async ({ page }) => {
  const problemasConsole = monitorarConsole(page);
  await page.setViewportSize({ width: 390, height: 844 });

  await page.goto('/login');
  await page.getByRole('button', { name: 'Esqueci minha senha' }).click();
  await expect(page).toHaveURL('/recuperacao-senha');

  const campoEmail = page.locator('input').first();
  const botaoEnviarCodigo = page.locator('button:has(.mdi-send-outline)');

  await expect(botaoEnviarCodigo).toBeDisabled();
  await campoEmail.fill('recuperacao.e2e@boilerplate.local');
  await expect(botaoEnviarCodigo).toBeEnabled();

  const medidas = await page.evaluate(() => ({
    body: document.body.scrollWidth > document.body.clientWidth,
    document: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  }));
  expect(medidas).toEqual({ body: false, document: false });
  expect(problemasConsole).toEqual([]);
});
