<template>
  <div class="pb-2 custom-button-wrapper" @mouseenter="hover = true" @mouseleave="hover = false">
    <v-btn icon @click="openNewUser()" class="animated-btn">
      <v-icon :class="{ rotate: hover }" color="white">mdi-plus-circle-outline</v-icon>
    </v-btn>
    <span class="button-label" :class="{ visible: hover }">Create a new user</span>
  </div>
  <DialogUsers />

  <div v-if="apiUsers?.totalRegistros == 0" class="pt-4">
    <v-alert text="Before viewing the tasks, you must register them and they will then be available below."
      title="No tasks registered!" type="info" variant="tonal">
    </v-alert>
  </div>

  <v-card v-else class="mx-auto" max-width="700">
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h6">Company Employees List</span>
      <v-btn title="Order" variant="outlined" color="primary" density="compact" @click="toggleOrderBy()">
        <v-icon>{{ paginator.filtrosPaginator.value.orderBy! == 'ASC' ? "mdi-arrow-down" : "mdi-arrow-up"
        }}</v-icon></v-btn>
      <v-text-field clearable v-model="idSearch" density="compact" variant="outlined"
        placeholder="Search employee by register" hide-details prepend-inner-icon="mdi-magnify"
        style="max-width: 300px" />
    </v-card-title>
    <v-divider />

    <v-virtual-scroll :items="apiUsers?.registros" height="500" item-height="50">
      <template v-slot:default="{ item: user }">
        <v-list-item :title="`${user.idUsuario} - ${user.nome.toUpperCase()}`"
          :subtitle="`#${user.permissao} email: ${user.email}`">
          <template v-slot:prepend>
            <v-icon>mdi-card-account-details-outline</v-icon>
          </template>

          <template v-slot:append>
            <div class="pe-2">
              <v-btn size="small" variant="elevated" color="dark" icon="mdi-information-outline"
                @click="toggleUser(user.idUsuario!)">
              </v-btn>
            </div>

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

                    <v-btn :icon="user.contaBloqueada ? 'mdi-lock-outline' : 'mdi-lock-open-variant-outline'"
                      size="x-small" variant="tonal" :color="user.contaBloqueada ? 'red' : 'success'"
                      @click="toggleBloqueioUsuario(user)" />
                    <span class="pr-2" />

                    <v-btn :icon="user.ativo ? 'mdi-account-check-outline' : 'mdi-account-cancel-outline'"
                      size="x-small" variant="tonal" :color="user.ativo ? 'success' : 'red'"
                      @click="toggleUsuarioAtivo(user)" />
                    <span class="pr-2" />

                    <v-btn icon="mdi-delete-outline" size="x-small" variant="tonal" color="red"
                      @click="deleteUser(user.idUsuario!)" :disabled="user.idUsuario == 1" />
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-list-item>
        <v-expand-transition>
          <div v-if="expandedUserId === user.idUsuario" class="custom-expansion-panel">
            <v-row>
              <v-col sm="3" md="2" class="d-flex justify-center">
                <v-chip :color="user.ativo ? 'success' : 'red'">
                  Active
                </v-chip>
              </v-col>

              <v-col sm="3" md="2" class="d-flex justify-center">
                <v-chip :color="!user.contaBloqueada ? 'success' : 'red'">
                  Blocked
                </v-chip>
              </v-col>

              <v-col sm="6" md="8" class="d-flex justify-center">
                <strong>Permision:</strong>
                <v-chip color="info">
                  {{ user.permissao }}<br>
                </v-chip>
              </v-col>
            </v-row>
          </div>
        </v-expand-transition>
        <v-divider />
      </template>
    </v-virtual-scroll>
  </v-card>
  <Paginator />
</template>

<script setup lang="ts">
import DialogUsers from '@/components/dialog/dialogUser/DialogUsers.vue';
import { useDialogStoreUsers } from '../components/dialog/dialogUser/dialogStoreUsers'
import { useDialogStoreConfirmarSenha } from '@/components/dialog/dialogConfirmaSenha/dialogStoreConfirmaSenha';
import { onMounted, ref, watch } from 'vue';
import { usersServices } from '@/services/usersService';
import Paginator from '@/components/paginator/Paginator.vue'
import type { UsuarioConsulta } from '@/models/usersModels/UsuariosModels';
import { usePaginator } from '@/components/paginator/paginatorStore';

const expandedUserId = ref<number | null>(null)
const hover = ref(false)
const usersDialog = useDialogStoreUsers()
const userService = usersServices()
const apiUsers = usersDialog.apiUsers
const idSearch = ref<number | string>()
const paginator = usePaginator()

async function getAllUsers() {
  apiUsers.value = await userService.getAllUsers()
}

function openNewUser() {
  usersDialog.startCreatingNewUser()
}

function completeFormEditUserDialog(user: UsuarioConsulta) {
  usersDialog.completeFormEditUserDialog(user)
}

async function toggleBloqueioUsuario(user: UsuarioConsulta) {
  await usersDialog.toggleBloqueioUsuario(user)
}

async function toggleUsuarioAtivo(user: UsuarioConsulta) {
  await usersDialog.toggleUsuarioAtivo(user)
}

function deleteUser(idUser: number) {
  useDialogStoreConfirmarSenha().openDialogConfirmarSenha()
  useDialogStoreConfirmarSenha().setarIdentificacaoOperacaoDelete('user', idUser)
}

function toggleUser(id: number) {
  expandedUserId.value = expandedUserId.value === id ? null : id
}

async function getUserById(idUser: number | string) {
  const user = await userService.getUserById(idUser)
  apiUsers.value = {
    limite: 1,
    offset: 1,
    totalPaginas: 1,
    totalRegistros: 1,
    registros: [user]
  }
}

onMounted(async () => {
  await getAllUsers()
  paginator.carregarFiltrosDaAPI(apiUsers.value!)
})

watch(() => idSearch.value, (newValue) => {
  if (newValue !== null && newValue !== '')
    getUserById(newValue!)
  else
    getAllUsers()
})

watch(() => paginator.filtrosPaginator.value, () => {
  getAllUsers()
}, { deep: true })

function toggleOrderBy() {
  paginator.toggleOrderBy()
}

</script>

<style scoped>
.custom-expansion-panel {
  margin: 0.8rem;
}

.custom-expansion-panel,
strong {
  padding-right: 0.5rem;
  text-decoration: none;
}
</style>
