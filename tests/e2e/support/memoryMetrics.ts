import type { Page } from '@playwright/test';

export interface IMemorySample {
  heapBytes: number;
  documents: number;
  nodes: number;
  jsEventListeners: number;
}

export async function collectMemorySample(pPage: Page): Promise<IMemorySample> {
  const session = await pPage.context().newCDPSession(pPage);

  try {
    await session.send('HeapProfiler.collectGarbage');
    const heap = await session.send('Runtime.getHeapUsage');
    const dom = await session.send('Memory.getDOMCounters');

    return {
      heapBytes: heap.usedSize,
      documents: dom.documents,
      nodes: dom.nodes,
      jsEventListeners: dom.jsEventListeners,
    };
  } finally {
    await session.detach();
  }
}
