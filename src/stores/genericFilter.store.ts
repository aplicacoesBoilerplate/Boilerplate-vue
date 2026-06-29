// Ecossistema Vue
import { ref, computed, toRaw, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// Pinia
import { defineStore } from 'pinia';

// Stores
import { useSnackbarStore } from './SnackbarStore';

// Types e Interfaces
import type { IFiltrosConsulta } from '@/models/filters/IFiltrosConsulta';
import type { ICampoFiltro } from '@/models/filters/ICampoFiltro';

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
  /** Array contendo os filtros consolidados e aplicados na view atual. */
  const filtersApplied = ref<IFiltrosConsulta[]>([]);

  /** Filtro em construção no formulário (rascunho). */
  const filterModel = ref<Partial<IFiltrosConsulta>>({});

  /** Controle de abertura/fechamento do Drawer de filtros. */
  const drawerFilterOpen = ref(false);

  /** Valor da pesquisa de campos disponível no left drawer (persiste localmente). */
  const pesquisaDrawerLeft = ref<string>(localStorage.getItem('genericFilter_pesquisaDrawerLeft') || '');

  // Persiste a pesquisa toda vez que ela muda
  watch(pesquisaDrawerLeft, (newVal) => {
    localStorage.setItem('genericFilter_pesquisaDrawerLeft', newVal || '');
  });

  /** Campos disponíveis fornecidos pela view atual baseados nos metadados da rota. */
  const camposDisponiveis = computed(() => {
    return (route.meta.filterResource as ICampoFiltro<any>[]) || [];
  });

  // Funções
  /**
   * Sincroniza a URL com o array `filtersApplied` de modo a manter a persistência
   * em reloads ou compartilhamento de links. Ignora limit/nextEntry.
   */
  function syncToUrl() {
    const query: Record<string, string | string[]> = {};

    filtersApplied.value.forEach((filtro) => {
      if (!filtro.campo || !filtro.condicao) return;

      const campoChave = filtro.campo;
      // Serializa no formato: "condicao:valor" (ex: "contains:joao")
      const valorConvertido = `${filtro.condicao}:${filtro.valor ?? ''}`;

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
    router.replace({ query: { ...route.query, ...query } });
  }

  /**
   * Le a query da rota atual e recria o estado em `filtersApplied`.
   */
  function loadFromUrl() {
    const novosFiltros: IFiltrosConsulta[] = [];

    Object.entries(route.query).forEach(([campo, valorQuery]) => {
      // Ignora parâmetros de paginacao ou estruturais.
      if (['nextEntry', 'limit', 'order'].includes(campo)) return;

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
  }

  /**
   * Salva o rascunho (`filterModel`) para o array efetivo (`filtersApplied`).
   * Valida duplicidades antes de aplicar.
   */
  function applyFilterModel() {
    const rawFilter = toRaw(filterModel.value);

    if (!rawFilter.campo || !rawFilter.condicao) {
      snackbarStore.adicionar({ type: 'warning', text: 'Selecione o campo e a condição!' });
      return;
    }

    const isDuplicate = filtersApplied.value.some(
      (f) => f.campo === rawFilter.campo && f.condicao === rawFilter.condicao && f.valor === rawFilter.valor,
    );

    if (isDuplicate) {
      snackbarStore.adicionar({ type: 'info', title: 'Filtro duplicado', text: 'Você já adicionou esta condição.' });
      return;
    }

    filtersApplied.value.push(rawFilter as IFiltrosConsulta);
    filterModel.value = { campo: rawFilter.campo, condicao: rawFilter.condicao };
  }

  /** Remove um filtro ativo no indice especificado. */
  function removeFilter(index: number) {
    filtersApplied.value.splice(index, 1);
  }

  /** Move um filtro ativo devolta para o formulario (rascunho). */
  function editFilter(index: number) {
    const filtro = filtersApplied.value.splice(index, 1)[0];
    if (!filtro) return;
    filterModel.value = { ...filtro };
  }

  /** Apaga todos os filtros, incluindo o rascunho. */
  function clearAll() {
    filtersApplied.value = [];
    filterModel.value = {};
  }

  // Computadas
  /** Indica a quantidade de filtros ativos para badgets e indicadores UI. */
  const appliedCount = computed(() => filtersApplied.value.length);

  return {
    filtersApplied,
    filterModel,
    drawerFilterOpen,
    pesquisaDrawerLeft,
    camposDisponiveis,
    appliedCount,
    syncToUrl,
    loadFromUrl,
    applyFilterModel,
    removeFilter,
    editFilter,
    clearAll,
  };
});
