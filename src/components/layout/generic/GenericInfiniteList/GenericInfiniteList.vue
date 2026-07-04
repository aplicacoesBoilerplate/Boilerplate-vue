<template>
  <div
    class="d-flex flex-column w-100 h-100"
    style="min-height: 0"
  >
    <div
      v-if="$slots.header && exibirSeletorLimite"
      class="d-flex align-center justify-space-between mb-4 flex-wrap ga-4 flex-shrink-0"
    >
      <slot
        name="header"
        :contexto="contexto"
        :ordemAtual="ordemAtual"
        :items="items"
        :loading="loading"
        :toggleOrder="alternarOrdenacao"
      />

      <v-select
        v-if="exibirSeletorLimite"
        v-model="limiteAtual"
        :items="opcoesLimite"
        label="Limite"
        variant="outlined"
        density="compact"
        autocomplete="off"
        hideDetails
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
        :contexto="contexto"
        :limiteAtual="limiteAtual"
        :ordemAtual="ordemAtual"
        :getItemBindings="getItemBindings"
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

/**
 * @property {string} contexto - Identificador unico do cache/contexto desta lista.
 * @property {function(payload: IGenericListFetchPayload): Promise<TGenericListFetchResponse>} serviceFetch - Função que busca a próxima página usando limite e cursor atuais.
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
  serviceFetch: (
    payload: IGenericListFetchPayload,
  ) => Promise<TGenericListFetchResponse>;
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
  textoVazio: "Nenhum registro encontrado.",
  textoFinal: "Todos os registros foram carregados.",
  textoError: "Não foi possível carregar os registros.",
  limite: 10,
  limitOptions: () => [10, 25, 50, 100],
  ordemInicial: undefined,
  showLimitSelector: false,
  itemKey: undefined,
  storage: "session",
  usarFiltrosGlobais: true,
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

/**
 * @description Resolve a chave do item, usada para montar seletores de restauração de scroll.
 * @param pItem - Item a ser resolvido.
 * @param pIndex - Índice do item.
 * @param pItemKey - Chave do item.
 * @returns Chave do item.
 */
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

/**
 * @description Retorna os bindings de restauração de scroll para um item específico.
 * @param pItem - Item a ser resolvido.
 * @param pIndex - Índice do item.
 * @param pItemKey - Chave do item.
 * @returns Bindings de restauração de scroll.
 */
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

/**
 * @description Normaliza a resposta da requisição.
 * @param pResponse - Resposta da requisição.
 * @returns Resposta normalizada.
 */
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

/**
 * @description Redireciona para uma rota específica com restauração de scroll.
 * @param to - Rota para a qual redirecionar.
 * @param pSelector - Seletor do item para restauração de scroll.
 */
async function redirecionarPara(to: RouteLocationRaw, pSelector?: string | null) {
  await routeScrollRedirect.redirectTo(to, pSelector);
}

/**
 * @description Reseta e carrega os registros.
 */
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

/**
 * @description Alterna a ordem da lista.
 */
async function alternarOrdenacao(): Promise<void> {
  const proximaOrdem: TOrdem = ordemAtual.value === "asc" ? "desc" : "asc";

  genericListStore.setOrder(props.contexto, proximaOrdem);

  await resetarECarregar();
}

/**
 * @description Carrega mais registros para a lista.
 * @param done - Função para notificar o status do carregamento.
 * @param force - Força o carregamento.
 */
async function carregarMaisRegistros({
  done,
  force,
}: { done?: TLoadDone; force?: boolean } = {}) {
  if (!temMaisRegistros.value || (loading.value && !force)) {
    done?.("empty");
    return;
  }

  loading.value = true;

  try {
    const payloadRequisicao: IGenericListFetchPayload = {
      contexto: props.contexto,
      limite: limiteAtual.value,
      proximaEntrada: proximaEntrada.value,
      ordem: ordemAtual.value,
      filtros: props.usarFiltrosGlobais ? genericFilterStore.filtersApplied : undefined,
    };

    const response = await requisicaoService.executar({
      metodo: props.serviceFetch,
      parametros: payloadRequisicao,
    });

    const normalizedResponse = normalizarResposta(response);
    const novoCursorEntrada = normalizedResponse.proximaEntrada;
    const novoControleTemMaisRegistros =
      normalizedResponse.temMaisRegistros ??
      normalizedResponse.items.length >= limiteAtual.value;

    genericListStore.addItems(
      props.contexto,
      normalizedResponse.items,
      novoCursorEntrada,
      novoControleTemMaisRegistros,
    );

    done?.(novoControleTemMaisRegistros ? "ok" : "empty");
  } catch {
    done?.("error");
  } finally {
    loading.value = false;
  }
}

/**
 * @description Insere um item na lista em memória, discartando a necessidade de recarregar a lista para que o item seja exibido e, consequentemente, perdendo todo o progresso do scroll.
 * @param pItem - Item a ser inserido.
 */
function inserirItem(pItem: unknown): void {
  if (ordemAtual.value === "asc") {
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
 * @param pIdField - Campo identificador do item.
 * @param pIdValue - Valor do campo identificador.
 */
function removerItem<TItem extends object>(
  pIdField: keyof TItem,
  pIdValue: TItem[keyof TItem],
): void {
  genericListStore.removeItem(props.contexto, pIdField, pIdValue);
}

// Computadas
const items = computed(() => genericListStore.getItems(props.contexto));
const temMaisRegistros = computed(() => genericListStore.getHasMore(props.contexto));
const proximaEntrada = computed(() => genericListStore.getNextEntry(props.contexto));
const ordemAtual = computed(() => genericListStore.getOrder(props.contexto));

// Observadores
watch(() => props.contexto, (pContextId) => {
  genericListStore.initContext(pContextId, {
    cacheTtlMs: props.cacheTtlMs,
    limite: limiteAtual.value,
    storage: props.storage,
    ordem: props.ordemInicial,
  });
});

watch(() => genericFilterStore.filtersApplied, () => {
  if (!props.usarFiltrosGlobais) {
    return;
  }

  void resetarECarregar();
}, { deep: true });

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
  inserirItem,
  atualizarItem,
  removerItem,
  getItemBindings,
  redirectTo: redirecionarPara,
});
</script>
