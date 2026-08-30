import {
  CABECALHOS_TABELA_RBAC,
  criarCargoRbacPadrao,
  funcionalidadeEstaLiberada,
} from '@/models/model/core/rbac/rbac.model';

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

  it('migra a permissão legada de gestão de registros para funcionalidade', () => {
    const cargo = criarCargoRbacPadrao({
      permissoes: [{ recurso: 'geral', acao: 'gerenciarRegistros', liberado: true }],
    });

    expect(cargo.permissoes).toEqual([]);
    expect(cargo.funcionalidades).toContainEqual({ funcionalidade: 'gerenciarRegistrosOutros', liberado: true });
  });

  it('libera funcionalidades não configuradas quando o comportamento padrão é liberar', () => {
    const cargo = criarCargoRbacPadrao({ comportamentoPadrao: 'liberar' });

    expect(funcionalidadeEstaLiberada(cargo, 'gerenciarRegistrosOutros')).toBe(true);
  });
});
