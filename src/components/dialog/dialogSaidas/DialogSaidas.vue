<template>
  <v-dialog v-model="exibir" max-width="650">

    <v-form ref="formRef" v-model="formIsValid" @submit.prevent="submitForm()">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center mt-3">
          <span class="text-h6">
            <v-icon>{{ dialogSaidas.isEditing ? 'mdi-pencil-outline' : 'mdi-plus-circle-outline' }}</v-icon>
            {{ dialogSaidas.isEditing ? `Editar saída: ${saida.idSaida}` : 'Solicitar nova saída' }}
          </span>

          <!-- Campo para consultar os usuários pelo search -->
          <v-text-field clearable v-model="paginadorClass.search" density="compact" variant="outlined"
            placeholder="Buscar Funcionário" hide-details prepend-inner-icon="mdi-magnify" style="max-width: 300px" />
        </v-card-title>

        <v-card-text>
          <v-row dense>
            <v-col cols="12" md="6" class="d-flex justify-center">
              <v-number-input clearable v-model="saida.numeroRegistroFuncionario" :reverse="false"
                :rules="[rules.required]" controlVariant="stacked" label="N° de Registro do Funcionário*"
                :hideInput="false" inset />
            </v-col>

            <v-col cols="12" md="6" class="d-flex justify-center">
              <v-autocomplete clearable v-model="saida.motivoSaida" label="Motivo*" :items="apiMotivos?.registros"
                :item-title="'descricaoMotivo'" :item-value="'idMotivo'" :rules="[rules.required]" />
            </v-col>

            <v-col cols="12" md="6" class="d-flex justify-center">
              <v-text-field clearable v-model="saida.nomeFuncionario" label="Nome do Funcionário" disabled />
            </v-col>

            <v-col cols="12" md="6" class="d-flex justify-center">
              <v-text-field clearable v-model="saida.setorFuncionario" label="Setor do Funcionário" disabled />
            </v-col>

            <v-col cols="12" md="6" class="d-flex justify-center">
              <v-date-input v-model="saida.dataPrevisaoSaidaFuncionario" clearable label="Data de previsão da saída"
                prepend-icon="" prepend-inner-icon="$calendar" hint="Formato: dd/mm/yyyy" persistent-hint />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field v-model="horaPrevSaida" label="Hora da previsão de saída"
                prepend-inner-icon="mdi-clock-time-four-outline" hint="Formato: hh:mm" persistent-hint />
            </v-col>

            <v-col cols="12" md="6" class="d-flex justify-center">
              <v-date-input v-model="saida.dataPrevisaoChegadaFuncionario" clearable label="Data de previsão do retorno"
                prepend-icon="" prepend-inner-icon="$calendar" hint="Formato: dd/mm/yyyy" persistent-hint />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field v-model="horaPrevRetorno" label="Hora da previsão de retorno"
                prepend-inner-icon="mdi-clock-time-four-outline" hint="Formato: hh:mm" persistent-hint />
            </v-col>

            <v-col cols="12">
              <v-textarea clearable label="Observação saída" variant="outlined" counter
                v-model="saida.observacao_saida" />
            </v-col>
          </v-row>

          <v-row dense class="p-0 m-0">
            <v-col cols="12">
              <small class="d-flex justify-center text-caption text-medium-emphasis pt-3">* indica
                campos obrigatórios
              </small>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider />

        <v-card-actions>
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
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup lang="ts">
// Classes
import { PaginatorClass } from '@/components/paginator/ClassPaginator'
import type { DialogSaidasClass } from './ClassDialogSaidas'
// Store
import { useSnackbarStore } from '@/stores/SnackbarStore'
// Models
import type { MotivoConsulta } from '@/models/motivosModels/MotivosModels'
import type { HeaderPaginatorModel } from '@/models/HeaderPaginatorModel'
// Services
import { motivosServices } from '@/services/motivosServices'
import { saidasServices } from '@/services/saidasServices'
import { rules } from '@/utils/rules'
import dayjs from 'dayjs'
// Vue
import { computed, onMounted, ref, watch } from 'vue'
import type { SaidaConsulta } from '@/models/saidasModels/saidasModels'

const formRef = ref()
const formIsValid = ref(false)
const showPassword = ref(false)

const paginadorClass = ref(new PaginatorClass({ limite: 10, offset: 1, totalPaginas: 0, totalRegistros: 0, orderBy: 'DESC', search: '' })) // Classe para a paginação

// Constantes para as datas
const horaPrevSaida = ref(null)
const horaPrevRetorno = ref(null)
const dataSaida = ref<Date | null>(null)
const formatarData = (date: Date) => {
  return date ? dayjs(date).format('DD/MM/YYYY') : ''
}

const parseData = (str: string) => {
  const [day, month, year] = str.split('/')
  if (day && month && year) {
    return new Date(`${year}-${month}-${day}`)
  }
  return null
}

interface Props {
  modelValue: DialogSaidasClass
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: DialogSaidasClass): void
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

function formatarDataParaAPI(saida: SaidaConsulta): SaidaConsulta {
  const novaSaida = { ...saida }
  const dataHoraPSaida = dayjs(`${saida.dataPrevisaoSaidaFuncionario} ${horaPrevSaida}`, 'DD/MM/YYYY HH:mm:ss').toDate()
  const dataHoraPRetorno = dayjs(`${saida.dataPrevisaoChegadaFuncionario} ${horaPrevRetorno}`, 'DD/MM/YYYY HH:mm:ss').toDate()

  // novaSaida.dataPrevisaoSaidaFuncionario = dataHoraPSaida
  // if (saida.dataPrevisaoChegadaFuncionario)
  //   novaSaida.dataPrevisaoChegadaFuncionario = dataHoraPRetorno

  console.log('Data sem formatação:', saida.dataPrevisaoSaidaFuncionario, 'Hora:', horaPrevSaida, 'Data formatada:', dataHoraPSaida, 'Body:', novaSaida)
  return novaSaida
}

async function cadastrarNovaSaida() {
  const valid = await formRef.value.validate()
  if (!valid) return

  try {
    await saidasServices.novaSaida(formatarDataParaAPI(saida.value));
    useSnackbarStore().showSnackbar('Saída solicitada com sucesso!', 'success')
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
    await saidasServices.atualizarSaida(formatarDataParaAPI(saida.value), saida.value.idSaida)
    useSnackbarStore().showSnackbar('Saída modificada com sucesso!', 'success')
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

</script>
