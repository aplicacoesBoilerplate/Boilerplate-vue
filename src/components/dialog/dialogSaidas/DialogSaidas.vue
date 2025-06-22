<template>
  <v-dialog v-model="exibir" max-width="650">

    <v-form ref="formRef" v-model="formIsValid" @submit.prevent="submitForm()">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center mt-3">
          <span class="text-h6" v-if="!dialogSaidas.visualizando">
            <v-icon>{{
              dialogSaidas.isEditing ? 'mdi-pencil-outline' : 'mdi-plus-circle-outline'
              }}</v-icon>
            {{ dialogSaidas.isEditing ? `Editar saída: ${saida.idSaida}` : 'Solicitar nova saída' }}
          </span>

          <span v-else>
            <v-icon>mdi-information-outline</v-icon>
            Visualizar informações da saída
          </span>

        </v-card-title>

        <v-card-text>
          <v-row dense>
            <!-- Parâmetro que será usado para consultar as informações do funcionário que irá sair -->
            <v-col cols="12" md="6" class="d-flex justify-center">
              <v-number-input clearable v-model="saida.numeroRegistroFuncionario" :reverse="false"
                :rules="[rules.required]" controlVariant="stacked" label="N° de Registro do Funcionário*"
                :hideInput="false" inset :disabled="dialogSaidas.visualizando" variant="outlined">
                <template #prepend-inner>
                  <div>
                    <v-btn icon variant="text" size="small"
                      title="Buscar funcionario" @click="consultarRegistroDP(saida.numeroRegistroFuncionario)">
                      <v-icon>mdi-magnify</v-icon>
                    </v-btn>
                  </div>
                </template>
              </v-number-input>
            </v-col>

            <!-- Código do motivo -->
            <v-col cols="12" md="6" class="d-flex justify-center">
              <v-autocomplete clearable v-model="saida.motivoSaida" label="Motivo*" :items="apiMotivos?.registros"
                :item-title="'descricaoMotivo'" :item-value="'idMotivo'" :rules="[rules.required]"
                :disabled="dialogSaidas.visualizando" variant="outlined" />
            </v-col>

            <!-- Informação retornada pela consulta -->
            <v-col cols="12" md="6" class="d-flex justify-center">
              <InputUpperCase v-model:="saida.nomeFuncionario" :style="{
                inputDisabled: true,
                inputVariant: 'outlined',
                label: 'Nome do funcionário',
                maxWidth: 650,
                showLoading: showLoadingRegistro,
              }" />
            </v-col>

            <!-- Informação retornada pela consulta -->
            <v-col cols="12" md="6" class="d-flex justify-center">
              <InputUpperCase v-model:="saida.setorFuncionario" :style="{
                inputDisabled: true,
                inputVariant: 'outlined',
                label: 'Setor do funcionário',
                maxWidth: 650,
                showLoading: showLoadingRegistro,
              }" />
            </v-col>

            <!-- Data e hora de previsão de saída do funcionário -->
            <v-col cols="12" md="6" class="d-flex justify-center">
              <DateTimePicker v-model="saida.dataPrevisaoSaidaFuncionario" label="Previsão da saída"
                :disabled="dialogSaidas.visualizando" variant="outlined" />
            </v-col>

            <!-- Data e hora de previsão de retorno do funcionário -->
            <v-col cols="12" md="6" class="d-flex justify-center">
              <DateTimePicker v-model="saida.dataPrevisaoChegadaFuncionario" label="Previsão de retorno"
                :disabled="dialogSaidas.visualizando" variant="outlined" />
            </v-col>

            <!-- Campo de observação da saída -->
            <v-col cols="12">
              <InputTextUpperCase v-model:="saida.observacaoSaida" :style="{
                density: 'compact',
                inputDisabled: dialogSaidas.visualizando,
                inputVariant: 'outlined',
                label: 'Observação da saída',
                hideDetails: false,
                counter: true,
                maxWidth: 650,
              }" />
            </v-col>

            <!-- Usuário responsável por emitir a saída -->
            <v-col cols="12" class="d-flex justify-center" v-if="dialogSaidas.visualizando">
              <InputUpperCase v-model:="saida.nomeFuncionarioResponsavelSaida" :style="{
                inputDisabled: true,
                inputVariant: 'outlined',
                label: 'Emitida por:',
                maxWidth: 650,
              }" />
            </v-col>
          </v-row>

          <v-row dense class="p-0 m-0" v-if="!dialogSaidas.visualizando">
            <v-col cols="12">
              <small class="d-flex justify-center text-caption text-medium-emphasis pt-3">
                * indica campos obrigatórios
              </small>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider />

        <v-card-actions v-if="!dialogSaidas.visualizando">
          <v-btn color="warning" variant="plain" @click="clearFields()">
            <v-icon class="pt-1">mdi-refresh</v-icon>
            {{ dialogSaidas.isEditing ? 'Desfazer' : 'Limpar' }}
          </v-btn>
          <v-spacer />

          <v-btn color="red" variant="plain" @click="resetForm()">
            <v-icon class="pt-1">mdi-close</v-icon>
            Fechar
          </v-btn>
          <v-btn color="success" variant="tonal" :disabled="!formIsValid" type="submit">
            <v-icon class="pt-1">mdi-content-save-check</v-icon>
            Salvar
          </v-btn>
        </v-card-actions>

        <v-card-actions v-else>
          <v-btn color="info" variant="tonal" block @click="dialogSaidas.show = false">
            <v-icon class="pt-1">mdi-close</v-icon>
            Fechar informações
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>

  <DialogRegistroDP :model-value="dialogRegistros" @update:modelValue="clonarObjetoDialogRegistrosDP(dialogRegistros)" @selecionado="getValuesRegistroDP()" />

</template>

<script setup lang="ts">
// Componentes
import DateTimePicker from '@/components/DateTimePicker.vue'; // Componente visual para data e hora
import InputUpperCase from '@/components/InputUpperCase.vue'; // Componente visual para o input upper case
import InputTextUpperCase from '@/components/InputTextUpperCase.vue'; // Componente visual para o input text area upper case
import DialogRegistroDP from '@/components/dialog/dialogSaidas/dialogRegistroDP/DialogRegistroDP.vue'; // Componente visual para a busca de funcionários
// Classes
import { DialogRegistroDPClass } from './dialogRegistroDP/ClassDialogRegistroDP';
import { PaginatorClass } from '@/components/paginator/ClassPaginator'
import type { DialogSaidasClass } from './ClassDialogSaidas'
// Store
import { useSnackbarStore } from '@/stores/SnackbarStore'
// Models
import type { MotivoConsulta } from '@/models/motivosModels/MotivosModels'
import type { HeaderPaginatorModel } from '@/models/HeaderPaginatorModel'
// Services
import { firebirdServices } from '@/services/firebirdService';
import { motivosServices } from '@/services/motivosServices'
import { saidasServices } from '@/services/saidasServices'
import { rules } from '@/utils/rules'
// Vue
import { computed, onMounted, ref, watch } from 'vue'

const formRef = ref()
const formIsValid = ref(false)
const showPassword = ref(false)
const showLoadingRegistro = ref(false)
const dialogRegistros = ref(new DialogRegistroDPClass())
const paginadorClass = ref(new PaginatorClass({
  limite: 10,
  offset: 1,
  totalPaginas: 0,
  totalRegistros: 0,
  orderBy: 'DESC',
  search: ''
})) // Classe para a paginação

interface Props {
  modelValue: DialogSaidasClass
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: DialogSaidasClass): void
  (e: 'operacao-concluida'): void
}>()

const saida = computed(() => props.modelValue.saida)
const dialogSaidas = computed(() => props.modelValue)
const exibir = computed({
  get: () => dialogSaidas.value.show,
  set: (val) => dialogSaidas.value.show = val
})

onMounted(async () => {
  await getAllMotivos()
})

watch(exibir, (val) => {
  if (!val) {
    resetForm()
  }
  if (val && !dialogSaidas.value.isEditing) {
    clearFields();
  }
});

function clearFields() {
  dialogSaidas.value.clearFields()
}

function resetForm() {
  dialogSaidas.value.clearFields()
  dialogSaidas.value.closeDialog()
  showPassword.value = false // Exibir senha
  exibir.value = false // Exibir componente
}

async function cadastrarNovaSaida() {
  const valid = await formRef.value.validate()
  if (!valid) return

  try {
    await saidasServices.novaSaida(saida.value);
    useSnackbarStore().showSnackbar('Saída solicitada com sucesso!', 'success')
    emit('operacao-concluida')
  } catch (error) {
    useSnackbarStore().showSnackbar(error, 'red')
    throw error
  }
  resetForm();
}

async function updateSaida() {
  const valid = await formRef.value.validate()
  if (!valid) return

  try {
    await saidasServices.atualizarSaida(saida.value, saida.value.idSaida)
    useSnackbarStore().showSnackbar('Saída modificada com sucesso!', 'success')
    emit('operacao-concluida')
  } catch (error) {
    useSnackbarStore().showSnackbar(error, 'red')
    throw error
  }
  resetForm();
}

async function submitForm() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  dialogSaidas.value.isEditing ? await updateSaida() : await cadastrarNovaSaida()
}

// Consulta todos os motivos para alimentar o autocomplete
var apiMotivos = ref<HeaderPaginatorModel<MotivoConsulta>>()
async function getAllMotivos() {
  try {
    const response = await motivosServices.getMotivos(paginadorClass.value)

    apiMotivos.value = response
  } catch (error) {
    useSnackbarStore().showSnackbar(error, 'red')
    throw error
  }
}

async function consultarRegistroDP(codRegistro?: number) {
  try {
    showLoadingRegistro.value = true
    if (codRegistro) {
      const codRegistroConvertido = codRegistro.toString()
      const response = await firebirdServices.getRegistroDP(codRegistroConvertido)
      if (response) {
        saida.value.numeroRegistroFuncionario = response[0].registroDP
        saida.value.nomeFuncionario = response[0].nome
        saida.value.setorFuncionario = response[0].descricaoSetor
      }
    } else {
      dialogRegistros.value.openDialog()
    }
  } catch (error) {
    useSnackbarStore().showSnackbar(error, 'red')
  } finally {
    showLoadingRegistro.value = false
  }
}

function getValuesRegistroDP() {
  const valuesRegistro = dialogRegistros.value.getValues()

  if (valuesRegistro.registroDP > 0) {
    saida.value.numeroRegistroFuncionario = valuesRegistro.registroDP
    saida.value.nomeFuncionario = valuesRegistro.nome
    saida.value.setorFuncionario = valuesRegistro.descricaoSetor
  }
}

function clonarObjetoDialogRegistrosDP(val: DialogRegistroDPClass) {
  Object.assign(dialogRegistros, val)
}

</script>
