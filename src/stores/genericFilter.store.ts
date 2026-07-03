// Ecossistema Vue
import { computed, ref, toRaw, watch } from 'vue';
import { useRoute, useRouter, type LocationQueryRaw } from 'vue-router';

// Pinia
import { defineStore } from 'pinia';

// Stores
import { useSnackbarStore } from './SnackbarStore';

// Types e Interfaces
import type { IFiltrosConsulta } from '@/models/filters/IFiltrosConsulta';
import type { ICampoFiltro } from '@/models/filters/ICampoFiltro';

/**
 * @description Gerencia o estado de filtros aplicados em uma view específica (contexto).
 * @property {IFiltrosConsulta[]} filtrosAplicados - Filtros aplicados no recurso atual.
 * @property {Partial<IFiltrosConsulta>} modeloFiltro - Filtro em construção no formulário.
 * @property {string} pesquisaDrawerLeft - Pesquisa do drawer esquerdo isolada por contexto.
 */
interface IEstadoFiltrosContexto {
  filtrosAplicados: IFiltrosConsulta[];
  modeloFiltro: Partial<IFiltrosConsulta>;
  pesquisaDrawerLeft: string;
}

const STORAGE_PREFIX = 'boilerplate.generic-filter.context.';
const CONTEXTO_FILTRO_PADRAO = 'global';

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

  /** Controle de abertura/fechamento do Drawer de filtros. */
  const drawerFilterOpen = ref(false);

  /** Campos disponíveis fornecidos pela view atual baseados nos metadados da rota. */
  const camposDisponiveis = computed(() => {
    return (route.meta.filterResource as ICampoFiltro<any>[]) || [];
  });

  /** Campos disponíveis para agrupamento na view atual baseados nos metadados da rota. */
  const camposAgrupadoresDisponiveis = computed(() => {
    return camposDisponiveis.value.filter(campo => campo.disponivelAgrupamento);
  });

  const contextoFiltroAtual = computed(() => {
    return String(route.meta.filterContext ?? route.name ?? route.path ?? CONTEXTO_FILTRO_PADRAO);
  });

  const estadoFiltroAtual = computed(() => obterEstadoContexto(contextoFiltroAtual.value));

  /** Array contendo os filtros consolidados e aplicados na view atual. */
  const filtersApplied = computed<IFiltrosConsulta[]>({
    get: () => estadoFiltroAtual.value.filtrosAplicados,
    set: (pFiltros) => {
      estadoFiltroAtual.value.filtrosAplicados = pFiltros;
      persistirContextoAtual();
    },
  });

  /** Filtro em construção no formulário (rascunho). */
  const filterModel = computed<Partial<IFiltrosConsulta>>({
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
  const campoSelecionado = computed<ICampoFiltro<any> | null>(() => {
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
    const chavesFiltros = obterChavesCamposFiltro();

    return Object.keys(route.query).some((pCampo) => chavesFiltros.has(pCampo));
  }

  /**
   * Sincroniza a URL com o array `filtersApplied` de modo a manter a persistência
   * em reloads ou compartilhamento de links. Ignora limit/nextEntry.
   */
  function syncToUrl(): void {
    const query = removerFiltrosDaQueryAtual();
    persistirContextoAtual();

    filtersApplied.value.forEach((filtro) => {
      if (!filtro.campo || !filtro.condicao) return;

      const campoChave = filtro.campo;
      // Serializa no formato: "condicao:valor" (ex: "contains:joao")
      const valorFiltro = Array.isArray(filtro.valor) ? filtro.valor.join(',') : filtro.valor ?? '';
      const valorConvertido = `${filtro.condicao}:${valorFiltro}`;

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

  /**
   * Le a query da rota atual e recria o estado em `filtersApplied`.
   */
  function loadFromUrl(): void {
    const novosFiltros: IFiltrosConsulta[] = [];
    const chavesFiltros = obterChavesCamposFiltro();

    Object.entries(route.query).forEach(([campo, valorQuery]) => {
      if (!chavesFiltros.has(campo)) return;

      const arrayDeValores = Array.isArray(valorQuery) ? valorQuery : [valorQuery];

      arrayDeValores.forEach((val) => {
        if (val) {
          const splitVal = String(val).split(':');
          if (splitVal.length >= 2) {
            const condition = splitVal[0];
            const value = splitVal.slice(1).join(':');
            novosFiltros.push({
              campo: campo,
              condicao: condition,
              valor: value,
              dataInicio: '',
              dataFinal: '',
              valoresSelecionados: [],
            });
          }
        }
      });
    });

    filtersApplied.value = novosFiltros;
    persistirContextoAtual();
  }

  /**
   * Salva o rascunho (`filterModel`) para o array efetivo (`filtersApplied`).
   * Valida duplicidades antes de aplicar.
   */
  function applyFilterModel(): void {
    const rawFilter = toRaw(filterModel.value);

    if (!rawFilter.campo || !rawFilter.condicao) {
      snackbarStore.adicionar({ tipo: 'warning', mensagem: 'Selecione o campo e a condição!' });
      return;
    }

    const isDuplicate = filtersApplied.value.some(
      (f) => f.campo === rawFilter.campo && f.condicao === rawFilter.condicao && f.valor === rawFilter.valor,
    );

    if (isDuplicate) {
      snackbarStore.adicionar({ tipo: 'info', titulo: 'Filtro duplicado', mensagem: 'Você já adicionou esta condição.' });
      return;
    }

    filtersApplied.value.push(rawFilter as IFiltrosConsulta);
    filterModel.value = { campo: rawFilter.campo, condicao: rawFilter.condicao };
    persistirContextoAtual();
  }

  /** Remove um filtro ativo no indice especificado. */
  function removeFilter(index: number): void {
    filtersApplied.value.splice(index, 1);
    persistirContextoAtual();
  }

  /** Move um filtro ativo devolta para o formulario (rascunho). */
  function editFilter(index: number): void {
    const filtro = filtersApplied.value.splice(index, 1)[0];
    if (!filtro) return;
    filterModel.value = { ...filtro };
    persistirContextoAtual();
  }

  /** Apaga todos os filtros, incluindo o rascunho. */
  function clearAll(): void {
    filtersApplied.value = [];
    filterModel.value = {};
    removerContextoPersistido(contextoFiltroAtual.value);
  }

  // Computadas
  /** Indica a quantidade de filtros ativos para badgets e indicadores UI. */
  const appliedCount = computed(() => filtersApplied.value.length);

  // Observadores
  watch(() => [contextoFiltroAtual.value, route.fullPath], () => {
    obterEstadoContexto(contextoFiltroAtual.value);

    if (possuiFiltrosNaUrl()) {
      loadFromUrl();
    }
  }, { immediate: true });

  return {
    estadosPorContexto,
    contextoFiltroAtual,
    filtersApplied,
    filterModel,
    drawerFilterOpen,
    pesquisaDrawerLeft,
    camposDisponiveis,
    camposAgrupadoresDisponiveis,
    campoSelecionado,
    appliedCount,
    syncToUrl,
    loadFromUrl,
    applyFilterModel,
    removeFilter,
    editFilter,
    clearAll,
  };
});
