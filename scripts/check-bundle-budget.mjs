/* eslint-disable no-console -- Script CLI precisa relatar medicao e falhas ao pipeline. */
import { readdir, readFile, rename, stat, writeFile } from 'node:fs/promises';
import { dirname, extname, join, resolve } from 'node:path';

const root = process.cwd();
const assetsDirectory = resolve(root, 'dist/assets');
const budgetFile = resolve(root, 'config/bundle-budget.json');
const writeBaseline = process.argv.includes('--write-baseline');

async function listFiles(pDirectory) {
  const entries = await readdir(pDirectory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (pEntry) => {
      const path = join(pDirectory, pEntry.name);
      return pEntry.isDirectory() ? listFiles(path) : [path];
    }),
  );
  return nested.flat();
}

async function measureBundle() {
  const files = await listFiles(assetsDirectory);
  const measured = {
    totalJsBytes: 0,
    largestJsChunkBytes: 0,
    totalCssBytes: 0,
  };

  for (const file of files) {
    const size = (await stat(file)).size;
    if (extname(file) === '.js') {
      measured.totalJsBytes += size;
      measured.largestJsChunkBytes = Math.max(measured.largestJsChunkBytes, size);
    } else if (extname(file) === '.css') {
      measured.totalCssBytes += size;
    }
  }

  return measured;
}

function validatePositiveValues(pValues, pLabel) {
  for (const [metric, value] of Object.entries(pValues)) {
    if (!Number.isFinite(value) || value <= 0) {
      throw new Error(`${pLabel} invalido: ${metric} precisa ser maior que zero.`);
    }
  }
}

const measured = await measureBundle();
validatePositiveValues(measured, 'Bundle medido');

if (writeBaseline) {
  const budget = Object.fromEntries(
    Object.entries(measured).map(([pMetric, pValue]) => [pMetric, Math.ceil(pValue * 1.1)]),
  );
  const temporaryFile = join(dirname(budgetFile), `.bundle-budget.${process.pid}.tmp`);
  await writeFile(temporaryFile, `${JSON.stringify(budget, null, 2)}\n`, 'utf8');
  await rename(temporaryFile, budgetFile);
  console.log('Orcamento de bundle atualizado.', { measured, budget });
  process.exit(0);
}

const budget = JSON.parse(await readFile(budgetFile, 'utf8'));
validatePositiveValues(budget, 'Orcamento de bundle');

const exceeded = Object.entries(measured).filter(([pMetric, pValue]) => pValue > budget[pMetric]);
if (exceeded.length > 0) {
  for (const [metric, value] of exceeded) {
    console.error(`${metric}: ${value} bytes excede o limite de ${budget[metric]} bytes.`);
  }
  process.exit(1);
}

console.log('Bundle dentro do orcamento.', { measured, budget });
