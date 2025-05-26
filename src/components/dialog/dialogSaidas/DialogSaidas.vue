<template>
  <v-dialog v-model="exibir" max-width="650">

    <v-form ref="formRef" v-model="formIsValid" @submit.prevent="submitForm()">
      <v-card :prepend-icon="dialogSaidas.isEditing ? 'mdi-pencil-outline' : 'mdi-plus-circle-outline'"
        :title="dialogSaidas.isEditing ? `Editar motivo: ${saida.idSaida}` : 'Criar novo motivo'">
        <v-card-text>
          <v-row dense>
            <v-col cols="12" md="6">
              <v-textarea clearable label="Observação" variant="outlined" counter
                v-model="saida.observacao_saida"
                :rules="[rules.required]" required
              />
            </v-col>

            <!-- <v-col cols="12" md="6" class="d-flex justify-center">
              <v-autocomplete clearable v-model="saida.motivoSaida" label="Categoria*" :items="Motivos"
                :rules="[rules.required, rules.includes(Motivos)]" />
            </v-col> -->
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
import type { DialogSaidasClass } from './ClassDialogSaidas'
// Store
import { useSnackbarStore } from '@/stores/SnackbarStore'
// Models
// Services
import { saidasServices } from '@/services/saidasServices'
import { rules } from '@/utils/rules'
// Vue
import { computed, ref, watch } from 'vue'
import type { MotivoConsulta } from '@/models/motivosModels/MotivosModels'

const formRef = ref()
const formIsValid = ref(false)
const showPassword = ref(false)

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
    useSnackbarStore().showSnackbar('Motivo modificado com sucesso!', 'success')
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

const Motivos: MotivoConsulta = {idMotivo: 1, categoriaMotivo: '', descricaoMotivo: ''}

</script>
