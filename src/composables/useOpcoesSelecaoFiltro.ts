// Ecossistema Vue
import { computed, type ComputedRef, type Ref } from 'vue';

// Types e Interfaces
import type { ICampoFiltro, IOpcaoFiltro } from '@/models/filters/ICampoFiltro';
import type { IOpcaoSelecaoFiltro } from '@/models/filters/IOpcaoSelecaoFiltro';

type TRegistroFiltro = object;

type TUseOpcoesSelecaoFiltroParams = {
  campoSelecionado: ComputedRef<ICampoFiltro<unknown> | null> | Ref<ICampoFiltro<unknown> | null>;
  registros: ComputedRef<TRegistroFiltro[]> | Ref<TRegistroFiltro[]>;
};

function montarOpcaoMapeada(pOpcao: IOpcaoFiltro): IOpcaoSelecaoFiltro {
  return {
    title: pOpcao.descricao,
    value: pOpcao.valor,
  };
}

function normalizarTituloOpcao(pValor: unknown): string {
  if (pValor === '') {
    return '(Vazio)';
  }

  return String(pValor);
}

function compararOpcoes(pPrimeiraOpcao: IOpcaoSelecaoFiltro, pSegundaOpcao: IOpcaoSelecaoFiltro): number {
  if (typeof pPrimeiraOpcao.value === 'number' && typeof pSegundaOpcao.value === 'number') {
    return pPrimeiraOpcao.value - pSegundaOpcao.value;
  }

  return pPrimeiraOpcao.title.localeCompare(pSegundaOpcao.title);
}

/**
 * Centraliza a montagem das opções usadas por operadores de seleção.
 */
export function useOpcoesSelecaoFiltro(pParams: TUseOpcoesSelecaoFiltroParams): {
  opcoesSelecaoValoresDoCampo: ComputedRef<IOpcaoSelecaoFiltro[]>;
} {
  const opcoesSelecaoValoresDoCampo = computed<IOpcaoSelecaoFiltro[]>(() => {
    const campoSelecionado = pParams.campoSelecionado.value;

    if (!campoSelecionado) {
      return [];
    }

    if (campoSelecionado.opcoes && campoSelecionado.opcoes.length > 0) {
      return campoSelecionado.opcoes.map(montarOpcaoMapeada);
    }

    if (pParams.registros.value.length === 0) {
      return [];
    }

    const campoChave = String(campoSelecionado.valor);
    const valoresNaoNulos = pParams.registros.value
      .map((pRegistro) => (pRegistro as Record<string, unknown>)[campoChave])
      .filter((pValor) => pValor !== null && pValor !== undefined);

    const valoresUnicos = [...new Set(valoresNaoNulos)];

    return valoresUnicos
      .map((pValor) => ({
        title: normalizarTituloOpcao(pValor),
        value: pValor,
      }))
      .sort(compararOpcoes);
  });

  return {
    opcoesSelecaoValoresDoCampo,
  };
}
