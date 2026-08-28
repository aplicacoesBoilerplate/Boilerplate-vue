import { CABECALHOS_TABELA_RBAC } from '@/models/model/core/rbac/rbac.model';

import { describe, expect, it } from 'vitest';

describe('mapeamento de cargos RBAC', () => {
  it('centraliza as colunas da tabela de cargos no model', () => {
    expect(CABECALHOS_TABELA_RBAC).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'papel', width: 120 }),
        expect.objectContaining({ key: 'descricao', minWidth: 200 }),
        expect.objectContaining({ key: 'permissoes', align: 'center', sortable: false, width: 110 }),
        expect.objectContaining({ key: 'usuarios', align: 'center', sortable: false, width: 100 }),
        expect.objectContaining({ key: 'acoes', align: 'center', sortable: false, minWidth: 180 }),
      ]),
    );
  });
});
