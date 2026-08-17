// Ecossistema Vue
import { computed, ref, toRaw, watch } from 'vue';
import { type LocationQueryRaw, useRoute, useRouter } from 'vue-router';
// Pinia
import { defineStore } from 'pinia';

// Enums
import { EOperadoresFiltro } from '@/models/filters/enums/EOperadoresFiltro';
// Types e Interfaces
import type { TFiltroConsultaSerializado } from '@/models/filters/IFiltrosConsulta';
import type { TCampoFiltroMapeado } from '@/models/filters/MapeamentoFiltros';

import { CTradutor } from '@/classes/Utils/CTradutor';

// Stores
import { useSnackbarStore } from './Snackbar.store';

/**
 * @description Gerencia o estado de filtros aplicados em uma view específica (contexto).
 * @property {IFiltrosConsulta[]} filtrosAplicados - Filtros aplicados no recurso atual.
 * @property {Partial<IFiltrosConsulta>} modeloFiltro - Filtro em construção no formulário.
 * @property {string} pesquisaDrawerLeft - Pesquisa do drawer esquerdo isolada por contexto.
 */
interface IEstadoFiltrosContexto {
  filtrosAplicados: TFiltroConsultaSerializado[];
  modeloFiltro: Partial<TFiltroConsultaSerializado>;
  pesquisaDrawerLeft: string;
}

const STORAGE_PREFIX = 'boilerplate.generic-filter.context.';
const CONTEXTO_FILTRO_PADRAO = 'global';
const CONTEXTO_TEMPORARIO_PREFIX = '__temporario__.';

/**
 * Store responsável por gerenciar os filtros aplicados na view atual.
 * Sincroniza com a URL para manter a persistência dos filtros.
 */
export const useGenericFilterStore = defineStore('genericFilter', () => {
  // Store
  const snackbarStore = useSnackbarStore();

  // Composables
  const router = useRouter();
  const route = useRoute();

  // Reativas
  const estadosPorContexto = ref<Record<string, IEstadoFiltrosContexto>>({});
  const camposDisponiveisTemporarios = ref<TCampoFiltroMapeado[] | null>(null);
  const contextoFiltroTemporario = ref<string | null>(null);
  const versaoAplicacaoFiltros = ref(0);

  /** Controle de abertura/fechamento do Drawer de filtros. */
  const drawerFilterOpen = ref(false);

  /** Campos disponíveis fornecidos pela view atual baseados nos metadados da rota. */
  const camposDisponiveis = computed<TCampoFiltroMapeado[]>(() => {
    if (camposDisponiveisTemporarios.value) {
      return camposDisponiveisTemporarios.value;
    }

    return (route.meta.filterResource as TCampoFiltroMapeado[] | undefined) ?? [];
  });

  /** Campos disponíveis para agrupamento na view atual baseados nos metadados da rota. */
  const camposAgrupadoresDisponiveis = computed(() => {
    return camposDisponiveis.value.filter((pCampo) => pCampo.disponivelAgrupamento);
  });

  const contextoFiltroAtual = computed(() => {
    if (contextoFiltroTemporario.value) {
      return contextoFiltroTemporario.value;
    }

    return String(route.meta.filterContext ?? route.name ?? route.path ?? CONTEXTO_FILTRO_PADRAO);
  });

  const estadoFiltroAtual = computed(() => obterEstadoContexto(contextoFiltroAtual.value));

  /** Array contendo os filtros consolidados e aplicados na view atual. */
  const filtersApplied = computed<TFiltroConsultaSerializado[]>({
    get: () => estadoFiltroAtual.value.filtrosAplicados,
    set: (pFiltros) => {
      estadoFiltroAtual.value.filtrosAplicados = pFiltros;
      persistirContextoAtual();
    },
  });

  /** Filtro em construção no formulário (rascunho). */
  const filterModel = computed<Partial<TFiltroConsultaSerializado>>({
    get: () => estadoFiltroAtual.value.modeloFiltro,
    set: (pFiltro) => {
      estadoFiltroAtual.value.modeloFiltro = pFiltro;
      persistirContextoAtual();
    },
  });

  /** Valor da pesquisa de campos disponível no left drawer. */
  const pesquisaDrawerLeft = computed<string>({
    get: () => estadoFiltroAtual.value.pesquisaDrawerLeft,
    set: (pPesquisa) => {
      estadoFiltroAtual.value.pesquisaDrawerLeft = pPesquisa || '';
      persistirContextoAtual();
    },
  });

  /** Campo selecionado no rascunho atual do filtro. */
  const campoSelecionado = computed<TCampoFiltroMapeado | null>(() => {
    const campoAtual = filterModel.value.campo;

    if (!campoAtual) {
      return null;
    }

    return camposDisponiveis.value.find((pCampo) => pCampo.valor === campoAtual) ?? null;
  });

  // Funções
  function criarEstadoVazio(): IEstadoFiltrosContexto {
    return {
      filtrosAplicados: [],
      modeloFiltro: {},
      pesquisaDrawerLeft: '',
    };
  }

  function obterStorageKey(pContexto: string): string {
    return `${STORAGE_PREFIX}${pContexto}`;
  }

  function contextoEhTemporario(pContexto: string): boolean {
    return pContexto.startsWith(CONTEXTO_TEMPORARIO_PREFIX);
  }

  function carregarContextoPersistido(pContexto: string): IEstadoFiltrosContexto | null {
    const estadoSerializado = localStorage.getItem(obterStorageKey(pContexto));

    if (!estadoSerializado) {
      return null;
    }

    try {
      return JSON.parse(estadoSerializado) as IEstadoFiltrosContexto;
    } catch {
      localStorage.removeItem(obterStorageKey(pContexto));
      return null;
    }
  }

  function obterEstadoContexto(pContexto: string): IEstadoFiltrosContexto {
    if (!estadosPorContexto.value[pContexto]) {
      estadosPorContexto.value[pContexto] = carregarContextoPersistido(pContexto) ?? criarEstadoVazio();
    }

    return estadosPorContexto.value[pContexto];
  }

  function persistirContexto(pContexto: string): void {
    if (contextoEhTemporario(pContexto)) {
      return;
    }

    const estado = estadosPorContexto.value[pContexto];

    if (!estado) {
      return;
    }

    localStorage.setItem(obterStorageKey(pContexto), JSON.stringify(toRaw(estado)));
  }

  function persistirContextoAtual(): void {
    persistirContexto(contextoFiltroAtual.value);
  }

  function removerContextoPersistido(pContexto: string): void {
    localStorage.removeItem(obterStorageKey(pContexto));
  }

  function obterChavesCamposFiltro(): Set<string> {
    return new Set(camposDisponiveis.value.map((pCampo) => String(pCampo.valor)));
  }

  function removerFiltrosDaQueryAtual(): LocationQueryRaw {
    const query: LocationQueryRaw = { ...route.query };
    const chavesFiltros = obterChavesCamposFiltro();

    chavesFiltros.forEach((pCampo) => {
      delete query[pCampo];
    });

    return query;
  }

  function possuiFiltrosNaUrl(): boolean {
    if (contextoFiltroTemporario.value) {
      return false;
    }

    const chavesFiltros = obterChavesCamposFiltro();

    return Object.keys(route.query).some((pCampo) => chavesFiltros.has(pCampo));
  }

  /**
   * @description Sincroniza a URL com o array `filtersApplied` de modo a manter a persistência
   * em reloads ou compartilhamento de links. Ignora limit/nextEntry.
   */
  function syncToUrl(): void {
    if (contextoFiltroTemporario.value) {
      return;
    }

    const query = removerFiltrosDaQueryAtual();
    persistirContextoAtual();

    filtersApplied.value.forEach((pFiltro) => {
      if (!pFiltro.campo || !pFiltro.condicao) return;

      const campoChave = pFiltro.campo;
      // Serializa no formato: "condicao:valor" (ex: "contains:joao")
      const valorFiltro = Array.isArray(pFiltro.valor) ? pFiltro.valor.join(',') : (pFiltro.valor ?? '');
      const valorConvertido = `${pFiltro.condicao}:${valorFiltro}`;

      if (query[campoChave]) {
        if (Array.isArray(query[campoChave])) {
          (query[campoChave] as string[]).push(valorConvertido);
        } else {
          query[campoChave] = [query[campoChave] as string, valorConvertido];
        }
      } else {
        query[campoChave] = valorConvertido;
      }
    });

    // Replace evita poluir o histórico (BackButton friendly).
    router.replace({ query });
  }

  function confirmarAplicacaoFiltros(): void {
    syncToUrl();
    versaoAplicacaoFiltros.value += 1;
  }

  /**
   * @description Lê a query da rota atual e recria o estado em `filtersApplied`.
   */
  function loadFromUrl(): void {
    if (contextoFiltroTemporario.value) {
      return;
    }

    const novosFiltros: TFiltroConsultaSerializado[] = [];
    const chavesFiltros = obterChavesCamposFiltro();

    Object.entries(route.query).forEach(([pCampo, pValorQuery]) => {
      if (!chavesFiltros.has(pCampo)) return;

      const arrayDeValores = Array.isArray(pValorQuery) ? pValorQuery : [pValorQuery];

      arrayDeValores.forEach((pValue) => {
        if (pValue) {
          const splitVal = String(pValue).split(':');
          if (splitVal.length >= 2) {
            const condition = splitVal[0];
            const value = splitVal.slice(1).join(':');
            const valoresSelecionados = [EOperadoresFiltro.SELECAO, EOperadoresFiltro.EXCECAO].includes(
              condition as EOperadoresFiltro,
            )
              ? value.split(',').filter(Boolean)
              : [];

            novosFiltros.push({
              campo: pCampo,
              condicao: condition,
              valor: value,
              dataInicio: '',
              dataFinal: '',
              valoresSelecionados,
            });
          }
        }
      });
    });

    filtersApplied.value = novosFiltros;
    persistirContextoAtual();
    versaoAplicacaoFiltros.value += 1;
  }

  /**
   * @description Salva o rascunho (`filterModel`) para o array efetivo (`filtersApplied`).
   * Valida duplicidades antes de aplicar.
   */
  function applyFilterModel(): void {
    const rawFilter = toRaw(filterModel.value);

    if (!rawFilter.campo || !rawFilter.condicao) {
      snackbarStore.adicionar({ tipo: 'warning', mensagem: CTradutor.traduzir('common.messages.selectFieldCondition') });
      return;
    }

    const isDuplicate = filtersApplied.value.some(
      (pFiltro) =>
        pFiltro.campo === rawFilter.campo &&
        pFiltro.condicao === rawFilter.condicao &&
        pFiltro.valor === rawFilter.valor,
    );

    if (isDuplicate) {
      snackbarStore.adicionar({
        tipo: 'info',
        titulo: CTradutor.traduzir('common.messages.duplicateFilterTitle'),
        mensagem: CTradutor.traduzir('common.messages.duplicateFilter'),
      });
      return;
    }

    filtersApplied.value.push(rawFilter as TFiltroConsultaSerializado);
    filterModel.value = { campo: rawFilter.campo, condicao: rawFilter.condicao };
    persistirContextoAtual();
  }

  /**
   * @description Remove um filtro ativo no índice especificado.
   * @param pIndex Índice do filtro na coleção ativa.
   */
  function removeFilter(pIndex: number): void {
    filtersApplied.value.splice(pIndex, 1);
    persistirContextoAtual();
  }

  /**
   * @description Move um filtro ativo de volta para o formulário como rascunho.
   * @param pIndex Índice do filtro que será editado.
   */
  function editFilter(pIndex: number): void {
    const filtro = filtersApplied.value.splice(pIndex, 1)[0];
    if (!filtro) return;
    filterModel.value = { ...filtro };
    persistirContextoAtual();
  }

  /** @description Apaga todos os filtros, incluindo o rascunho. */
  function clearAll(): void {
    filtersApplied.value = [];
    filterModel.value = {};
    removerContextoPersistido(contextoFiltroAtual.value);
  }

  function clearAllContexts(): void {
    estadosPorContexto.value = {};
    camposDisponiveisTemporarios.value = null;
    contextoFiltroTemporario.value = null;
    drawerFilterOpen.value = false;

    const persistedKeys = Array.from({ length: localStorage.length }, (pUnused, pIndex) => {
      void pUnused;
      return localStorage.key(pIndex);
    }).filter((pKey): pKey is string => typeof pKey === 'string' && pKey.startsWith(STORAGE_PREFIX));
    persistedKeys.forEach((pKey) => localStorage.removeItem(pKey));
  }

  /**
   * @description Ativa um contexto descartável para montar filtros sem afetar a rota atual.
   * @param pContexto Identificador base do contexto temporário.
   * @param pCamposDisponiveis Campos que podem ser usados no contexto.
   * @param pFiltrosIniciais Filtros carregados inicialmente no contexto.
   */
  function ativarContextoTemporario(
    pContexto: string,
    pCamposDisponiveis: TCampoFiltroMapeado[],
    pFiltrosIniciais: TFiltroConsultaSerializado[] = [],
  ): void {
    const contexto = `${CONTEXTO_TEMPORARIO_PREFIX}${pContexto}`;

    camposDisponiveisTemporarios.value = pCamposDisponiveis;
    contextoFiltroTemporario.value = contexto;
    estadosPorContexto.value[contexto] = {
      filtrosAplicados: pFiltrosIniciais.map((pFiltro) => ({ ...pFiltro })),
      modeloFiltro: {},
      pesquisaDrawerLeft: '',
    };
  }

  /**
   * @description Remove o contexto descartável usado por dialogs locais.
   */
  function desativarContextoTemporario(): void {
    if (contextoFiltroTemporario.value) {
      delete estadosPorContexto.value[contextoFiltroTemporario.value];
    }

    contextoFiltroTemporario.value = null;
    camposDisponiveisTemporarios.value = null;
  }

  // Computadas
  /** Indica a quantidade de filtros ativos para badgets e indicadores UI. */
  const appliedCount = computed(() => filtersApplied.value.length);

  // Observadores
  watch(
    () => [contextoFiltroAtual.value, route.fullPath],
    () => {
      obterEstadoContexto(contextoFiltroAtual.value);

      if (possuiFiltrosNaUrl()) {
        loadFromUrl();
      }
    },
    { immediate: true },
  );

  return {
    estadosPorContexto,
    ativarContextoTemporario,
    contextoFiltroAtual,
    desativarContextoTemporario,
    filtersApplied,
    filterModel,
    drawerFilterOpen,
    pesquisaDrawerLeft,
    camposDisponiveis,
    camposAgrupadoresDisponiveis,
    campoSelecionado,
    appliedCount,
    syncToUrl,
    confirmarAplicacaoFiltros,
    loadFromUrl,
    applyFilterModel,
    removeFilter,
    editFilter,
    clearAll,
    clearAllContexts,
    versaoAplicacaoFiltros,
  };
});
