<template>
  <div class="d-flex justify-center align-center flex-column mt-4">
    <v-pagination :model-value="paginator.offset" @update:model-value="mudarPagina"
      :length="paginator.totalPaginas || 1" :total-visible="5" color="primary" />
  </div>

  <span class="d-flex justify-center mt-2">
    Total: {{ paginator.totalRegistros }}
  </span>

  <div class="d-flex justify-center mt-2">
    <v-number-input clearable v-model="paginator.limite" label="Limite" :min="1" :max="100" hide-details
      control-variant="stacked" density="compact" variant="outlined" style="max-width: 250px;">
      <template #prepend-inner>
        <v-btn icon variant="text" size="small" :disabled="!paginator.limite" @click="onBuscar()">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </template>
    </v-number-input>
  </div>

</template>

<script setup lang="ts">
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
