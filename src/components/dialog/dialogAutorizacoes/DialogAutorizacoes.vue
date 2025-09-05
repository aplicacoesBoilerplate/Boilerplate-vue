<template>
  <v-dialog v-model="dialogAutorizacoes.show" max-width="650">

    <v-form ref="formRef" v-model="formIsValid" @submit.prevent="submitForm()">
      <v-card :prepend-icon="dialogAutorizacoes.isEditing ? 'mdi-pencil-outline' : 'mdi-plus-circle-outline'"
        :title="`Editar autorização: ${dialogAutorizacoes.autorizacao.idAutorizacao}`">
        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <InputTextUpperCase v-model:="dialogAutorizacoes.autorizacao.observacaoAutorizacao" :style="{
                density: 'compact',
                inputVariant: 'outlined',
                label: 'Observação',
                hideDetails: false,
                counter: true,
                maxWidth: 650,
              }"
                :rules="[rules.requiredCondicionado(() => !dialogAutorizacoes.autorizacao.aprovacaoSaida, 'Obrigatório se a saída não for autorizada')]" />
            </v-col>
          </v-row>

          <v-row dense class="p-0 m-0">
            <v-col cols="12">
              <small class="d-flex justify-center text-caption text-medium-emphasis pt-3">
                * indica campos obrigatórios
              </small>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider />

        <v-card-actions class="sticky-actions">
          <v-btn color="warning" variant="plain" @click="clearFields()">
            <v-icon class="pt-1">mdi-refresh</v-icon>
            {{ dialogAutorizacoes.isEditing ? 'Desfazer' : 'Limpar' }}
          </v-btn>
          <v-spacer />

          <v-btn color="red" variant="plain" @click="resetForm()">
            <v-icon class="pt-1">mdi-close</v-icon>
            Fechar
          </v-btn>
          <v-btn color="success" variant="tonal" type="submit">
            <v-icon class="pt-1">mdi-content-save-check</v-icon>
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup lang="ts">
// Componentes
import InputTextUpperCase from '@/components/InputTextUpperCase.vue'; // Componente visual para o input upper case

// Classes
import { DialogAutorizacoesClass } from './ClassDialogAutorizacoes'
// Store
import { useSnackbarStore } from '@/stores/SnackbarStore'
// Services
import { autorizacoesServices } from '@/services/autorizacoesServices'
import { rules } from '@/utils/rules'
// Vue
import { ref, watch } from 'vue'

const formRef = ref()
const formIsValid = ref(false)
const showPassword = ref(false)

const dialogAutorizacoes = defineModel<DialogAutorizacoesClass>('dialogAutorizacoes', { required: true })

const emit = defineEmits<{
  (e: 'atualizar-autorizacoes'): void // Evento utilizado para chamar uma nova requisição get no componente pai
}>()

watch(() => dialogAutorizacoes.value.show, (val) => {
  if (!val) {
    resetForm()
  }
  if (val && !dialogAutorizacoes.value.isEditing) {
    clearFields();
  }
});

function clearFields() {
  dialogAutorizacoes.value.clearFields()
}

function resetForm() {
  dialogAutorizacoes.value.clearFields()
  dialogAutorizacoes.value.closeDialog()
  showPassword.value = false // Exibir senha
  dialogAutorizacoes.value.show = false // Exibir componente
}

async function atualizarAutorizacaoSaida() {
  const valid = await formRef.value.validate()
  if (!valid) return

  const atualizarAutorizacao = { ...dialogAutorizacoes.value.autorizacao }
  try {
    await autorizacoesServices.atualizarAutorizacao(atualizarAutorizacao, dialogAutorizacoes.value.autorizacao.idAutorizacao)
    useSnackbarStore().showSnackbar(`Autorização ${dialogAutorizacoes.value.autorizacao.idAutorizacao} ${dialogAutorizacoes.value.autorizacao.aprovacaoSaida ? 'concedida' : 'negada'} para a saída ${dialogAutorizacoes.value.autorizacao.idSaida}`, 'success')
  } catch (error) {
    useSnackbarStore().showSnackbar(error, 'red')
    throw error
  } finally {
    emit('atualizar-autorizacoes')
  }
  resetForm();
}

async function submitForm() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  await atualizarAutorizacaoSaida()
}
</script>
