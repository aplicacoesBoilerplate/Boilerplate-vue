<template>
  <v-dialog v-model="exibir" max-width="650">

    <v-form ref="formRef" v-model="formIsValid" @submit.prevent="submitForm()">
      <v-card :prepend-icon="dialogCategorias.isEditing ? 'mdi-pencil-outline' : 'mdi-plus-circle-outline'"
        :title="dialogCategorias.isEditing ? `Editar categoria: ${categoria.idCategoria}` : 'Criar nova categoria'">
        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <InputUpperCase v-model:="categoria.descricaoCategoria" :style="{
                inputVariant: 'outlined',
                label: 'Descrição categoria *',
                maxWidth: 650,
                counter: 100,
              }" :rules="[rules.required, rules.max]" />
            </v-col>

            <v-col cols="6" class="d-flex justify-center">
              <v-checkbox
                v-model="categoria.emergencial"
                color="red"
                label="Emergencial?"
                hide-details
              />
            </v-col>

            <v-col cols="6" class="d-flex justify-center">
              <v-checkbox
                v-model="categoria.abaterHoraExtra"
                color="warning"
                label="Abater hora extra?"
                hide-details
              />
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

        <v-card-actions>
          <v-btn color="warning" variant="plain" @click="clearFields()">
            <v-icon class="pt-1">mdi-refresh</v-icon>
            {{ dialogCategorias.isEditing ? 'Desfazer' : 'Limpar' }}
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
// Componentes
import InputUpperCase from '@/components/InputUpperCase.vue'; // Componente visual para o input upper case
// Classes
import { PaginatorClass } from '@/components/paginator/ClassPaginator';
import type { DialogCategoriasClass } from './ClassDialogCategorias'
// Store
import { useSnackbarStore } from '@/stores/SnackbarStore'
// Models
// Services
import { categoriasServices } from '@/services/categoriasServices';
import { rules } from '@/utils/rules'
// Vue
import { computed, onMounted, ref, watch } from 'vue'

const formRef = ref()
const formIsValid = ref(false)
const showPassword = ref(false)
const paginadorClass = ref(new PaginatorClass())
const ApiCategorias = ref()

interface Props {
  modelValue: DialogCategoriasClass
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: DialogCategoriasClass): void
  (e: 'operacao-concluida'): void
}>()

const categoria = computed(() => props.modelValue.categoria)
const dialogCategorias = computed(() => props.modelValue)
const exibir = computed({
  get: () => dialogCategorias.value.show,
  set: (val) => dialogCategorias.value.show = val
})

// Alimentar os dados para as categorias
onMounted(async() => {
  paginadorClass.value.autocomplete = true
  ApiCategorias.value = await  categoriasServices.getCategorias(paginadorClass.value)
})

watch(exibir, (val) => {
  if (!val) {
    resetForm()
  }
  if (val && !dialogCategorias.value.isEditing) {
    clearFields();
  }
});

function clearFields() {
  dialogCategorias.value.clearFields()
}

function resetForm() {
  dialogCategorias.value.clearFields()
  dialogCategorias.value.closeDialog()
  showPassword.value = false // Exibir senha
  exibir.value = false // Exibir componente
}

async function cadastrarNovaCategoria() {
  const valid = await formRef.value.validate()
  if (!valid) return

  try {
    await categoriasServices.createCategoria(categoria.value);
    useSnackbarStore().showSnackbar('Categoria criada com sucesso!', 'success')
    emit('operacao-concluida')
  } catch (error) {
    useSnackbarStore().showSnackbar(error, 'red')
    throw error
  }
  resetForm();
}

async function updateCategoria() {
  const valid = await formRef.value.validate()
  if (!valid) return

  try {
    await categoriasServices.updateCategoria(categoria.value)
    useSnackbarStore().showSnackbar('Categoria modificada com sucesso!', 'success')
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
  dialogCategorias.value.isEditing ? await updateCategoria() : await cadastrarNovaCategoria()
}

</script>
