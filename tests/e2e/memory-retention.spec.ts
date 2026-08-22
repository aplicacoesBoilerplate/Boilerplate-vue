import { expect, test } from '@playwright/test';

import { collectMemorySample, type IMemorySample } from './support/memoryMetrics';
import { mockAuthenticatedApi } from './support/mockAuthenticatedApi';

function average(pValues: number[]): number {
  return pValues.reduce((pTotal, pValue) => pTotal + pValue, 0) / pValues.length;
}

function increasesOnEverySample(
  pSamples: IMemorySample[],
  pSelector: (pSample: IMemorySample) => number,
): boolean {
  return pSamples.slice(1).every((pSample, pIndex) => pSelector(pSample) > pSelector(pSamples[pIndex]));
}

test('nao retem heap, documentos ou listeners apos navegacao repetida', async ({ page }) => {
  await mockAuthenticatedApi(page);
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const usersLink = page.locator('a[href="/admin/usuarios"]').first();
  const homeLink = page.locator('a[href="/"]').first();

  async function runNavigationCycle(): Promise<void> {
    await usersLink.dispatchEvent('click');
    await expect(page).toHaveURL(/\/admin\/usuarios$/);
    await expect(page.getByText('Usuário E2E')).toBeVisible();
    await homeLink.dispatchEvent('click');
    await expect(page).toHaveURL(/\/$/);
  }

  for (let warmup = 0; warmup < 5; warmup += 1) {
    await runNavigationCycle();
  }

  const samples: IMemorySample[] = [];
  for (let cycle = 0; cycle < 20; cycle += 1) {
    await runNavigationCycle();
    samples.push(await collectMemorySample(page));
  }

  const initialAverage = average(samples.slice(0, 5).map((pSample) => pSample.heapBytes));
  const finalAverage = average(samples.slice(15, 20).map((pSample) => pSample.heapBytes));
  const growthBytes = finalAverage - initialAverage;
  const first = samples[0];
  const last = samples.at(-1)!;
  const finalTen = samples.slice(-10);

  expect(growthBytes > 5 * 1024 * 1024 && growthBytes / initialAverage > 0.1).toBe(false);
  expect(last.documents).toBeLessThanOrEqual(first.documents + 1);
  expect(last.jsEventListeners).toBeLessThanOrEqual(first.jsEventListeners + 2);
  expect(increasesOnEverySample(finalTen, (pSample) => pSample.nodes)).toBe(false);
  expect(increasesOnEverySample(finalTen, (pSample) => pSample.jsEventListeners)).toBe(false);
});
