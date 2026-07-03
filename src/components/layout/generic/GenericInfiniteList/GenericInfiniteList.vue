<template>
  <div
    class="d-flex flex-column w-100 h-100"
    style="min-height: 0"
  >
    <div
      v-if="$slots.header || showLimitSelector"
      class="d-flex align-center justify-space-between mb-4 flex-wrap ga-4 flex-shrink-0"
    >
      <slot
        name="header"
        :contextId="contexto"
        :items="items"
        :loading="loading"
      />

      <v-select
        v-if="showLimitSelector"
        v-model="limiteAtual"
        :items="limitOptions"
        label="Limite"
        variant="outlined"
        density="compact"
        autocomplete="off"
        hide-details
        style="max-width: 140px; flex: 0 0 140px"
        @update:model-value="resetarECarregar"
      />
    </div>

    <v-infinite-scroll
      :items="items"
      :onLoad="carregarMaisRegistros"
      :emptyText="textoVazio"
      class="w-100 flex-grow-1 overflow-y-auto overflow-x-hidden align-stretch"
      style="min-height: 0"
    >
      <slot
        :contextId="contexto"
        :currentLimit="limiteAtual"
        :getItemBindings="getItemBindings"
        :hasMore="hasMore"
        :items="items"
        :loadMore="carregarMaisRegistros"
        :loading="loading"
        :redirectTo="redirecionarPara"
        :resetAndLoad="resetarECarregar"
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
          name="empty"
          :items="items"
          :loading="loading"
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
            <span>{{ items.length ? textoFinal : textoVazio }}</span>
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
            <span>{{ textoError }}</span>
          </div>
        </slot>
      </template>
    </v-infinite-scroll>
  </div>
</template>

<script setup lang="ts">
// Ecossistema vue
import { computed, onMounted, provide, ref, watch } from "vue";
import type { RouteLocationRaw } from "vue-router";

// Stores
import { useGenericListStore } from "@/stores/genericList.store";
import { useGenericFilterStore } from "@/stores/genericFilter.store";

// Types e Interfaces
import type {
  IGenericListFetchPayload,
  TGenericListFetchResponse,
  TOrdem,
} from "@/models/components/IGenericListContext";
import type { TManagerStorageLocation } from "@/utils/ManagerStorage";

// Composables
import { useRouteScrollRedirect } from "@/composables/useRouteScrollRedirect";
import { useRequisicaoService } from "@/composables/useRequisicaoService";

// Utils
import { createRouteScrollItemBindings } from "@/utils/RouteScrollRestore";

// Provider - Contextos
import { genericInfiniteListKey } from "@/components/layout/generic/genericInfiniteList.context";

// Types
type TLoadDone = (status: "ok" | "empty" | "error") => void;

type TProps = {
  /** Identificador unico do cache/contexto desta lista. */
  contexto: string;
  /** Funcao que busca a proxima pagina usando limite e cursor atuais. */
  serviceFetch: (
    payload: IGenericListFetchPayload,
  ) => Promise<TGenericListFetchResponse>;
  /** Tempo de vida do contexto salvo no storage. */
  cacheTtlMs?: number;
  /** Texto exibido quando não existem registros. */
  textoVazio?: string;
  /** Texto exibido quando não ha mais páginas para carregar. */
  textoFinal?: string;
  /** Texto exibido quando a chamada do infinite scroll falha. */
  textoError?: string;
  /** Limite inicial de itens por página. */
  limite?: number;
  /** Opções disponíveis para seleção de limite em componentes que expõem esse controle. */
  limitOptions?: number[];
  /** Order inicial da busca. */
  ordemInicial?: TOrdem;
  /** Controla a exibição do seletor de limite quando a lista possui cabeçalho próprio. */
  showLimitSelector?: boolean;
  /** Campo estável do item usado para montar seletores de restauração de scroll. */
  itemKey?: string;
  /** Local de persistência do contexto; session evita cache permanente de respostas. */
  storage?: TManagerStorageLocation;
};
const props = withDefaults(defineProps<TProps>(), {
  cacheTtlMs: 15 * 60 * 1000,
  textoVazio: "Nenhum registro encontrado.",
  textoFinal: "Todos os registros foram carregados.",
  textoError: "Não foi possível carregar os registros.",
  limite: 10,
  limitOptions: () => [10, 25, 50, 100],
  ordemInicial: undefined,
  showLimitSelector: false,
  itemKey: undefined,
  storage: "session",
});

// Stores
const genericListStore = useGenericListStore();
const genericFilterStore = useGenericFilterStore();

// Composables
const routeScrollRedirect = useRouteScrollRedirect();
const requisicaoService = useRequisicaoService();

// Reativas
const loading = ref(false);
const limiteAtual = ref(props.limite);

// Funções
function resolveItemKey(
  pItem: unknown,
  pIndex: number,
  pItemKey?: string | number,
) {
  if (pItemKey !== undefined) return pItemKey;

  if (
    props.itemKey &&
    typeof pItem === "object" &&
    pItem !== null &&
    props.itemKey in pItem
  ) {
    return String((pItem as Record<string, unknown>)[props.itemKey]);
  }

  return pIndex;
}

function getItemBindings(
  pItem: unknown,
  pIndex: number,
  pItemKey?: string | number,
) {
  return createRouteScrollItemBindings(
    props.contexto,
    resolveItemKey(pItem, pIndex, pItemKey),
  );
}

function normalizarResposta(pResponse: TGenericListFetchResponse) {
  if (Array.isArray(pResponse)) {
    return {
      items: pResponse,
      proximaEntrada: undefined,
      temMaisRegistros: undefined,
    };
  }

  return pResponse;
}

async function redirecionarPara(to: RouteLocationRaw, pSelector?: string | null) {
  await routeScrollRedirect.redirectTo(to, pSelector);
}

async function resetarECarregar() {
  loading.value = true;

  try {
    genericListStore.setLimit(props.contexto, limiteAtual.value);
    genericListStore.resetContext(props.contexto);

    await carregarMaisRegistros({ done: () => undefined, force: true });
  } catch (error) {
    throw error;
  } finally {
    loading.value = false;
  }
}

async function carregarMaisRegistros({
  done,
  force,
}: { done?: TLoadDone; force?: boolean } = {}) {
  if (!hasMore.value || (loading.value && !force)) {
    done?.("empty");
    return;
  }

  loading.value = true;

  try {
    const payloadRequisicao: IGenericListFetchPayload = {
      contexto: props.contexto,
      limite: limiteAtual.value,
      proximaEntrada: nextEntry.value,
      ordem: currentOrder.value,
      filtros: genericFilterStore.filtersApplied,
    };

    const response = await requisicaoService.executar({
      metodo: props.serviceFetch,
      parametros: payloadRequisicao,
    });

    const normalizedResponse = normalizarResposta(response);
    const newNextEntry = normalizedResponse.proximaEntrada;
    const nextHasMore =
      normalizedResponse.temMaisRegistros ??
      normalizedResponse.items.length >= limiteAtual.value;

    genericListStore.addItems(
      props.contexto,
      normalizedResponse.items,
      newNextEntry,
      nextHasMore,
    );

    done?.(nextHasMore ? "ok" : "empty");
  } catch {
    done?.("error");
  } finally {
    loading.value = false;
  }
}

// Computadas
const items = computed(() => genericListStore.getItems(props.contexto));
const hasMore = computed(() => genericListStore.getHasMore(props.contexto));
const nextEntry = computed(() => genericListStore.getNextEntry(props.contexto));
const currentOrder = computed(() => genericListStore.getOrder(props.contexto));

// Observadores
watch(() => props.contexto, (pContextId) => {
  genericListStore.initContext(pContextId, {
    cacheTtlMs: props.cacheTtlMs,
    limite: limiteAtual.value,
    storage: props.storage,
    ordem: props.ordemInicial,
  });
});

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
  getItemBindings,
  redirectTo: redirecionarPara,
});

// Expose
defineExpose({
  loadMore: carregarMaisRegistros,
  resetAndLoad: resetarECarregar,
  getItemBindings,
  redirectTo: redirecionarPara,
});
</script>
