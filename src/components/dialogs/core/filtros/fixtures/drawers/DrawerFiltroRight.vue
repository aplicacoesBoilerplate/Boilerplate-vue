<template>
  <v-navigation-drawer
    v-model="toggleRightDrawer"
    :temporary="!mdAndUp"
    :mobileBreakpoint="0"
    location="right"
  >
    <v-list-item
      v-if="genericFilterStore.appliedCount > 0"
      :title="t('components.drawerFiltroRight.filtrosAplicados')"
    />

    <v-divider />

    <ItemFiltro
      v-for="(filtro, i) in genericFilterStore.filtersApplied"
      :key="i"
      :filtro="filtro"
      :index="i"
      :camposDisponiveis="camposDisponiveis"
      class="ma-1"
      @onEditar="editarFiltro"
      @onRemover="genericFilterStore.removeFilter($event)"
    />
  </v-navigation-drawer>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { useI18n } from 'vue-i18n';
import { useDisplay } from 'vuetify';

// Stores
import { useGenericFilterStore } from '@/stores/genericFilter.store';

// Types e Interfaces
import type { ICampoFiltro } from '@/models/filters/ICampoFiltro';

// Componentes
import ItemFiltro from '../ItemFiltro.vue';

type TProps = {
  camposDisponiveis: ICampoFiltro<any>[];
};
defineProps<TProps>();

// Stores
const genericFilterStore = useGenericFilterStore();

// Composables
const { mdAndUp } = useDisplay();
const { t } = useI18n();

// Reativas
const toggleRightDrawer = defineModel<boolean>('toggleRightDrawer', { required: true });

// Funções
function editarFiltro(pIndex: number): void {
  genericFilterStore.editFilter(pIndex);

  if (!mdAndUp.value) {
    toggleRightDrawer.value = false;
  }
}
</script>
