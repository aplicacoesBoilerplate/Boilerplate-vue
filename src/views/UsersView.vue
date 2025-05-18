<template>
  <div class="pb-2 custom-button-wrapper" @mouseenter="hover = true" @mouseleave="hover = false">
    <v-btn icon @click="openNewUser()" class="animated-btn">
      <v-icon :class="{ rotate: hover }" color="white">mdi-plus-circle-outline</v-icon>
    </v-btn>
    <span class="button-label" :class="{ visible: hover }">Criar novo usuário</span>
  </div>
  <DialogUsers/>

  <div v-if="apiUsers?.totalRegistros == 0" class="pt-4">
    <v-alert text="Nenhum usuário encontrado!" type="info" variant="tonal">
    </v-alert>
  </div>

  <v-card v-else class="mx-auto" max-width="700">
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h6">Lista de usuários</span>
      <v-btn title="Ordem" variant="outlined" color="primary" density="compact"
             @click="toggleOrderBy()">
        <v-icon>{{
            paginator.filtrosPaginator.value.orderBy! == 'ASC' ? "mdi-arrow-down" : "mdi-arrow-up"
          }}
        </v-icon>
      </v-btn>
      <v-text-field clearable v-model="paginator.filtrosPaginator.value.search!" density="compact" variant="outlined"
                    placeholder="Buscar pelo registro"
                    hide-details prepend-inner-icon="mdi-magnify" style="max-width: 300px"/>
    </v-card-title>
    <v-divider/>

    <v-virtual-scroll :items="apiUsers?.registros" height="500" item-height="50">
      <template v-slot:default="{ item: user }">
        <v-list-item :title="`${user.idUsuario} - ${user.nome.toUpperCase()}`"
                     :subtitle="`#email: ${user.email}`">
          <template v-slot:prepend>
            <v-icon>mdi-card-account-details-outline</v-icon>
          </template>

          <template v-slot:append>
            <div class="pe-2">
              <v-btn size="small" variant="elevated" color="dark" icon="mdi-information-outline"
                     @click="toggleUser(user.idUsuario!)" title="Informações">
              </v-btn>
            </div>

            <v-menu transition="scale-transition">
              <template v-slot:activator="{ props }">
                <v-btn size="small" color="primary" v-bind="props" icon="mdi-dots-vertical"
                       title="Opções"/>
              </template>
              <v-list>
                <v-list-item>
                  <v-list-item-title>
                    <v-btn icon="mdi-pencil" size="x-small" variant="tonal" color="primary"
                           @click="completeFormEditUserDialog(user)" :disabled="user.idUsuario == 1"
                           title="Editar"/>
                    <span class="pr-2"/>

                    <RouterLink to="/tasks" custom v-slot="{ navigate }">
                      <v-btn icon="mdi-format-list-bulleted" size="x-small" variant="tonal"
                             color="primary"
                             @click="navigate" :disabled="user.idUsuario == 1" title="Vínculos"/>
                    </RouterLink>
                    <span class="pr-2"/>

                    <v-btn
                      :icon="user.contaBloqueada ? 'mdi-lock-outline' : 'mdi-lock-open-variant-outline'"
                      size="x-small" variant="tonal"
                      :color="user.contaBloqueada ? 'red' : 'success'"
                      @click="toggleBloqueioUsuario(user)" :disabled="user.idUsuario == 1"
                      :title="user.contaBloqueada ? 'Desbloquear' : 'Bloquear'"/>
                    <span class="pr-2"/>

                    <v-btn
                      :icon="user.ativo ? 'mdi-account-check-outline' : 'mdi-account-cancel-outline'"
                      size="x-small" variant="tonal" :color="user.ativo ? 'success' : 'red'"
                      @click="toggleUsuarioAtivo(user)" :disabled="user.idUsuario == 1"
                      :title="user.ativo ? 'Inativar' : 'Ativar'"/>
                    <span class="pr-2"/>

                    <v-btn
                      icon="mdi-lock-reset"
                      size="x-small" variant="tonal" color="warning"
                      @click="resetarSenhaAoPadrao(user.email)" :disabled="user.idUsuario == 1"
                      title="Resetar senha"/>
                    <span class="pr-2"/>

                    <v-btn icon="mdi-delete-outline" size="x-small" variant="tonal" color="red"
                           @click="deleteUser(user.idUsuario!)" :disabled="user.idUsuario == 1"
                           title="Remover"/>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-list-item>
        <v-expand-transition>
          <div v-if="expandedUserId === user.idUsuario" class="custom-expansion-panel">
            <v-row dense>
              <v-col sm="3" md="2" class="d-flex justify-center">
                <v-chip :color="user.ativo ? 'success' : 'red'">
                  {{ user.ativo ? 'Ativo' : 'Inativo' }}
                </v-chip>
              </v-col>

              <v-col sm="3" md="2" class="d-flex justify-center">
                <v-chip :color="!user.contaBloqueada ? 'success' : 'red'">
                  {{ user.contaBloqueada ? 'Bloqueado' : 'Liberado' }}
                </v-chip>
              </v-col>

              <v-col sm="6" md="8" class="d-flex justify-center">
                <v-icon class="pt-3">mdi-badge-account-outline</v-icon>
                <v-chip :color="user.permissao != null ? 'info' : 'red'">
                  {{ user.permissao != null ? user.permissao : 'Permissão pendente' }}<br>
                </v-chip>
              </v-col>
            </v-row>

            <v-row dense>
              <v-col sm="3" md="2" class="d-flex justify-center">
                <v-chip :color="!user.senhaExpirada ? 'success' : 'red'">
                  senha {{ user.senhaExpirada ? 'expirada' : 'válida' }}
                </v-chip>
              </v-col>

              <v-col sm="3" md="2" class="d-flex justify-center">
                <v-chip :color="user.autorizaSaida ? 'success' : 'red'">
                  {{ user.autorizaSaida ? 'Autoriza' : 'Não autoriza' }}
                </v-chip>
              </v-col>

              <v-col sm="6" md="8" class="d-flex justify-center" v-if="user.contaExpiraEm">
                <v-icon class="pt-3">mdi-account-clock-outline</v-icon>
                <v-chip color="warning">
                  <strong>Data expiração:</strong>
                  {{ user.contaExpiraEm }}<br>
                </v-chip>
              </v-col>
            </v-row>

          </div>
        </v-expand-transition>
        <v-divider/>
      </template>
    </v-virtual-scroll>
  </v-card>
  <Paginator/>
</template>

<script setup lang="ts">
import DialogUsers from '@/components/dialog/dialogUser/DialogUsers.vue';
import {useDialogStoreUsers} from '../components/dialog/dialogUser/dialogStoreUsers'
import {onMounted, ref, watch} from 'vue';
import {usuariosServices} from '@/services/usuariosService';
import Paginator from '@/components/paginator/Paginator.vue'
import type {UsuarioConsulta} from '@/models/usersModels/UsuariosModels';
import {usePaginator} from '@/components/paginator/paginatorStore';
import {useDialogStoreConfirmarSenha} from '@/stores/dialogStoreConfirmaSenha';
import {useSnackbarStore} from '@/stores/SnackbarStore';
import {authServices} from "@/services/authService.ts";

const expandedUserId = ref<number | null>(null)
const hover = ref(false)
const userService = usuariosServices()
const usersDialog = useDialogStoreUsers()
const apiUsers = usersDialog.apiUsers
const idSearch = ref<string>()
const paginator = usePaginator()
const confirmarSenha = useDialogStoreConfirmarSenha()

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
  try {
    await usersDialog.toggleBloqueioUsuario(user)
    useSnackbarStore().showSnackbar(`Usuário ${user.contaBloqueada ? 'desbloqueado' : 'bloqueado'} com sucesso!`, 'success')
  } catch (error) {
    useSnackbarStore().showSnackbar(error, 'red')
    throw error
  }
}

async function toggleUsuarioAtivo(user: UsuarioConsulta) {
  try {
    await usersDialog.toggleUsuarioAtivo(user)
    useSnackbarStore().showSnackbar(`Usuário ${user.ativo ? 'inativado' : 'ativado'} com sucesso!`, 'success')
  } catch (error) {
    useSnackbarStore().showSnackbar(error, 'red')
    throw error
  }
}

async function resetarSenhaAoPadrao(emailUsuario: string) {
  confirmarSenha.setCallbackPosSenha(async () => {
    try {
      await authServices().resetarSenhaAoPadrao(emailUsuario)
      useSnackbarStore().showSnackbar(`Senha resetada com sucesso para o usuário: ${emailUsuario}`, 'success')
    } catch (error) {
      useSnackbarStore().showSnackbar(error, 'red')
      throw error
    }
  })

  confirmarSenha.openDialogConfirmarSenha()
}

function deleteUser(idUser: number) {
  confirmarSenha.setCallbackPosSenha(async () => {
    try {
      await usuariosServices().deleteUser(idUser)
      useSnackbarStore().showSnackbar('Usuário removido!', 'success')
    } catch (error) {
      useSnackbarStore().showSnackbar(error, 'red')
    } finally {
      useDialogStoreUsers().apiUsers.value = await usuariosServices().getAllUsers()
    }
  })

  confirmarSenha.openDialogConfirmarSenha()
}

function toggleUser(id: number) {
  expandedUserId.value = expandedUserId.value === id ? null : id
}

async function getUserById(idUser: number | string) {
  try {
    const user = await userService.getUserById(idUser)
    apiUsers.value = {
      limite: 1,
      offset: 1,
      totalPaginas: 1,
      totalRegistros: 1,
      registros: [user]
    }
  } catch (error) {
    useSnackbarStore().showSnackbar(error, 'red')
    throw error
  }
}

async function searchUsuarios(search: string) {
  try {
    apiUsers.value = await userService.searchUsuarios(search)
  } catch (error) {
    useSnackbarStore().showSnackbar(error, 'red')
    throw error
  }
}

onMounted(async () => {
  await getAllUsers()
  paginator.carregarFiltrosDaAPI(apiUsers.value!)
})

watch(() => idSearch.value, async (newValue) => {
  if (newValue !== null && newValue !== '')
    await searchUsuarios(newValue!)
  else
    getAllUsers()
})

watch(() => paginator.filtrosPaginator.value, () => {
  if (paginator.filtrosPaginator.value.search! != null || paginator.filtrosPaginator.value.search! != '')
    searchUsuarios(paginator.filtrosPaginator.value.search!)
  else
    getAllUsers()
}, {deep: true})

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
