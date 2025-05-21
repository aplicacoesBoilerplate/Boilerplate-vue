<template>
  <v-dialog v-model="exibir" max-width="650">

    <v-form ref="formRef" v-model="formIsValid" @submit.prevent="submitForm()">
      <v-card :prepend-icon="dialogStoreUsers.isEditing.value ? 'mdi-pencil-outline' : 'mdi-plus-circle-outline'"
        :title="dialogStoreUsers.isEditing.value ? `Editar usuário: ${user.idUsuario}` : 'Criar novo usuário'">
        <v-card-text>
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field clearable v-model="user.nome" :counter="100" :rules="[rules.required, rules.max]"
                label="Nome de usuário*" required></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field clearable v-model="user.email" :counter="100" hint="E-mail de acesso" persistent-hint
                label="e-mail*" :rules="[rules.required, rules.min, rules.max, rules.emailFormat]"></v-text-field>
            </v-col>

            <v-col cols="12" class="d-flex justify-center">
              <v-autocomplete clearable v-model="user.permissao" label="Permissão*" :items="permissoes"
                :rules="[rules.required, rules.includes(permissoes)]" />
            </v-col>
          </v-row>

          <v-row dense v-if="isEditing">
            <v-col cols="6" class="d-flex justify-center">
              <v-switch v-model="user.contaBloqueada" color="red" label="Status bloqueio"></v-switch>
            </v-col>
            <v-col cols="6" class="d-flex justify-center">
              <v-switch v-model="user.ativo" color="success" label="Status conta ativa"></v-switch>
            </v-col>
          </v-row>

          <v-row dense v-if="isEditing">
            <v-col cols="6" class="d-flex justify-center">
              <v-switch v-model="user.autorizaSaida" color="success" label="Autoriza saídas"></v-switch>
            </v-col>
            <v-col cols="6" class="d-flex justify-center">
              <v-date-input clearable label="Data expiração da conta" prepend-icon="" prepend-inner-icon="$calendar"
                variant="solo" :rules="[rules.dateAfter(() => new Date())]"></v-date-input>
            </v-col>
          </v-row>

          <v-row dense class="p-0 m-0">
            <v-col cols="12">
              <small class="d-flex justify-center text-caption text-medium-emphasis pt-3">* indica
                campos obrigatórios
              </small>
            </v-col>
            <v-col cols="12">
              <small class="d-flex justify-center text-caption text-medium-emphasis">O usuário será
                criado com a senha
                padrão
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
// Componentes
// Store
import { useDialogStoreUsers } from '../dialogUser/dialogStoreUsers' // Será removido
import { useSnackbarStore } from '@/stores/SnackbarStore'
// Models
import { PermissoesUsuarios, type UsuarioConsulta } from '@/models/usersModels/UsuariosModels'
// Services
import { rules } from '@/utils/rules'
// Vue
import { ref, watch } from 'vue'

const formRef = ref()
const formIsValid = ref(false)
const showPassword = ref(false)
const dialogStoreUsers = useDialogStoreUsers()
const isEditing = dialogStoreUsers.isEditing
const permissoes = PermissoesUsuarios

const exibir = defineModel<boolean>('exibir', { required: false, default: false })

const user = ref<UsuarioConsulta>({
  ...dialogStoreUsers.emptyUser
})

watch(() => dialogStoreUsers.userToEdit.value, (userToEdit) => {
  if (userToEdit) {
    user.value = { ...userToEdit }
  } else {
    user.value = {
      ...dialogStoreUsers.emptyUser
    }
  }
}, { immediate: true })

watch(exibir, (val) => {
  if (!val) {
    resetForm()
  }
});

function clearFields() {
  user.value = { ...dialogStoreUsers.emptyUser };
}

function resetForm() {
  clearFields();
  dialogStoreUsers.closeUserDialog()
  showPassword.value = false
  exibir.value = false
}

async function createNewUser() {
  const valid = await formRef.value.validate()
  if (!valid) return

  try {
    await dialogStoreUsers.createNewUser(user.value);
    useSnackbarStore().showSnackbar('Usuário criado com sucesso!', 'success')
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
    await dialogStoreUsers.updateUser(user.value);
    useSnackbarStore().showSnackbar('Usuário modificado com sucesso!', 'success')
  } catch (error) {
    useSnackbarStore().showSnackbar(error, 'red')
    throw error
  }
  resetForm();
}

async function submitForm() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  dialogStoreUsers.isEditing.value ? await updateUser() : await createNewUser()
}

</script>
