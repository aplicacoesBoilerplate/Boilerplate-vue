<template>
  <v-dialog v-model="exibir" max-width="650">

    <v-form ref="formRef" v-model="formIsValid" @submit.prevent="submitForm()">
      <v-card :prepend-icon="dialogUsers.isEditing ? 'mdi-pencil-outline' : 'mdi-plus-circle-outline'"
        :title="dialogUsers.isEditing ? `Editar usuário: ${user.idUsuario}` : 'Criar novo usuário'">
        <v-card-text>
          <v-row dense>
            <v-col cols="12" md="6">
              <InputUpperCase v-model="user.nome" :style="{
                inputVariant: 'outlined',
                label: 'Nome de usuário*',
                maxWidth: 650,
                counter: 100,
              }" :rules="[rules.required, rules.max]" />
            </v-col>

            <v-col cols="12" md="6">
              <InputUpperCase v-model="user.email" :style="{
                inputVariant: 'outlined',
                label: 'E-mail*',
                hint: 'E-mail de acesso',
                maxWidth: 650,
                counter: 100,
              }" :rules="[rules.required, rules.min, rules.max, rules.emailFormat]" />
            </v-col>

            <v-col cols="12" class="d-flex justify-center">
              <v-autocomplete clearable v-model="user.permissao" label="Permissão*" :items="permissoesAutoComplete"
                :item-title="'chave'" :item-value="'valor'" variant="outlined"
                :rules="[rules.required, rules.includes(permissoesRules)]" />
            </v-col>
          </v-row>

          <v-row dense v-if="dialogUsers.isEditing">
            <v-col cols="6" class="d-flex justify-center">
              <v-switch v-model="user.contaBloqueada" color="red" label="Status bloqueio" />
            </v-col>
            <v-col cols="6" class="d-flex justify-center">
              <v-switch v-model="user.ativo" color="success" label="Status conta ativa" />
            </v-col>
          </v-row>

          <v-row dense v-if="dialogUsers.isEditing">
            <v-col cols="6" class="d-flex justify-center">
              <v-switch v-model="user.autorizaSaida" color="success" label="Autoriza saídas"></v-switch>
            </v-col>
            <v-col cols="6" class="d-flex justify-center">
              <DateTimePicker v-model="user.contaExpiraEm" label="Data expiração da conta" variant="outlined" />
            </v-col>
          </v-row>

          <v-row dense class="p-0 m-0">
            <v-col cols="12">
              <small class="d-flex justify-center text-caption text-medium-emphasis pt-3">
                * indica campos obrigatórios
              </small>
            </v-col>
            <v-col cols="12">
              <small class="d-flex justify-center text-caption text-medium-emphasis">
                O usuário será criado com a senha padrão
              </small>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider />

        <v-card-actions>
          <v-btn color="warning" variant="plain" @click="clearFields()">
            <v-icon class="pt-1">mdi-refresh</v-icon>
            {{ dialogUsers.isEditing ? 'Desfazer' : 'Limpar' }}
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
import DateTimePicker from '@/components/DateTimePicker.vue'; // Componente visual para data e hora
import InputUpperCase from '@/components/InputUpperCase.vue'; // Componente visual para o input upper case
// Classes
import type { DialogUsersClass } from './ClassDialogUsers'
// Store
import { useSnackbarStore } from '@/stores/SnackbarStore'
// Models
import { PermissoesUsuarios, PermissoesUsuariosAutoComplete } from '@/models/usersModels/UsuariosModels'
// Services
import { usuariosServices } from '@/services/usuariosService'
import { rules } from '@/utils/rules'
// Vue
import { computed, ref, watch } from 'vue'

const formRef = ref()
const formIsValid = ref(false)
const showPassword = ref(false)
const permissoesRules = PermissoesUsuarios
const permissoesAutoComplete = PermissoesUsuariosAutoComplete

interface Props {
  modelValue: DialogUsersClass
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: DialogUsersClass): void
  (e: 'operacao-concluida'): void
}>()

const user = computed(() => props.modelValue.usuario)
const dialogUsers = computed(() => props.modelValue)
const exibir = computed({
  get: () => dialogUsers.value.show,
  set: (val) => dialogUsers.value.show = val
})

watch(exibir, (val) => {
  if (!val) {
    resetForm()
  }
  if (val && !dialogUsers.value.isEditing) {
    clearFields();
  }
});

function clearFields() {
  dialogUsers.value.clearFields()
}

function resetForm() {
  dialogUsers.value.clearFields()
  dialogUsers.value.closeDialog()
  showPassword.value = false // Exibir senha
  exibir.value = false // Exibir componente
}

async function createNewUser() {
  const valid = await formRef.value.validate()
  if (!valid) return

  try {
    await usuariosServices.createUser(user.value);
    useSnackbarStore().showSnackbar('Usuário criado com sucesso!', 'success')
    emit('operacao-concluida')
  } catch (error) {
    useSnackbarStore().showSnackbar(error, 'red')
    throw error
  }
  resetForm();
}

async function updateUser() {
  const valid = await formRef.value.validate()
  if (!valid) return
  try {
    await usuariosServices.updateUser(user.value)
    useSnackbarStore().showSnackbar('Usuário modificado com sucesso!', 'success')
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
  dialogUsers.value.isEditing ? await updateUser() : await createNewUser()
}

</script>
