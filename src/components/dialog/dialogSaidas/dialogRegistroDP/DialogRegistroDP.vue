<template>
  <v-dialog v-model="exibir" max-width="650">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center mt-3">
        <span class="text-h6">
          <v-icon>mdi-information-outline</v-icon>
          {{ paginadorClass.search != undefined && paginadorClass.search != '' ? `Buscar por:  ${paginadorClass.search}`: 'Consulte pelo funcionário' }}
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

      <v-divider />

      <!-- Loading -->
      <div class="d-flex justify-center" v-if="loading">
        <v-progress-circular color="primary" indeterminate />
      </div>

      <v-virtual-scroll :items="apiRegistrosDP" height="500" item-height="50">
        <template v-slot:default="{ item: registro }">
          <v-list-item :title="`${registro.registroDP} - ${registro.nome}`"
          :subtitle="`#Desc. setor: ${registro.descricaoSetor}`">

          <!-- Ícone de cartão de erro -->
          <template v-slot:prepend>
            <v-icon>mdi-card-account-details-outline</v-icon>
          </template>

          <!-- Botões de funcionalidades de mais informações e menu -->
          <template v-slot:append>
            <div class="pe-2">
              <v-btn size="small" variant="elevated" color="info" icon="mdi-account-check-outline"
                @click="definirRegistroPorBusca(registro)" title="Selecionar">
              </v-btn>
            </div>
          </template>

        </v-list-item>
        </template>
      </v-virtual-scroll>

      <v-divider />

      <v-card-actions>
        <v-btn color="red" variant="plain" @click="closeDialog()">
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
// Store
import { useSnackbarStore } from '@/stores/SnackbarStore'
// Models
// Services

// Vue
import { computed, onMounted, ref, watch } from 'vue'
import { firebirdServices } from '@/services/firebirdService';
import type { funcionarioRegistradoDP } from '@/models/firebirdModels/firebirdModels';

const loading = ref(false) // Carregamento
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
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: DialogRegistroDPClass): void
  (e: 'selecionado'): void
}>()
const exibir = computed({
  get: () => props.modelValue.show,
  set: (val) => props.modelValue.show = val
})

onMounted(async () => {
  await getRegistrosDP()
})

watch(exibir, (val) => {
  if (!val)
    closeDialog()
});

function closeDialog() {
  exibir.value = false
  apiRegistrosDP.value = undefined
  paginadorClass.value.search = ''
}

// Consulta todos os motivos para alimentar o autocomplete
var apiRegistrosDP = ref<Array<funcionarioRegistradoDP>>()
async function getRegistrosDP() {
  try {
    loading.value = true
    const search = paginadorClass.value.search
    if(search) {
      const response = await firebirdServices.getRegistroDP(search)
      apiRegistrosDP.value = response
    }
  } catch (error) {
    useSnackbarStore().showSnackbar(error, 'red')
    throw error
  } finally {
    loading.value = false
  }
}

function definirRegistroPorBusca(setRegistroDP: funcionarioRegistradoDP) {
  try {
    props.modelValue.setValues(setRegistroDP)
    emit('selecionado')
  } catch (error) {
    useSnackbarStore().showSnackbar(error, 'red')
  } finally {
    closeDialog()
  }
}
</script>
