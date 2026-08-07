<template>
  <div
    class="d-flex flex-column w-100 h-100"
    style="min-height: 0"
  >
    <div
      v-if="$slots.header"
      class="d-flex align-center justify-space-between flex-wrap ga-4 flex-shrink-0"
    >
      <slot
        :contexto="contexto"
        :ordemAtual="ordemAtual"
        :items="items"
        :loading="loading"
        :alternarOrdenacao="alternarOrdenacao"
        :toggleOrder="alternarOrdenacao"
        name="header"
      />

      <v-select
        v-if="exibirSeletorLimite"
        v-model="limiteAtual"
        :items="opcoesLimite"
        :label="t('components.genericInfiniteList.limite')"
        variant="outlined"
        density="compact"
        autocomplete="off"
        style="max-width: 140px; flex: 0 0 140px"
        hideDetails
        @update:modelValue="resetarECarregar"
      />
    </div>

    <v-infinite-scroll
      :key="versaoScroll"
      :items="items"
      :onLoad="carregarMaisRegistros"
      :emptyText="textoVazioPadrao"
      class="w-100 flex-grow-1 overflow-y-auto overflow-x-hidden align-stretch"
      style="min-height: 0"
    >
      <slot
        :contexto="contexto"
        :limiteAtual="limiteAtual"
        :ordemAtual="ordemAtual"
        :obterVinculosItem="obterVinculosItem"
        :getItemBindings="obterVinculosItem"
        :temMaisRegistros="temMaisRegistros"
        :items="items"
        :loadMore="carregarMaisRegistros"
        :loading="loading"
        :redirectTo="redirecionarPara"
        :resetarECarregar="resetarECarregar"
        :alterarOrdenacao="alternarOrdenacao"
      />

      <template #loading>
        <div
          class="d-flex flex-column align-center justify-center pa-6 text-center"
          style="min-height: 120px"
        >
          <v-progress-circular
            color="primary"
            size="32"
            indeterminate
          />
        </div>
      </template>

      <template #empty>
        <slot
          :items="items"
          :loading="loading"
          name="empty"
        >
          <div
            v-if="loading"
            class="d-flex flex-column align-center justify-center pa-6 text-center"
            style="min-height: 120px"
          >
            <v-progress-circular
              color="primary"
              size="32"
              indeterminate
            />
          </div>
          <div
            v-else
            class="d-flex flex-column align-center justify-center pa-6 text-center text-medium-emphasis"
            style="min-height: 120px"
          >
            <v-icon
              icon="mdi-database-check"
              size="40"
              class="mb-2"
            />
            <span>{{ items.length ? textoFinalPadrao : textoVazioPadrao }}</span>
          </div>
        </slot>
      </template>

      <template #error>
        <slot name="error">
          <div
            class="d-flex flex-column align-center justify-center pa-6 text-center text-error"
            style="min-height: 120px"
          >
            <v-icon
              icon="mdi-alert-circle-outline"
              size="40"
              class="mb-2"
            />
            <span>{{ textoErrorPadrao }}</span>
          </div>
        </slot>
      </template>
    </v-infinite-scroll>
  </div>
</template>

<script setup lang="ts" generic="TInterfaceRegistro extends object">
// Ecossistema vue
import { computed, onMounted, provide, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

// Stores
import { useGenericFilterStore } from '@/stores/genericFilter.store';
import { useGenericListStore } from '@/stores/genericList.store';

import type { IGenericInfiniteListExpose, TInfiniteListLoadDone } from '@/models/components/exposes/IGenericInfiniteListExpose';
// Models
import type { IConsultaRegistros, IRespostaConsultaRegistros } from '@/models/consulta/IConsultaRegistros';
import type { TOrdem } from '@/models/consulta/IConsultaRegistros';
import type { TManagerStorageLocation } from '@/utils/ManagerStorage';
import type { RouteLocationRaw } from 'vue-router';

// Composables
import { useRequisicaoService } from '@/composables/useRequisicaoService';
import { useRouteScrollRedirect } from '@/composables/useRouteScrollRedirect';

// Utils
import { createRouteScrollItemBindings } from '@/utils/RouteScrollRestore';

// Provider - Contextos
import { genericInfiniteListKey } from '@/components/layouts/generic/genericInfiniteList.context';

// Types
type TLoadDone = TInfiniteListLoadDone;

/**
 * @property {string} contexto - Identificador unico do cache/contexto desta lista.
 * @property {(pPayload: IConsultaRegistros<TInterfaceRegistro>) => Promise<IRespostaConsultaRegistros<TInterfaceRegistro>>} serviceFetch - Função que busca a próxima página usando limite e cursor atuais.
 * @property {number} cacheTtlMs - Tempo de vida do contexto salvo no storage.
 * @property {string} textoVazio - Texto exibido quando não existem registros.
 * @property {string} textoFinal - Texto exibido quando não ha mais páginas para carregar.
 * @property {string} textoError - Texto exibido quando a chamada do infinite scroll falha.
 * @property {number} limite - Limite inicial de itens por página.
 * @property {number[]} opcoesLimite - Opções disponíveis para seleção de limite em componentes que expõem esse controle.
 * @property {TOrdem} ordemInicial - Order inicial da busca.
 * @property {boolean} exibirSeletorLimite - Controla a exibição do seletor de limite quando a lista possui cabeçalho próprio.
 * @property {string} itemKey - Campo estável do item usado para montar seletores de restauração de scroll.
 * @property {TManagerStorageLocation} storage - Local de persistência do contexto; session evita cache permanente de respostas.
 * @property {boolean} usarFiltrosGlobais - Define se os filtros globais devem ser enviados e observados por esta lista.
 */
type TProps = {
  contexto: string;
  serviceFetch: (pPayload: IConsultaRegistros<TInterfaceRegistro>) => Promise<IRespostaConsultaRegistros<TInterfaceRegistro>>;
  cacheTtlMs?: number;
  textoVazio?: string;
  textoFinal?: string;
  textoError?: string;
  limite?: number;
  opcoesLimite?: number[];
  ordemInicial?: TOrdem;
  exibirSeletorLimite?: boolean;
  itemKey?: string;
  storage?: TManagerStorageLocation;
  usarFiltrosGlobais?: boolean;
};
const props = withDefaults(defineProps<TProps>(), {
  cacheTtlMs: 15 * 60 * 1000,
  textoVazio: undefined,
  textoFinal: undefined,
  textoError: undefined,
  limite: 10,
  opcoesLimite: () => [10, 25, 50, 100],
  ordemInicial: undefined,
  exibirSeletorLimite: false,
  itemKey: undefined,
  storage: 'session',
  usarFiltrosGlobais: true,
});

// Stores
const genericListStore = useGenericListStore();
const genericFilterStore = useGenericFilterStore();

// Composables
const routeScrollRedirect = useRouteScrollRedirect();
const requisicaoService = useRequisicaoService();
const { t } = useI18n();

// Reativas
const loading = ref(false);
const limiteAtual = ref(props.limite);
const versaoScroll = ref(0);

// Funções

/**
 * @description Resolve a chave do item, usada para montar seletores de restauração de scroll.
 * @param pItem - Item a ser resolvido.
 * @param pIndex - Índice do item.
 * @param pItemKey - Chave do item.
 * @returns Chave do item.
 */
function resolverChaveItem(pItem: unknown, pIndex: number, pItemKey?: string | number) {
  if (pItemKey !== undefined) return pItemKey;

  if (props.itemKey && typeof pItem === 'object' && pItem !== null && props.itemKey in pItem) {
    return String((pItem as Record<string, unknown>)[props.itemKey]);
  }

  return pIndex;
}

/**
 * @description Retorna os bindings de restauração de scroll para um item específico.
 * @param pItem - Item a ser resolvido.
 * @param pIndex - Índice do item.
 * @param pItemKey - Chave do item.
 * @returns Bindings de restauração de scroll.
 */
function obterVinculosItem(pItem: unknown, pIndex: number, pItemKey?: string | number) {
  return createRouteScrollItemBindings(props.contexto, resolverChaveItem(pItem, pIndex, pItemKey));
}

/**
 * @description Redireciona para uma rota específica com restauração de scroll.
 * @param pTo - Rota para a qual redirecionar.
 * @param pSelector - Seletor do item para restauração de scroll.
 */
async function redirecionarPara(pTo: RouteLocationRaw, pSelector?: string | null) {
  await routeScrollRedirect.redirecionarPara(pTo, pSelector);
}

/**
 * @description Reseta e carrega os registros.
 */
async function resetarECarregar() {
  loading.value = true;

  try {
    genericListStore.setLimit(props.contexto, limiteAtual.value);
    genericListStore.resetContext(props.contexto);
    versaoScroll.value += 1;
  } finally {
    loading.value = false;
  }
}

/**
 * @description Alterna a ordem da lista.
 */
async function alternarOrdenacao(): Promise<void> {
  const proximaOrdem: TOrdem = ordemAtual.value === 'asc' ? 'desc' : 'asc';
  genericListStore.setOrder(props.contexto, proximaOrdem);

  await resetarECarregar();
}

/**
 * @description Carrega mais registros para a lista.
 * @param done - Função para notificar o status do carregamento.
 * @param done.done - Implementação.
 * @param force - Força o carregamento.
 * @param done.force - Implementação.
 */
async function carregarMaisRegistros({ done: pDone, force: pForce }: { done?: TLoadDone; force?: boolean } = {}) {
  if (!temMaisRegistros.value || (loading.value && !pForce)) {
    pDone?.('empty');
    return;
  }

  loading.value = true;

  try {
    const payloadRequisicao: IConsultaRegistros<TInterfaceRegistro> = {
      filtros: props.usarFiltrosGlobais ? genericFilterStore.filtersApplied : [],
      limite: limiteAtual.value,
      proximaEntrada: proximaEntrada.value,
      ordenacao: ordemAtual.value,
    };

    const response = await requisicaoService.executar({
      metodo: props.serviceFetch,
      parametros: payloadRequisicao,
    });

    const novoCursorEntrada = response.proximaEntrada;
    const novoControleTemMaisRegistros =
      response.possuiMais ?? response.registros.length >= limiteAtual.value;

    genericListStore.addItems(
      props.contexto,
      response.registros,
      novoCursorEntrada,
      novoControleTemMaisRegistros,
    );

    pDone?.(novoControleTemMaisRegistros ? 'ok' : 'empty');
  } catch {
    pDone?.('error');
  } finally {
    loading.value = false;
  }
}

/**
 * @description Insere um item na lista em memória, discartando a necessidade de recarregar a lista para que o item seja exibido e, consequentemente, perdendo todo o progresso do scroll.
 * @param pItem - Item a ser inserido.
 */
function inserirItem(pItem: unknown): void {
  if (ordemAtual.value === 'asc') {
    genericListStore.appendItem(props.contexto, pItem);
    return;
  }

  genericListStore.prependItem(props.contexto, pItem);
}

/**
 * @description Atualiza os dados de um item existente na lista em memória.
 * @param pIdField - Campo identificador do item.
 * @param pIdValue - Valor do campo identificador.
 * @param pNewValues - Novos valores para o item.
 */
function atualizarItem<TItem extends object>(
  pIdField: keyof TItem,
  pIdValue: TItem[keyof TItem],
  pNewValues: Partial<TItem>,
): void {
  genericListStore.updateItem(props.contexto, pIdField, pIdValue, pNewValues);
}

/**
 * @description Remove um item da lista em memória.
 * @template {TItem} - Tipo do item que deve ser inferido a partir do pIdField.
 * 
 * @param pIdField - Campo identificador do item.
 * @param pIdValue - Valor do campo identificador.
 */
function removerItem<TItem extends object>(pIdField: keyof TItem, pIdValue: TItem[keyof TItem]): void {
  genericListStore.removeItem(props.contexto, pIdField, pIdValue);
}

// Computadas
const items = computed(() => genericListStore.getItems<TInterfaceRegistro>(props.contexto));
const temMaisRegistros = computed(() => genericListStore.getHasMore(props.contexto));
const proximaEntrada = computed(() => genericListStore.getNextEntry(props.contexto));
const ordemAtual = computed(() => genericListStore.getOrder(props.contexto));

const textoVazioPadrao = computed(() => props.textoVazio ?? t('components.genericInfiniteList.textoVazio'));
const textoFinalPadrao = computed(() => props.textoFinal ?? t('components.genericInfiniteList.textoFinal'));
const textoErrorPadrao = computed(() => props.textoError ?? t('components.genericInfiniteList.textoErro'));

// Observadores
watch(
  () => props.contexto,
  (pContextId) => {
    genericListStore.initContext(pContextId, {
      cacheTtlMs: props.cacheTtlMs,
      limite: limiteAtual.value,
      storage: props.storage,
      ordem: props.ordemInicial,
    });
  },
);

watch(
  () => genericFilterStore.versaoAplicacaoFiltros,
  () => {
    if (!props.usarFiltrosGlobais) {
      return;
    }

    void resetarECarregar();
  },
);

// Lifecycle Hooks
onMounted(() => {
  genericListStore.initContext(props.contexto, {
    cacheTtlMs: props.cacheTtlMs,
    limite: limiteAtual.value,
    storage: props.storage,
    ordem: props.ordemInicial,
  });

  limiteAtual.value = genericListStore.getLimit(props.contexto);
});

// Provide
provide(genericInfiniteListKey, {
  contexto: props.contexto,
  obterVinculosItem,
  redirecionarPara,
  getItemBindings: obterVinculosItem,
  redirectTo: redirecionarPara,
});

// Expose
defineExpose({
  loadMore: carregarMaisRegistros,
  resetAndLoad: resetarECarregar,
  carregarMaisRegistros,
  resetarECarregar,
  inserirItem,
  atualizarItem,
  removerItem,
  obterVinculosItem,
  getItemBindings: obterVinculosItem,
  redirecionarPara
} satisfies IGenericInfiniteListExpose);
</script>
