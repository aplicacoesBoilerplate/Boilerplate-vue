<template>
  <v-dialog v-model="exibir" max-width="650">

    <v-form ref="formRef" v-model="formIsValid" @submit.prevent="submitForm()">
      <v-card :prepend-icon="dialogMotivos.isEditing ? 'mdi-pencil-outline' : 'mdi-plus-circle-outline'"
        :title="dialogMotivos.isEditing ? `Editar motivo: ${motivo.idMotivo}` : 'Criar novo motivo'">
        <v-card-text>
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field clearable v-model="motivo.descricaoMotivo" :counter="100"
                :rules="[rules.required, rules.max]" label="Descrição motivo*" required />
            </v-col>

            <v-col cols="12" md="6" class="d-flex justify-center">
              <v-autocomplete clearable v-model="motivo.categoriaMotivo" label="Categoria*" :items="categoriasMotivo"
                :rules="[rules.required, rules.includes(categoriasMotivo)]" />
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
import type { DialogMotivosClass } from './ClassDialogMotivos'
// Store
import { useSnackbarStore } from '@/stores/SnackbarStore'
// Models
import { CategoriasMotivo } from '@/models/motivosModels/MotivosModels'
// Services
import { motivosServices } from '@/services/motivosServices'
import { rules } from '@/utils/rules'
// Vue
import { computed, ref, watch } from 'vue'

const formRef = ref()
const formIsValid = ref(false)
const showPassword = ref(false)
const categoriasMotivo = CategoriasMotivo

interface Props {
  modelValue: DialogMotivosClass
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: DialogMotivosClass): void
}>()

const motivo = computed(() => props.modelValue.motivo)
const dialogMotivos = computed(() => props.modelValue)
const exibir = computed({
  get: () => dialogMotivos.value.show,
  set: (val) => dialogMotivos.value.show = val
})

watch(exibir, (val) => {
  if (!val) {
    resetForm()
  }
  if (val && !dialogMotivos.value.isEditing) {
    clearFields();
  }
});

function clearFields() {
  dialogMotivos.value.clearFields()
}

function resetForm() {
  dialogMotivos.value.clearFields()
  dialogMotivos.value.closeDialog()
  showPassword.value = false // Exibir senha
  exibir.value = false // Exibir componente
}

async function cadastrarNovoMotivo() {
  const valid = await formRef.value.validate()
  if (!valid) return

  try {
    await motivosServices.createMotivo(motivo.value);
    useSnackbarStore().showSnackbar('Motivo criado com sucesso!', 'success')
  } catch (error) {
    useSnackbarStore().showSnackbar(error, 'red')
    throw error
  }
  resetForm();
}

async function updateMotivo() {
  const valid = await formRef.value.validate()
  if (!valid) return

  try {
    await motivosServices.updateMotivo(motivo.value, motivo.value.idMotivo)
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
  dialogMotivos.value.isEditing ? await updateMotivo() : await cadastrarNovoMotivo()
}

</script>
