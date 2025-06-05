<template>
  <div class="d-flex justify-center align-center flex-column mt-4">
    <v-pagination :model-value="paginator.offset" @update:model-value="mudarPagina"
      :length="paginator.totalPaginas || 1" :total-visible="5" color="primary" />
  </div>

  <span class="d-flex justify-center mt-2">
    Total: {{ paginator.totalRegistros }}
  </span>

  <div class="d-flex justify-center mt-2">
    <div class="pr-2">
      <v-btn icon size="small" color="primary" title="Buscar">
        <v-icon class="d-flex justify-center" @click="onBuscar()">mdi-update</v-icon>
      </v-btn>
    </div>

    <v-number-input v-model="paginator.limite" label="Limite" :max="100" hide-details hide-input-details
      control-variant="stacked" density="compact" variant="outlined" style="max-width: 200px;" class="mr-2" />
  </div>

</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { PaginatorClass } from './ClassPaginator';




const paginator = defineModel<PaginatorClass>('paginator', {
  required: true
})

function onBuscar() {
  emit('onBuscar')
}

const emit = defineEmits<{
  (e: 'onBuscar'): void
  (e: 'mudouPagina', novaPagina: number): void
}>()


function mudarPagina(novo: number) {
  emit('mudouPagina', novo)
}

</script>
