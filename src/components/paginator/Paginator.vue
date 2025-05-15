<template>
  <v-pagination v-model="paginaAtual" :length="paginator.totalPaginas.value" :total-visible="visiveis"
    :disabled="desabilitado" color="primary" density="comfortable" rounded @update:modelValue="emitirMudancaPagina" />

  <div class="d-flex justify-center mt-2">
    <v-number-input v-model="newLimite" control-variant="stacked" label="Limite" hide-input-details density="compact"
      variant="outlined" style="max-width: 200px;" :min="1" :max="100" class="mr-2" @change="setNewLimite()" />
  </div>

</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { usePaginator } from './paginatorStore'

const props = defineProps<{
  visiveis?: number
  desabilitado?: boolean
}>()

const paginator = usePaginator()
const newLimite = ref(paginator.filtrosPaginator.value.limite)
const paginaAtual = ref(paginator.filtrosPaginator.value.offset)

function setNewLimite() {
  paginator.setNewLimite(newLimite.value)
}

function emitirMudancaPagina(novaPagina: number) {
  paginator.setPaginaAtual(novaPagina)
}

watch(() => newLimite.value, () => {
  setNewLimite()
})

</script>
