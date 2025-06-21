<template>
  <v-dialog v-model="exibir" max-width="650">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center mt-3">
        <span class="text-h6">
          <v-icon>mdi-information-outline</v-icon>
          {{ `Resultados para a busca: ${paginadorClass.search}` }}
        </span>

        <!-- Campo para consultar os registros pelo search -->
        <InputUpperCase v-model:="paginadorClass.search" :style="{
          icon: 'mdi-magnify',
          density: 'compact',
          inputVariant: 'outlined',
          btnVariant: 'text',
          label: 'Buscar funcionário',
          showPrepend: true,
          maxWidth: 300,
          hint: 'Nome do funcionário ou N° do registro',
          btnDisabled: !paginadorClass.search
        }" @on-prepend-click="getRegistrosDP()" />
      </v-card-title>

      <v-card-text>
        {{ apiRegistrosDP }}
      </v-card-text>
      <v-divider />

      <v-card-actions>
        <v-btn color="red" variant="plain" @click="resetForm()">
          <v-icon class="pt-1">mdi-close</v-icon>
          Fechar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
// Componentes
import InputUpperCase from '@/components/InputUpperCase.vue'; // Componente visual para o input upper case
// Classes
import { PaginatorClass } from '@/components/paginator/ClassPaginator'
import type { DialogRegistroDPClass } from './ClassDialogRegistroDP'
import { DialogSaidasClass } from '@/components/dialog/dialogSaidas/ClassDialogSaidas'
// Store
import { useSnackbarStore } from '@/stores/SnackbarStore'
// Models
import type { HeaderPaginatorModel } from '@/models/HeaderPaginatorModel'
// Services

// Vue
import { computed, onMounted, ref, watch } from 'vue'
import { firebirdServices } from '@/services/firebirdService';
import type { funcionarioRegistradoDP } from '@/models/firebirdModels/firebirdModels';

const paginadorClass = ref(new PaginatorClass({
  limite: 10,
  offset: 1,
  totalPaginas: 0,
  totalRegistros: 0,
  orderBy: 'DESC',
  search: ''
})) // Classe para a paginação

interface Props {
  modelValue: DialogRegistroDPClass
  saidaRegistroDP? : DialogSaidasClass
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: DialogRegistroDPClass): void
}>()

const funcionarioRegistroDP = computed(() => props.modelValue.funcionarioRegistradoDP)
const dialogRegistro = computed(() => props.modelValue)
const exibir = computed({
  get: () => dialogRegistro.value.show,
  set: (val) => dialogRegistro.value.show = val
})

onMounted(async () => {
  await getRegistrosDP()
})

watch(exibir, (val) => {
  if (!val)
    resetForm()
});

function resetForm() {
  exibir.value = false
}

// Consulta todos os motivos para alimentar o autocomplete
var apiRegistrosDP = ref<HeaderPaginatorModel<funcionarioRegistradoDP>>()

async function getRegistrosDP() {
  try {
    const search = paginadorClass.value.search
    if(search) {
      const response = await firebirdServices.getRegistroDP(search)
      apiRegistrosDP.value = response
    }
  } catch (error) {
    useSnackbarStore().showSnackbar(error, 'red')
    throw error
  }
}

async function definirRegistroPorBusca(registroDP: funcionarioRegistradoDP) {
  if (props.saidaRegistroDP)
    props.saidaRegistroDP.definirRegistroPorBusca(registroDP)
}

</script>
