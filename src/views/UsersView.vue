<template>
  <div class="pb-2">
    <v-btn icon @click="openNewUser()">
      <v-icon color="white">mdi-plus-circle-outline</v-icon>
    </v-btn>
  </div>
  <DialogUsers />

  <div v-if="apiUsers.length == 0" class="pt-4">

    <v-alert text="Before viewing the tasks, you must register them and they will then be available below."
      title="No tasks registered!" type="info" variant="tonal">
    </v-alert>

  </div>

  <v-card v-else class="mx-auto" max-width="700">
    <v-card-title>
      Company Employee List
    </v-card-title>

    <v-divider></v-divider>

    <v-virtual-scroll :items="apiUsers" height="320" item-height="48">
      <template v-slot:default="{ item: user }">
        <v-list-item :subtitle="`#${user.permissao} email: ${user.email}`"
          :title="`${user.id} - ${user.username.toUpperCase()}`">
          <template v-slot:prepend>
            <v-icon>mdi-card-account-details-outline</v-icon>
          </template>

          <template v-slot:append>
            <v-menu transition="scale-transition">
              <template v-slot:activator="{ props }">
                <v-btn size="small" color="primary" v-bind="props" icon="mdi-dots-vertical" />
              </template>

              <v-list>
                <v-list-item>
                  <v-list-item-title>
                    <v-btn icon="mdi-pencil" size="x-small" variant="tonal" color="primary"
                      @click="completeFormEditUserDialog(user)" />
                    <span class="pr-2" />

                    <RouterLink to="/tasks" custom v-slot="{ navigate }">
                      <v-btn icon="mdi-format-list-bulleted" size="x-small" variant="tonal" color="primary"
                        @click="navigate" />
                    </RouterLink>

                    <span class="pr-2" />

                    <v-btn :icon="user.bloqueado ? 'mdi-lock-outline' : 'mdi-lock-open-variant-outline'" size="x-small"
                      variant="tonal" :color="user.bloqueado ? 'red' : 'success'"
                      @click="toggleBloqueioUsuario(user)" />
                    <span class="pr-2" />

                    <v-btn :icon="user.ativo ? 'mdi-account-check-outline' : 'mdi-account-cancel-outline'"
                      size="x-small" variant="tonal" :color="user.ativo ? 'success' : 'red'"
                      @click="toggleUsuarioAtivo(user)" />
                    <span class="pr-2" />

                    <v-btn icon="mdi-delete-outline" size="x-small" variant="tonal" color="red"
                      @click="deleteUser(user.id!)" />
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-list-item>
        <v-divider></v-divider>
      </template>
    </v-virtual-scroll>
  </v-card>
</template>

<script setup lang="ts">
import { usersServices } from '@/services/usersService';
import { onMounted } from 'vue';
import { useDialogStoreUsers } from '../components/dialog/dialogUser/dialogStoreUsers'
import DialogUsers from '@/components/dialog/dialogUser/DialogUsers.vue';
import { useDialogStoreConfirmarSenha } from '@/components/dialog/dialogConfirmaSenha/dialogStoreConfirmaSenha';
import type { Users } from '@/models/UsersModel';

const usersDialog = useDialogStoreUsers()
const userService = usersServices()
const apiUsers = usersDialog.apiUsers

async function getAllUsers() {
  apiUsers.value = await userService.getAllUsers()
}

function openNewUser() {
  usersDialog.startCreatingNewUser()
}

function completeFormEditUserDialog(user: Users) {
  usersDialog.completeFormEditUserDialog(user)
}

async function toggleBloqueioUsuario(user: Users) {
  await usersDialog.toggleBloqueioUsuario(user)
}

async function toggleUsuarioAtivo(user: Users) {
  await usersDialog.toggleUsuarioAtivo(user)
}

function deleteUser(idUser: number) {
  useDialogStoreConfirmarSenha().openDialogConfirmarSenha()
  useDialogStoreConfirmarSenha().setarIdentificacaoOperacaoDelete('user', idUser)
}

onMounted(async () => {
  try {
    await getAllUsers()
  } catch (error) {
    throw error
  }
})

</script>
