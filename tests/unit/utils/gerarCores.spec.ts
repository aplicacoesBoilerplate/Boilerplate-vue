import { gerarCores } from '@/utils/gerarCores';

import { describe, expect, it } from 'vitest';

describe('gerarCores', () => {
  it('usa verde para o valor booleano positivo e vermelho para o negativo', () => {
    const cores = gerarCores([
      { valorOriginal: true },
      { valorOriginal: false },
    ]);

    expect(cores).toEqual(['#2E7D32', '#C62828']);
  });

  it('prioriza o mapeamento configurado sobre as cores padrão', () => {
    const cores = gerarCores(
      [{ valorOriginal: true }, { valorOriginal: 'pendente' }],
      { true: '#00AA00', pendente: '#F59E0B' },
    );

    expect(cores).toEqual(['#00AA00', '#F59E0B']);
  });
});
