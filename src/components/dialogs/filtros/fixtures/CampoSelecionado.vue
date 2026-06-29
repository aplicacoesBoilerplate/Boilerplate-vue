<template>
  <v-card-item class="pa-4">
    <template #prepend>
      <v-icon
        icon="mdi-filter-variant"
        size="x-large"
        class="mr-4 text-grey-darken-1"
      />
    </template>

    <v-card-title class="d-flex align-center font-weight-bold text-h6 text-darkText">
      <v-icon
        :icon="selectedField?.icone || 'mdi-filter-variant'"
        size="small"
        class="mr-2 text-primary"
      />
      {{ selectedField?.descricao || 'Nenhum campo selecionado' }}
    </v-card-title>

    <v-card-subtitle class="mt-1 text-body-2">
      Tipo de Dado: {{ formatarTiposDados(tiposCampoAtual) }}
    </v-card-subtitle>
  </v-card-item>

  <v-divider class="mx-4 mb-4 border-opacity-50" />
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed } from 'vue';

// Types e Interfaces
import type { ICampoFiltro } from '@/models/filters/ICampoFiltro';
import type { ETipoFiltro } from '@/models/filters/enums/ETipoFiltro';

type TProps = {
  selectedField: ICampoFiltro<any> | null;
};
const props = defineProps<TProps>();

// Funções
const formatarTiposDados = (tipos: ETipoFiltro[]) => {
  const mapaTraducao: Record<string, string> = {
    string: 'Texto',
    number: 'Numérico',
    boolean: 'Lógico (Sim/Não)',
    date: 'Data/Hora',
    select: 'Seleção',
  };
  return tipos.map((t) => mapaTraducao[t as string] || t).join(', ');
};

// Computadas
const tiposCampoAtual = computed(() => props.selectedField?.tipos ?? []);
</script>
