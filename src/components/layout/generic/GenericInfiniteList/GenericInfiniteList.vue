<template>
  <div class="w-100">
    <div
      v-if="$slots.header || showLimitSelector"
      class="d-flex align-center justify-space-between mb-4 flex-wrap gap-4"
    >
      <slot
        name="header"
        :contextId="contextId"
        :items="items"
        :loading="loading"
      />

      <v-select
        v-if="showLimitSelector"
        v-model="currentLimit"
        :items="limitOptions"
        label="Limite"
        variant="outlined"
        density="compact"
        autoComplete="off"
        hideDetails
        style="max-width: 140px; flex: 0 0 140px"
        @update:model-value="resetAndLoad"
      />
    </div>

    <v-infinite-scroll
      :items="items"
      :onLoad="loadMore"
      :emptyText="emptyText"
      class="w-100 overflow-hidden align-stretch"
    >
      <slot
        :contextId="contextId"
        :currentLimit="currentLimit"
        :getItemBindings="getItemBindings"
        :hasMore="hasMore"
        :items="items"
        :loadMore="loadMore"
        :loading="loading"
        :redirectTo="redirectTo"
        :resetAndLoad="resetAndLoad"
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
            <span>{{ items.length ? endText : emptyText }}</span>
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
            <span>{{ errorText }}</span>
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
} from "@/models/components/IGenericListContext";
import type { TManagerStorageLocation } from "@/utils/ManagerStorage";

// Composables
import { useRouteScrollRedirect } from "@/composables/useRouteScrollRedirect";

// Utils
import { createRouteScrollItemBindings } from "@/utils/RouteScrollRestore";

// Contextos
import { genericInfiniteListKey } from "@/components/layout/generic/genericInfiniteList.context";

// Types
type TLoadDone = (status: "ok" | "empty" | "error") => void;

type TProps = {
  /** Identificador unico do cache/contexto desta lista. */
  contextId: string;
  /** Funcao que busca a proxima pagina usando limite e cursor atuais. */
  serviceFetch: (
    payload: IGenericListFetchPayload,
  ) => Promise<TGenericListFetchResponse>;
  /** Tempo de vida do contexto salvo no storage. */
  cacheTtlMs?: number;
  /** Texto exibido quando não existem registros. */
  emptyText?: string;
  /** Texto exibido quando não ha mais páginas para carregar. */
  endText?: string;
  /** Texto exibido quando a chamada do infinite scroll falha. */
  errorText?: string;
  /** Limite inicial de itens por página. */
  initialLimit?: number;
  /** Order inicial da busca. */
  initialOrder?: string;
  /** Campo estável do item usado para montar seletores de restauração de scroll. */
  itemKey?: string;
  /** Opções do seletor de limite. */
  limitOptions?: number[];
  /** Controla se o seletor de limite aparece no cabeçalho. */
  showLimitSelector?: boolean;
  /** Local de persistência do contexto; session evita cache permanente de respostas. */
  storage?: TManagerStorageLocation;
};
const props = withDefaults(defineProps<TProps>(), {
  cacheTtlMs: 15 * 60 * 1000,
  emptyText: "Nenhum registro encontrado.",
  endText: "Todos os registros foram carregados.",
  errorText: "Não foi possível carregar os registros.",
  initialLimit: undefined,
  initialOrder: undefined,
  itemKey: undefined,
  limitOptions: () => [5, 10, 25, 50, 100],
  showLimitSelector: false,
  storage: "session",
});

// Stores
const genericListStore = useGenericListStore();
const genericFilterStore = useGenericFilterStore();

// Composables
const routeScrollRedirect = useRouteScrollRedirect();

// Reativas
const loading = ref(false);
const currentLimit = ref(props.initialLimit ?? props.limitOptions[0]);

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
    props.contextId,
    resolveItemKey(pItem, pIndex, pItemKey),
  );
}

function normalizeResponse(pResponse: TGenericListFetchResponse) {
  if (Array.isArray(pResponse)) {
    return {
      items: pResponse,
      nextEntry: undefined,
      hasMore: undefined,
    };
  }

  return pResponse;
}

async function redirectTo(to: RouteLocationRaw, pSelector?: string | null) {
  await routeScrollRedirect.redirectTo(to, pSelector);
}

async function resetAndLoad() {
  loading.value = true;

  try {
    genericListStore.setLimit(props.contextId, currentLimit.value);
    genericListStore.resetContext(props.contextId);

    await loadMore({ done: () => undefined, force: true });
  } catch (error) {
    throw error;
  } finally {
    loading.value = false;
  }
}

async function loadMore({
  done,
  force,
}: { done?: TLoadDone; force?: boolean } = {}) {
  if (!hasMore.value || (loading.value && !force)) {
    done?.("empty");
    return;
  }

  loading.value = true;

  try {
    const response = await props.serviceFetch({
      contextId: props.contextId,
      limit: currentLimit.value,
      nextEntry: nextEntry.value,
      order: currentOrder.value,
      filtros: genericFilterStore.filtersApplied,
    });

    const normalizedResponse = normalizeResponse(response);
    const newNextEntry = normalizedResponse.nextEntry;
    const nextHasMore =
      normalizedResponse.hasMore ??
      normalizedResponse.items.length >= currentLimit.value;

    genericListStore.addItems(
      props.contextId,
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
const items = computed(() => genericListStore.getItems(props.contextId));
const hasMore = computed(() => genericListStore.getHasMore(props.contextId));
const nextEntry = computed(() => genericListStore.getNextEntry(props.contextId));
const currentOrder = computed(() => genericListStore.getOrder(props.contextId));

// Observadores
watch(() => props.contextId, (pContextId) => {
  genericListStore.initContext(pContextId, {
    cacheTtlMs: props.cacheTtlMs,
    limit: currentLimit.value,
    storage: props.storage,
    order: props.initialOrder,
  });
});

// Lifecycle Hooks
onMounted(() => {
  genericListStore.initContext(props.contextId, {
    cacheTtlMs: props.cacheTtlMs,
    limit: currentLimit.value,
    storage: props.storage,
    order: props.initialOrder,
  });

  currentLimit.value = genericListStore.getLimit(props.contextId);
});

// Provide
provide(genericInfiniteListKey, {
  contextId: props.contextId,
  getItemBindings,
  redirectTo,
});

// Expose
defineExpose({
  loadMore,
  resetAndLoad,
  getItemBindings,
  redirectTo,
});
</script>
