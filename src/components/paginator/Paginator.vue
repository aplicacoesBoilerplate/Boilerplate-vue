<template>
  <div class="d-flex justify-center align-center flex-column mt-4">
    <v-pagination :model-value="paginador.offset" @update:model-value="mudarPagina"
      :length="paginador.totalPaginas || 1" :total-visible="5" color="primary" />
  </div>

  <span class="d-flex justify-center mt-2">
    Total: {{ paginador.totalRegistros }}
  </span>

  <div class="d-flex justify-center mt-2">
    <v-number-input :model-value="paginador.limite || 10" @update:model-value="mudarLimite" label="Limite" :min="1"
      :max="100" hide-details hide-input-details control-variant="stacked" density="compact" variant="outlined"
      style="max-width: 200px;" class="mr-2" />
  </div>

</template>

<!-- <script setup lang="ts">
import type { FiltroPaginacao } from '@/models/FiltersModels';
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: FiltroPaginacao
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'mudouLimite', novoLimite: number): void
  (e: 'mudouPagina', novaPagina: number): void
}>()

const limite = ref(props.modelValue.limite)
const pagina = ref(props.modelValue.offset)
const totalPaginas = ref(props.modelValue.totalPaginas)
const totalRegistros = ref(props.modelValue.totalRegistros)

watch(() => props.modelValue, (novoValor) => {
  limite.value = novoValor.limite
  pagina.value = novoValor.offset
  totalPaginas.value = novoValor.totalPaginas
})

function mudarLimite() {
  emit('mudouLimite', limite.value)
}

function mudarPagina(novaPagina: number) {
  emit('mudouPagina', novaPagina)
}
</script> -->


<script setup lang="ts">
import { computed } from 'vue'
import type { PaginatorClass } from './ClassPaginator';

interface Props {
  modelValue: PaginatorClass
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: PaginatorClass): void
  (e: 'mudouLimite', novoLimite: number): void
  (e: 'mudouPagina', novaPagina: number): void
}>()

const paginador = computed(() => props.modelValue)

function mudarLimite(novo: number) {
  paginador.value.atualizarLimite(novo)
  emit('mudouLimite', novo)
  emit('update:modelValue', paginador.value)
}

function mudarPagina(novo: number) {
  paginador.value.atualizarPagina(novo)
  emit('mudouPagina', novo)
  emit('update:modelValue', paginador.value)
}
</script>
