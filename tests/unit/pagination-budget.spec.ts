import type { IConsultaRegistros, IRespostaConsultaRegistros } from '@/models/consulta/IConsultaRegistros';

import { assertExportWithinBudget } from '@/composables/useExportacaoDados';

import { CBaseConsultaApiService } from '@/services/base/CBaseConsultaApiService';

import { describe, expect, it, vi } from 'vitest';

type TRecord = { id: number; payload?: string };

class CTestService extends CBaseConsultaApiService<TRecord> {
  constructor(private readonly pages: IRespostaConsultaRegistros<TRecord>[]) {
    super('/test');
  }

  override consultar = vi.fn(
    async (pParameters?: Partial<IConsultaRegistros<TRecord>>, pSignal?: AbortSignal) => {
      void pParameters;
      void pSignal;
      return (
      this.pages.shift() ?? {
        registros: [],
        filtros: [],
        limite: 100,
        ordenacao: 'asc' as const,
        proximaEntrada: 'terminal',
        possuiMais: false,
      }
      );
    },
  );
}

function page(pRecords: TRecord[], pCursor: unknown, pHasMore: boolean): IRespostaConsultaRegistros<TRecord> {
  return {
    registros: pRecords,
    filtros: [],
    limite: 100,
    ordenacao: 'asc',
    proximaEntrada: pCursor,
    possuiMais: pHasMore,
  };
}

describe('bulk pagination budgets', () => {
  it('rejects a repeated continuation cursor', async () => {
    const service = new CTestService([
      page([{ id: 1 }], 'same', true),
      page([{ id: 2 }], 'same', true),
      page([], 'end', false),
    ]);

    await expect(service.consultarTodosRegistros()).rejects.toThrow(/cursor/i);
    expect(service.consultar).toHaveBeenCalledTimes(2);
  });

  it('rejects an empty page that still claims continuation', async () => {
    const service = new CTestService([page([], 'next', true), page([], 'end', false)]);

    await expect(service.consultarTodosRegistros()).rejects.toThrow(/vazia/i);
    expect(service.consultar).toHaveBeenCalledTimes(1);
  });

  it('stops at the configured page and record budgets', async () => {
    const pageLimited = new CTestService([
      page([{ id: 1 }], '1', true),
      page([{ id: 2 }], '2', true),
      page([], 'end', false),
    ]);
    await expect(pageLimited.consultarTodosRegistros({}, { maxPages: 2 })).rejects.toThrow(/paginas/i);
    expect(pageLimited.consultar).toHaveBeenCalledTimes(2);

    const recordLimited = new CTestService([page([{ id: 1 }, { id: 2 }], 'end', false)]);
    await expect(recordLimited.consultarTodosRegistros({}, { maxRecords: 1 })).rejects.toThrow(/registros/i);
  });

  it('honours cancellation before retaining partial records', async () => {
    const controller = new AbortController();
    controller.abort();
    const service = new CTestService([page([{ id: 1 }], 'end', false)]);

    await expect(service.consultarTodosRegistros({}, { signal: controller.signal })).rejects.toMatchObject({
      name: 'AbortError',
    });
    expect(service.consultar).not.toHaveBeenCalled();
  });

  it('actively aborts an in-flight page when the time budget expires', async () => {
    vi.useFakeTimers();
    const service = new CTestService([]);
    service.consultar = vi.fn(
      async (pParameters?: Partial<IConsultaRegistros<TRecord>>, pSignal?: AbortSignal) =>
        new Promise<IRespostaConsultaRegistros<TRecord>>((pResolve, pReject) => {
          void pParameters;
          void pResolve;
          pSignal?.addEventListener('abort', () => pReject(pSignal.reason), { once: true });
        }),
    );

    const request = service.consultarTodosRegistros({}, { timeoutMs: 25 });
    const assertion = expect(request).rejects.toMatchObject({ name: 'TimeoutError' });
    await vi.advanceTimersByTimeAsync(25);

    await assertion;
    expect(service.consultar).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});

describe('export generation budgets', () => {
  it('rejects oversized record collections before document generation', () => {
    expect(() => assertExportWithinBudget([{ id: 1 }, { id: 2 }], { maxRecords: 1 })).toThrow(/exportacao/i);
  });

  it('rejects cancellation and estimated byte overflow', () => {
    const controller = new AbortController();
    controller.abort();
    expect(() => assertExportWithinBudget([{ id: 1 }], { signal: controller.signal })).toThrowError(
      expect.objectContaining({ name: 'AbortError' }),
    );
    expect(() =>
      assertExportWithinBudget([{ id: 1, payload: 'large' }], { maxEstimatedBytes: 1 }),
    ).toThrow(/bytes/i);
  });
});
