<template>
  <v-list-item :title="filtro.campo ?? ''">
    <template #prepend>
      <div
        class="d-flex align-center"
        style="width: 30px"
      >
        <v-icon
          :icon="getIconCampo()"
          size="26"
        />
      </div>
    </template>

    <template #subtitle>
      <v-icon :icon="getIconOperador()" />
      {{ filtro.valor }}
    </template>

    <template #append>
      <v-row
        dense
        class="d-flex align-center flex-row"
      >
        <v-btn
          icon="mdi-pencil"
          color="indigo-darken-4"
          variant="text"
          density="compact"
          @click="$emit('onEditar', index)"
        />

        <v-btn
          icon="mdi-trash-can"
          color="error"
          variant="text"
          density="compact"
          @click="$emit('onRemover', index)"
        />
      </v-row>
    </template>
  </v-list-item>
</template>

<script setup lang="ts">
// Types e Interfaces
import type { IFiltrosConsulta } from '@/models/filters/IFiltrosConsulta';
import type { ICampoFiltro } from '@/models/filters/ICampoFiltro';

// Constantes
import { MAPEAMENTO_OPERADORES } from '@/models/filters/enums/EOperadoresFiltro';

type TProps = {
  filtro: IFiltrosConsulta;
  index: number;
  camposDisponiveis: ICampoFiltro<any>[];
};

const props = defineProps<TProps>();

type TEmits = {
  onEditar: [index: number];
  onRemover: [index: number];
};
defineEmits<TEmits>();

// Funções
const getIconCampo = () => {
  if (props.filtro.campo) {
    const campoEncontrado = props.camposDisponiveis.find((c) => c.valor === props.filtro.campo);
    return campoEncontrado?.icone || 'mdi-filter-variant';
  }
};

const getIconOperador = () => {
  if (props.filtro.condicao) {
    const operadorEncontrado = MAPEAMENTO_OPERADORES.find((o) => o.valor === props.filtro.condicao);
    return operadorEncontrado?.icone || 'mdi-filter';
  }
};
</script>
