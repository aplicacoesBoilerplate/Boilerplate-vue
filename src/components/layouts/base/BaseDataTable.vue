<template>
  <v-data-table
    v-model:sortBy="ordenacaoSincronizada"
    :density="density"
    :multiSort="multiSort"
    :loading="loading"
    :items="registros"
    :fixedHeader="fixedHeader"
    :headers="headersMarcados"
    :loadingText="loadingTextExibido"
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
import { useI18n } from 'vue-i18n';

// Types e Interfaces
import type { IPropsBaseDataTable } from '@/models/components/props/IPropsBaseDataTable';
import type { DataTableSortItem } from 'vuetify';

const props = withDefaults(defineProps<IPropsBaseDataTable<T> & { onLoad?: () => Promise<T[] | void> }>(), {
  density: 'compact',
  multiSort: true,
  fixedHeader: true,
  disablePagination: true,
  loadingText: undefined,
  height: undefined,
  customClass: '',
  onLoad: undefined,
});

type TEmits = {
  (e: 'update:camposOrdenacao', value: DataTableSortItem[]): void;
};
const emits = defineEmits<TEmits>();
const { t } = useI18n();

// Computadas
const loadingTextExibido = computed(() => props.loadingText ?? t('common.dataTable.loading'));

/**
 * Propriedade computada com get/set para manter a reatividade bidirecional (v-model)
 * da ordenação selecionada no frontend, que pode ser despachada para o backend.
 */
const ordenacaoSincronizada = computed({
  get: () => props.camposOrdenacao || [],
  set: (pNovoValor) => emits('update:camposOrdenacao', pNovoValor),
});

// Lifecycle Hooks
onBeforeMount(async () => {
  if (props.onLoad) await props.onLoad();
});
</script>
