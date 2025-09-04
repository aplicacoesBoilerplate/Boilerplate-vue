<template>
  <v-dialog v-model="dialogSaidas.show" max-width="650">

    <v-form ref="formRef" v-model="formIsValid" @submit.prevent="submitForm()">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center mt-3">
          <span class="text-h6" v-if="!dialogSaidas.visualizando">
            <v-icon>{{
              dialogSaidas.isEditing ? 'mdi-pencil-outline' : 'mdi-plus-circle-outline'
              }}</v-icon>
            {{ dialogSaidas.isEditing ? `Editar saída: ${dialogSaidas.saida.idSaida}` : 'Solicitar nova saída' }}
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
              <v-number-input clearable v-model="dialogSaidas.saida.numeroRegistroFuncionario" :reverse="false"
                :rules="[rules.required]" controlVariant="stacked" label="N° de Registro do Funcionário*"
                :hideInput="false" inset :disabled="dialogSaidas.visualizando" variant="outlined">
                <template #prepend-inner>
                  <div>
                    <v-btn icon variant="text" size="small" title="Buscar funcionario"
                      @click="consultarRegistroDP(dialogSaidas.saida.numeroRegistroFuncionario)">
                      <v-icon>mdi-magnify</v-icon>
                    </v-btn>
                  </div>
                </template>
              </v-number-input>
            </v-col>

            <!-- Código do motivo -->
            <v-col cols="12" md="6" class="d-flex justify-center">
              <v-autocomplete clearable v-model="dialogSaidas.saida.motivoSaida" label="Motivo*" :items="apiMotivos?.registros"
                :item-title="'descricaoMotivo'" :item-value="'idMotivo'" :rules="[rules.required]"
                :disabled="dialogSaidas.visualizando" variant="outlined" />
            </v-col>

            <!-- Informação retornada pela consulta -->
            <v-col cols="12" md="6" class="d-flex justify-center">
              <InputUpperCase v-model:="dialogSaidas.saida.nomeFuncionario" :style="{
                inputDisabled: true,
                inputVariant: 'outlined',
                label: 'Nome do funcionário',
                maxWidth: 650,
                showLoading: showLoadingRegistro,
              }" />
            </v-col>

            <!-- Informação retornada pela consulta -->
            <v-col cols="12" md="6" class="d-flex justify-center">
              <InputUpperCase v-model:="dialogSaidas.saida.setorFuncionario" :style="{
                inputDisabled: true,
                inputVariant: 'outlined',
                label: 'Setor do funcionário',
                maxWidth: 650,
                showLoading: showLoadingRegistro,
              }" />
            </v-col>

            <!-- Data e hora de previsão de saída do funcionário -->
            <v-col cols="12" md="6" class="d-flex justify-center">
              <DateTimePicker v-model="dialogSaidas.saida.dataPrevisaoSaidaFuncionario" label="Previsão da saída"
                :disabled="dialogSaidas.visualizando" variant="outlined" />
            </v-col>

            <!-- Data e hora de previsão de retorno do funcionário -->
            <v-col cols="12" md="6" class="d-flex justify-center">
              <DateTimePicker v-model="dialogSaidas.saida.dataPrevisaoChegadaFuncionario" label="Previsão de retorno"
                :disabled="dialogSaidas.visualizando" variant="outlined" />
            </v-col>

            <!-- Campo de observação da saída -->
            <v-col cols="12">
              <InputTextUpperCase v-model:="dialogSaidas.saida.observacaoSaida" :style="{
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
            <v-col cols="6" class="d-flex justify-center" v-if="dialogSaidas.visualizando">
              <InputUpperCase v-model:="dialogSaidas.saida.statusSaida" :style="{
                inputDisabled: true,
                inputVariant: 'outlined',
                label: 'Status saída:',
                maxWidth: 650,
              }" />
            </v-col>

            <v-col cols="6" class="d-flex justify-center" v-if="dialogSaidas.visualizando">
              <InputUpperCase v-model:="dialogSaidas.saida.nomeFuncionarioResponsavelSaida" :style="{
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

  <DialogRegistroDP v-model:dialog-registros="dialogRegistros" @selecionado="getValuesRegistroDP()" />

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
import { DialogSaidasClass } from './ClassDialogSaidas'
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
import { onMounted, ref, watch } from 'vue'

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

const dialogSaidas = defineModel<DialogSaidasClass>('dialogSaidas', { required: true })

const emit = defineEmits<{
  (e: 'operacao-concluida'): void
}>()

onMounted(async () => {
  await getAllMotivos()
})

watch(dialogSaidas.value, (val) => {
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
  dialogSaidas.value.show = false // Exibir componente
}

async function cadastrarNovaSaida() {
  const valid = await formRef.value.validate()
  if (!valid) return

  try {
    await saidasServices.novaSaida(dialogSaidas.value.saida);
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
    await saidasServices.atualizarSaida(dialogSaidas.value.saida, dialogSaidas.value.saida.idSaida)
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
      const search = codRegistro.toString()
      const response = await firebirdServices.getRegistroDP(search)
      console.log("response", response);
      if (response) {
        dialogSaidas.value.saida.numeroRegistroFuncionario = response[0].registroDP
        dialogSaidas.value.saida.nomeFuncionario = response[0].nome
        dialogSaidas.value.saida.setorFuncionario = response[0].descricaoSetor
      }
    } else {
      dialogRegistros.value.openDialog()
    }
  } catch (error) {
    useSnackbarStore().showSnackbar(error, 'red')
  } finally {
    showLoadingRegistro.value = false
    console.log("saída", dialogSaidas.value.saida);
  }
}

function getValuesRegistroDP() {
  const valuesRegistro = dialogRegistros.value.getValues()

  if (valuesRegistro.registroDP > 0) {
    dialogSaidas.value.saida.numeroRegistroFuncionario = valuesRegistro.registroDP
    dialogSaidas.value.saida.nomeFuncionario = valuesRegistro.nome
    dialogSaidas.value.saida.setorFuncionario = valuesRegistro.descricaoSetor
  }
}

</script>
