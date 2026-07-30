<template>
  <v-data-table
    v-model:sortBy="ordenacaoSincronizada"
    :density="density"
    :multiSort="multiSort"
    :loading="loading"
    :items="registros"
    :fixedHeader="fixedHeader"
    :headers="headersMarcados"
    :loadingText="loadingText"
    :height="height"
    :class="customClass"
    :itemsPerPage="disablePagination ? -1 : 10"
  >
    <!-- Forma de registrar os slots de acordo com o que for enviado pelo pai, permitindo registro de qualquer slot nativo da v-data-table -->
    <template
      v-for="(_, slotName) in $slots"
      #[slotName]="slotProps"
    >
      <slot
        :name="slotName"
        v-bind="slotProps || {}"
      ></slot>
    </template>

    <!-- Exibição condicional do slot de paginação -->
    <template
      v-if="disablePagination"
      #bottom
    ></template>
  </v-data-table>
</template>

<script setup lang="ts" generic="T">
// Ecossistema Vue
import { computed, onBeforeMount } from 'vue';

// Types e Interfaces
import type { IPropsBaseDataTable } from '@/models/components/props/IPropsBaseDataTable';

const props = withDefaults(defineProps<IPropsBaseDataTable<T> & { onLoad?: () => Promise<T[] | void> }>(), {
  density: 'compact',
  multiSort: true,
  fixedHeader: true,
  disablePagination: true,
  loadingText: 'Carregando registros...',
  height: undefined,
  customClass: '',
});

type TEmits = {
  (e: 'update:camposOrdenacao', value: any[]): void;
};
const emits = defineEmits<TEmits>();

// Computadas
/**
 * Propriedade computada com get/set para manter a reatividade bidirecional (v-model)
 * da ordenação selecionada no frontend, que pode ser despachada para o backend.
 */
const ordenacaoSincronizada = computed({
  get: () => props.camposOrdenacao || [],
  set: (novoValor) => emits('update:camposOrdenacao', novoValor),
});

// Lifecycle Hooks
onBeforeMount(async () => {
  if (props.onLoad) await props.onLoad();
});
</script>
