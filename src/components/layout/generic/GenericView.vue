<template>
  <v-card
    class="mb-3 pa-3 bg-surface"
    elevation="4"
    rounded="te-xl bs-xl"
  >
    <section class="w-100">
      <header
        v-if="title || $slots.header"
        class="mb-4"
      >
        <slot
          name="header"
          :title="title"
        >
          <h1 class="text-h4 font-weight-bold">{{ title }}</h1>
        </slot>
      </header>

      <GenericInfiniteList
        ref="infiniteListRef"
        :cacheTtlMs="cacheTtlMs"
        :contextId="contextId"
        :emptyText="emptyText"
        :endText="endText"
        :errorText="errorText"
        :initialLimit="initialLimit"
        :initialOrder="initialOrder"
        :itemKey="itemKey"
        :limitOptions="limitOptions"
        :serviceFetch="serviceFetch"
        :showLimitSelector="showLimitSelector"
        :storage="storage"
      >
        <!-- v-if="$slots['list-header']" -->
        <template #header="slotProps">
          <slot
            name="list-header"
            v-bind="slotProps"
          >
            <div class="mb-3">
              <BtnActionDrawer
                top="28px"
                right="6px"
                width="160px"
                absolute
              >
                <div class="d-flex flex-row ga-2">
                  <slot name="list-header-actions" />

                  <v-tooltip
                    :text="'Novo Registro'"
                    location="bottom"
                  >
                    <template #activator="{ props }">
                      <v-btn
                        v-bind="props"
                        color="primary"
                        icon="mdi-plus"
                        size="x-small"
                        @click="handleNovoRegistro({ modoEdicao: false })"
                      />
                    </template>
                  </v-tooltip>
                </div>
              </BtnActionDrawer>
            </div>
          </slot>
        </template>

        <template #default="slotProps">
          <slot v-bind="slotProps" />
        </template>

        <template
          v-if="$slots.empty"
          #empty="slotProps"
        >
          <slot
            name="empty"
            v-bind="slotProps"
          />
        </template>

        <template
          v-if="$slots.error"
          #error
        >
          <slot name="error" />
        </template>
      </GenericInfiniteList>
    </section>
  </v-card>
</template>

<script setup lang="ts">
// Ecossistema vue
import { ref } from 'vue';

// Types e Interfaces
import type { IGenericListFetchPayload, TGenericListFetchResponse } from '@/models/components/IGenericListContext';
import type { TManagerStorageLocation } from '@/utils/ManagerStorage';

// Components
import GenericInfiniteList from './GenericInfiniteList/GenericInfiniteList.vue';
import BtnActionDrawer from '@/components/layouts/base/appbar/fixtures/BtnActionDrawer.vue';

// Types
type TProps = {
  /** Tempo de vida do contexto salvo em storage antes de a lista precisar recarregar. */
  cacheTtlMs?: number;
  /** Identificador unico do contexto usado pela store e pela chave no storage. */
  contextId: string;
  /** Texto exibido quando a lista ainda nao possui itens. */
  emptyText?: string;
  /** Texto exibido quando todos os registros ja foram carregados. */
  endText?: string;
  /** Texto exibido quando o carregamento do infinite scroll falhar. */
  errorText?: string;
  /** Limite inicial de registros por requisicao. */
  initialLimit?: number;
  /** Ordenação inicial padrão. */
  initialOrder?: string;
  /** Campo estavel do item usado para montar seletor de restauracao de scroll. */
  itemKey?: string;
  /** Opcoes disponiveis no seletor de limite da lista. */
  limitOptions?: number[];
  /** Funcao responsavel por buscar a proxima pagina de registros. */
  serviceFetch: (payload: IGenericListFetchPayload) => Promise<TGenericListFetchResponse>;
  /** Controla exibicao do seletor de limite no cabecalho da lista. */
  showLimitSelector?: boolean;
  /** Define onde o contexto sera persistido; em listas temporarias o padrao e session. */
  storage?: TManagerStorageLocation;
  /** Titulo simples exibido quando o slot header nao for informado. */
  title?: string;
};
withDefaults(defineProps<TProps>(), {
  cacheTtlMs: 15 * 60 * 1000,
  emptyText: 'Nenhum registro encontrado.',
  endText: 'Todos os registros foram carregados.',
  errorText: 'Não foi possível carregar os registros.',
  initialLimit: undefined,
  initialOrder: undefined,
  itemKey: undefined,
  limitOptions: () => [10, 25, 50, 100],
  showLimitSelector: false,
  storage: 'session',
  title: '',
});

type TEmits = {
  novoRegistro: [{ modoEdicao: boolean }];
};
const emits = defineEmits<TEmits>();

// Reativas
const infiniteListRef = ref<InstanceType<typeof GenericInfiniteList> | null>(null);

// Funções
function handleNovoRegistro(pParams: { modoEdicao: boolean }): void {
  emits('novoRegistro', pParams);
}

// Expose
defineExpose({
  infiniteListRef, // Expõe a lista para pages especificas acionarem reload apos filtros ou ações externas.
  loadMore: (...args: Parameters<InstanceType<typeof GenericInfiniteList>['loadMore']>) =>
    infiniteListRef.value?.loadMore(...args),
  resetAndLoad: () => infiniteListRef.value?.resetAndLoad(),
});
</script>
