// Ecossistema Vue
import { computed, type ComputedRef, type Ref } from 'vue';

// Types e Interfaces
import type { ICampoFiltro } from '@/models/filters/ICampoFiltro';
import { ETipoFiltro } from '@/models/filters/enums/ETipoFiltro';
import {
  EOperadoresFiltro,
  MAPEAMENTO_OPERADORES,
  type IMapeamentoOperador,
} from '@/models/filters/enums/EOperadoresFiltro';

// Constantes
const OPERADORES_BOOLEANOS = [
  EOperadoresFiltro.VERDADEIRO,
  EOperadoresFiltro.FALSO,
];

const OPERADORES_SELECAO = [
  EOperadoresFiltro.SELECAO,
  EOperadoresFiltro.EXCECAO,
];

const OPERADORES_NUMERICOS_E_DATA = [
  EOperadoresFiltro.IGUAL,
  EOperadoresFiltro.DIFERENTE,
  EOperadoresFiltro.ENTRE,
  EOperadoresFiltro.MAIOR_QUE,
  EOperadoresFiltro.MAIOR_IGUAL,
  EOperadoresFiltro.MENOR_QUE,
  EOperadoresFiltro.MENOR_IGUAL,
];

const OPERADORES_TEXTO = [
  EOperadoresFiltro.IGUAL,
  EOperadoresFiltro.DIFERENTE,
  EOperadoresFiltro.COMECA_COM,
  EOperadoresFiltro.CONTEM,
  EOperadoresFiltro.NAO_CONTEM,
  EOperadoresFiltro.TERMINA_COM,
];

type TUseOperadoresFiltroParams = {
  campoSelecionado: ComputedRef<ICampoFiltro<unknown> | null> | Ref<ICampoFiltro<unknown> | null>;
};

/**
 * Filtra os operadores disponíveis baseado nos operadores permitidos.
 * @param pOperadoresPermitidos Array de operadores permitidos.
 * @returns Array de operadores disponíveis.
 */
function filtrarOperadores(pOperadoresPermitidos: EOperadoresFiltro[]): IMapeamentoOperador[] {
  const operadoresPermitidos = new Set(pOperadoresPermitidos);

  return MAPEAMENTO_OPERADORES.filter((pOperador) => operadoresPermitidos.has(pOperador.valor));
}

/**
 * Adiciona operadores ao Set de operadores atuais.
 * @param pOperadoresAtuais Set de operadores atuais.
 * @param pOperadoresPermitidos Array de operadores a serem adicionados.
 */
function adicionarOperadores(pOperadoresAtuais: Set<EOperadoresFiltro>, pOperadoresPermitidos: EOperadoresFiltro[]): void {
  pOperadoresPermitidos.forEach((pOperador) => pOperadoresAtuais.add(pOperador));
}

/**
 * Responsável por montar a lista de operadores válidos baseado no tipo do campo selecionado.
 */
export function useOperadoresFiltro(pParams: TUseOperadoresFiltroParams) {
  const tiposCampoAtual = computed<ETipoFiltro[]>(() => pParams.campoSelecionado.value?.tipos ?? []);

  const operadoresDisponiveis = computed<IMapeamentoOperador[]>(() => {
    const campoSelecionado = pParams.campoSelecionado.value;

    // Usa Set para evitar duplicidade
    const operadores = new Set<EOperadoresFiltro>();

    if (!campoSelecionado) {
      return [];
    }

    if (campoSelecionado.operadores && campoSelecionado.operadores.length > 0) {
      return filtrarOperadores(campoSelecionado.operadores);
    }

    const tipos = tiposCampoAtual.value;

    if (tipos.includes(ETipoFiltro.BOOLEAN)) {
      return filtrarOperadores(OPERADORES_BOOLEANOS);
    }

    if (tipos.includes(ETipoFiltro.SELECT)) {
      adicionarOperadores(operadores, OPERADORES_SELECAO);
    }

    if (tipos.includes(ETipoFiltro.NUMBER) || tipos.includes(ETipoFiltro.DATE)) {
      adicionarOperadores(operadores, OPERADORES_NUMERICOS_E_DATA);
    }

    if (tipos.includes(ETipoFiltro.STRING)) {
      adicionarOperadores(operadores, OPERADORES_TEXTO);
    }

    // Filtra a lista de operadores baseada nos operadores permitidos
    return filtrarOperadores([...operadores]);
  });

  return {
    operadoresDisponiveis,
    tiposCampoAtual,
  };
}
