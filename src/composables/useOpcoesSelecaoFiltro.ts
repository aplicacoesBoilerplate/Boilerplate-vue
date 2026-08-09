// Ecossistema Vue
import { computed, type ComputedRef, type Ref } from 'vue';

// Types e Interfaces
import type { IOpcaoSelecao } from '@/models/filters/ICampoFiltro';
import type { TCampoFiltroMapeado } from '@/models/filters/MapeamentoFiltros';

type TRegistroFiltro = object;

type TOpcaoSelecaoVuetify = {
  title: string;
  value: unknown;
};

type TUseOpcoesSelecaoFiltroParams = {
  campoSelecionado: ComputedRef<TCampoFiltroMapeado | null> | Ref<TCampoFiltroMapeado | null>;
  registros: ComputedRef<TRegistroFiltro[]> | Ref<TRegistroFiltro[]>;
};

function montarOpcaoMapeada(pOpcao: IOpcaoSelecao): TOpcaoSelecaoVuetify {
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

function compararOpcoes(pPrimeiraOpcao: TOpcaoSelecaoVuetify, pSegundaOpcao: TOpcaoSelecaoVuetify): number {
  if (typeof pPrimeiraOpcao.value === 'number' && typeof pSegundaOpcao.value === 'number') {
    return pPrimeiraOpcao.value - pSegundaOpcao.value;
  }

  return pPrimeiraOpcao.title.localeCompare(pSegundaOpcao.title);
}

/**
 * Centraliza a montagem das opções usadas por operadores de seleção.
 * @param pParams
 */
export function useOpcoesSelecaoFiltro(pParams: TUseOpcoesSelecaoFiltroParams): {
  opcoesSelecaoValoresDoCampo: ComputedRef<TOpcaoSelecaoVuetify[]>;
} {
  const opcoesSelecaoValoresDoCampo = computed<TOpcaoSelecaoVuetify[]>(() => {
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
