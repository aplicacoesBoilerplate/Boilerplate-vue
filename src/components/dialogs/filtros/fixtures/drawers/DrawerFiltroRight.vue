<template>
  <v-navigation-drawer
    v-model="toggleRightDrawer"
    :mobileBreakpoint="0"
    location="right"
  >
    <v-list-item
      v-if="genericFilterStore.appliedCount > 0"
      title="Filtros aplicados"
    />

    <v-divider />

    <ItemFiltro
      v-for="(filtro, i) in genericFilterStore.filtersApplied"
      :key="i"
      :filtro="filtro"
      :index="i"
      :camposDisponiveis="camposDisponiveis"
      @onEditar="onEditarFiltro"
      @onRemover="genericFilterStore.removeFilter($event)"
    />
  </v-navigation-drawer>
</template>

<script setup lang="ts">
// Stores
import { useGenericFilterStore } from '@/stores/genericFilter.store';

// Types e Interfaces
import type { ICampoFiltro } from '@/models/filters/ICampoFiltro';

// Componentes
import ItemFiltro from '../ItemFiltro.vue';

type TProps = {
  camposDisponiveis: ICampoFiltro<any>[];
};
const props = defineProps<TProps>();

// Stores
const genericFilterStore = useGenericFilterStore();

// Reativas
const toggleRightDrawer = defineModel<boolean>('toggleRightDrawer', { required: true });
const selectedField = defineModel<ICampoFiltro<any> | null>('selectedField', { required: true });

// Funções
function onEditarFiltro(index: number) {
  const filtro = genericFilterStore.filtersApplied[index];
  if (filtro && filtro.campo) {
    const campoParaEditar = props.camposDisponiveis.find((c) => c.valor === filtro.campo);
    if (campoParaEditar) {
      selectedField.value = campoParaEditar;
    }
  }

  genericFilterStore.editFilter(index);
}

</script>
