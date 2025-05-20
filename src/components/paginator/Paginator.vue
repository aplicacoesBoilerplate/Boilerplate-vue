<template>
  <v-pagination v-model="valorCampos.offset" :length="valorCampos.totalPaginas" :total-visible="visiveis"
    :disabled="props.disabled" color="primary" density="comfortable" rounded @update:modelValue="emitirMudancaPagina" />

  <div class="d-flex justify-center mt-2">
    <v-number-input v-model="valorCampos.limite" control-variant="stacked" label="Limite" hide-input-details density="compact"
      variant="outlined" style="max-width: 200px;" :min="1" :max="100" class="mr-2" @change="setNewLimite()" />
  </div>

</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { usePaginator } from './paginatorStore'
import type { FiltroPaginacao } from '@/models/FiltersModels';

const props = withDefaults(
  defineProps<{
    valorCampos: FiltroPaginacao,
    disabled?: boolean,
    visiveis?: number
  }>(),
  {
    disabled: false,
    visiveis: 5
  }
);

const paginator = usePaginator()
const newLimite = ref(paginator.filtrosPaginator.value.limite)
const paginaAtual = ref(paginator.filtrosPaginator.value.offset)



function setNewLimite() {
  paginator.setNewLimite(newLimite.value)
}

function emitirMudancaPagina(novaPagina: number) {
  props.valorCampos.offset = novaPagina
}

watch(() => newLimite.value, () => {
  setNewLimite()
})

</script>
