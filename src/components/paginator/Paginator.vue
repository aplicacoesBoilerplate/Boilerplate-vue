<template>
  <v-pagination v-model="paginaInterna" :length="totalPaginas" :total-visible="visiveis" :disabled="desabilitado"
    color="primary" density="comfortable" rounded @update:modelValue="emitirMudancaPagina" />

  <div class="d-flex justify-center mt-2">
    <v-number-input v-model="newLimite" control-variant="stacked" label="Limite" hide-input-details
      density="compact" variant="outlined" style="max-width: 200px;" :min="1" :max="100" class="mr-2"/>
    <v-btn icon="mdi-update" size="x-small" class="mt-1" @click="setNewLimite()"/>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { usePaginator } from './paginatorStore'

const props = defineProps<{
  visiveis?: number
  desabilitado?: boolean
}>()

const {
  paginaAtual,
  setPaginaAtual,
  totalPaginas,
} = usePaginator()

const paginator = usePaginator()
const newLimite = ref(paginator.filtrosPaginator.value.limite)

function setNewLimite() {
  paginator.setNewLimite(newLimite.value)
}

const paginaInterna = ref(paginaAtual.value)

watch(paginaAtual, (val) => {
  paginaInterna.value = val
})

function emitirMudancaPagina(novaPagina: number) {
  setPaginaAtual(novaPagina)
}
</script>
