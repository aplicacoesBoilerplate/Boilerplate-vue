<template>
  <v-dialog v-model="exibir" max-width="650">

    <v-form ref="formRef" v-model="formIsValid" @submit.prevent="submitForm()">
      <v-card :prepend-icon="dialogAutorizacoes.isEditing ? 'mdi-pencil-outline' : 'mdi-plus-circle-outline'"
        :title="`Editar autorização: ${autorizacao.idAutorizacao}`">
        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <v-textarea clearable label="Observação" variant="outlined" counter
                v-model="autorizacao.observacaoAutorizacao"
                :rules="[rules.requiredCondicionado(() => !autorizacao.aprovacaoSaida, 'Obrigatório se a saída não for autorizada')]"
              />
            </v-col>

            <v-col cols="12" class="d-flex justify-center">
              <v-switch v-model="autorizacao.aprovacaoSaida" :color="autorizacao.aprovacaoSaida ? 'success' : 'red'" label="Autorizar saída?" />
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
            Limpar
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
// Classes
import type { DialogAutorizacoesClass } from './ClassDialogAutorizacoes'
// Store
import { useSnackbarStore } from '@/stores/SnackbarStore'
// Models
// Services
import { autorizacoesServices } from '@/services/autorizacoesServices'
import { rules } from '@/utils/rules'
// Vue
import { computed, ref, watch } from 'vue'

const formRef = ref()
const formIsValid = ref(false)
const showPassword = ref(false)

interface Props {
  modelValue: DialogAutorizacoesClass
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: DialogAutorizacoesClass): void
}>()

const autorizacao = computed(() => props.modelValue.autorizacao)
const dialogAutorizacoes = computed(() => props.modelValue)
const exibir = computed({
  get: () => dialogAutorizacoes.value.show,
  set: (val) => dialogAutorizacoes.value.show = val
})

watch(exibir, (val) => {
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
  exibir.value = false // Exibir componente
}

async function updateAutorizacao() {
  const valid = await formRef.value.validate()
  if (!valid) return

  try {
    await autorizacoesServices.atualizarAutorizacao(autorizacao.value, autorizacao.value.idAutorizacao)
    useSnackbarStore().showSnackbar('Autorização modificada com sucesso!', 'success')
  } catch (error) {
    useSnackbarStore().showSnackbar(error, 'red')
    throw error
  }
  resetForm();
}

async function submitForm() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  await updateAutorizacao()
}

</script>
