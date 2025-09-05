<template>
  <v-dialog v-model="dialogUsuarios.show" max-width="650">

    <v-form ref="formRef" v-model="formIsValid" @submit.prevent="submitForm()">
      <v-card :prepend-icon="dialogUsuarios.isEditing ? 'mdi-pencil-outline' : 'mdi-plus-circle-outline'"
        :title="dialogUsuarios.isEditing ? `Editar usuário: ${dialogUsuarios.usuario.idUsuario}` : 'Criar novo usuário'">
        <v-card-text>
          <v-row dense>
            <v-col cols="12" md="6">
              <InputUpperCase v-model="dialogUsuarios.usuario.nome" :style="{
                inputVariant: 'outlined',
                label: 'Nome de usuário*',
                maxWidth: 650,
                counter: 100,
              }" :rules="[rules.required, rules.max]" />
            </v-col>

            <v-col cols="12" md="6">
              <InputUpperCase v-model="dialogUsuarios.usuario.email" :style="{
                inputVariant: 'outlined',
                label: 'E-mail*',
                hint: 'E-mail de acesso',
                maxWidth: 650,
                counter: 100,
              }" :rules="[rules.required, rules.min, rules.max, rules.emailFormat]" />
            </v-col>

            <v-col cols="12" class="d-flex justify-center">
              <v-autocomplete clearable v-model="dialogUsuarios.usuario.permissao" label="Permissão*" :items="permissoesAutoComplete"
                :item-title="'chave'" :item-value="'valor'" variant="outlined"
                :rules="[rules.required, rules.includes(permissoesRules)]" />
            </v-col>
          </v-row>

          <v-row dense v-if="dialogUsuarios.isEditing">
            <v-col cols="6" class="d-flex justify-center">
              <v-switch v-model="dialogUsuarios.usuario.contaBloqueada" color="red" label="Status bloqueio" />
            </v-col>
            <v-col cols="6" class="d-flex justify-center">
              <v-switch v-model="dialogUsuarios.usuario.ativo" color="success" label="Status conta ativa" />
            </v-col>
          </v-row>

          <v-row dense v-if="dialogUsuarios.isEditing">
            <v-col cols="6" class="d-flex justify-center">
              <v-switch v-model="dialogUsuarios.usuario.autorizaSaida" color="success" label="Autoriza saídas"></v-switch>
            </v-col>
            <v-col cols="6" class="d-flex justify-center">
              <DateTimePicker v-model="dialogUsuarios.usuario.contaExpiraEm" label="Data expiração da conta" variant="outlined" />
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

        <v-card-actions class="sticky-actions">
          <v-btn color="warning" variant="plain" @click="clearFields()">
            <v-icon class="pt-1">mdi-refresh</v-icon>
            {{ dialogUsuarios.isEditing ? 'Desfazer' : 'Limpar' }}
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
import { DialogUsersClass } from './ClassDialogUsers'
// Store
import { useSnackbarStore } from '@/stores/SnackbarStore'
// Models
import { PermissoesUsuarios, PermissoesUsuariosAutoComplete } from '@/models/usersModels/UsuariosModels'
// Services
import { usuariosServices } from '@/services/usuariosService'
import { rules } from '@/utils/rules'
// Vue
import { ref, watch } from 'vue'

const formRef = ref()
const formIsValid = ref(false)
const showPassword = ref(false)
const permissoesRules = PermissoesUsuarios
const permissoesAutoComplete = PermissoesUsuariosAutoComplete

const dialogUsuarios = defineModel<DialogUsersClass>('dialogUsuarios', {
  required: true
})

const emit = defineEmits<{
  (e: 'operacao-concluida'): void
}>()

watch(() => dialogUsuarios.value.show, (isOpen) => {
  if (!isOpen) {
    resetForm()
  }
  if (isOpen && !dialogUsuarios.value.isEditing) {
    clearFields();
  }
});

function clearFields() {
  dialogUsuarios.value.clearFields()
}

function resetForm() {
  dialogUsuarios.value.clearFields()
  dialogUsuarios.value.closeDialog()
  showPassword.value = false // Exibir senha
  dialogUsuarios.value.show = false // Exibir componente
}

async function createNewUser() {
  const valid = await formRef.value.validate()
  if (!valid) return

  try {
    await usuariosServices.createUser(dialogUsuarios.value.usuario);
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
    await usuariosServices.updateUser(dialogUsuarios.value.usuario)
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
  dialogUsuarios.value.isEditing ? await updateUser() : await createNewUser()
}

</script>
