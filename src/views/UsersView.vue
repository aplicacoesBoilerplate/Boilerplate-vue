<template>
  <!-- Botão que recebe o callback para abrir um dialog -->
  <BtnOpenDialog :callback="openNewUser" :label="'Criar novo usuário'" />

  <!-- Dialog aberto pelo botão acima -->
  <DialogUsers v-model:exibir="showDialog" />

  <!-- Card para definir tamanho de exibição e acoplar os demais elementos -->
  <v-card class="mx-auto" max-width="700">
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h6">Lista de usuários</span>
      <v-btn title="Ordem" variant="outlined" color="primary" density="compact" @click="toggleOrderBy()">
        <v-icon>{{
          paginator.filtrosPaginator.value.orderBy! == 'ASC' ? "mdi-arrow-down" : "mdi-arrow-up"
          }}
        </v-icon>
      </v-btn>

      <!-- Campo para consultar os usuários pelo search -->
      <v-text-field clearable v-model="paginator.filtrosPaginator.value.search!" density="compact" variant="outlined"
        placeholder="Consultar usuários" hide-details prepend-inner-icon="mdi-magnify" style="max-width: 300px" />
    </v-card-title>
    <v-divider />

    <!-- Loading -->
    <div class="d-flex justify-center" v-if="loading">
      <v-progress-circular color="primary" indeterminate />
    </div>

    <!-- Alerta quando nenhum usuário consultado foi encontrado -->
    <div v-if="apiUsers?.totalRegistros == 0 && loading == false" class="pt-4">
      <v-alert text="Nenhum usuário encontrado!" type="info" variant="tonal">
        <template v-slot:append>
          <v-btn color="warning" variant="plain" @click="clearSearch()">
            <v-icon class="pt-1">
              mdi-refresh
            </v-icon>
            Refresh
          </v-btn>
        </template>
      </v-alert>
    </div>

    <!-- Exibição dos usuários -->
    <v-virtual-scroll :items="apiUsers?.registros" height="500" item-height="50" v-else>
      <template v-slot:default="{ item: user }">
        <v-list-item :title="`${user.idUsuario} - ${user.nome.toUpperCase()}`" :subtitle="`#email: ${user.email}`">

          <!-- Ícone de cartão de usuário -->
          <template v-slot:prepend>
            <v-icon>mdi-card-account-details-outline</v-icon>
          </template>

          <!-- Botões de funcionalidades de mais informações e menu -->
          <template v-slot:append>
            <div class="pe-2">
              <v-btn size="small" variant="elevated" color="dark" icon="mdi-information-outline"
                @click="toggleUser(user.idUsuario!)" title="Informações">
              </v-btn>
            </div>

            <!-- Menu de opções -->
            <v-menu transition="scale-transition">
              <template v-slot:activator="{ props }">
                <v-btn size="small" color="primary" v-bind="props" icon="mdi-dots-vertical" title="Opções" />
              </template>
              <v-list>
                <v-list-item>
                  <v-list-item-title>
                    <!-- Editar usuário -->
                    <v-btn icon="mdi-pencil" size="x-small" variant="tonal" color="primary"
                      @click="completeFormEditUserDialog(user)" :disabled="user.idUsuario == 1" title="Editar" />
                    <span class="pr-2" />

                    <!-- Visualizar vínculos do usuário com saídas -->
                    <RouterLink to="/tasks" custom v-slot="{ navigate }">
                      <v-btn icon="mdi-format-list-bulleted" size="x-small" variant="tonal" color="primary"
                        @click="navigate" :disabled="user.idUsuario == 1" title="Vínculos" />
                    </RouterLink>
                    <span class="pr-2" />

                    <!-- Facilitador para bloqueio e desbloqueio do usuário -->
                    <v-btn :icon="user.contaBloqueada ? 'mdi-lock-outline' : 'mdi-lock-open-variant-outline'"
                      size="x-small" variant="tonal" :color="user.contaBloqueada ? 'red' : 'success'"
                      @click="toggleBloqueioUsuario(user)" :disabled="user.idUsuario == 1"
                      :title="user.contaBloqueada ? 'Desbloquear' : 'Bloquear'" />
                    <span class="pr-2" />

                    <!-- Facilitador para ativar ou desativar um usuário -->
                    <v-btn :icon="user.ativo ? 'mdi-account-check-outline' : 'mdi-account-cancel-outline'"
                      size="x-small" variant="tonal" :color="user.ativo ? 'success' : 'red'"
                      @click="toggleUsuarioAtivo(user)" :disabled="user.idUsuario == 1"
                      :title="user.ativo ? 'Inativar' : 'Ativar'" />
                    <span class="pr-2" />

                    <!-- Funcionalidade sensível de resetar senha do usuário, precisa de confirmação de senha -->
                    <v-btn icon="mdi-lock-reset" size="x-small" variant="tonal" color="warning"
                      @click="resetarSenhaAoPadrao(user.email)" :disabled="user.idUsuario == 1" title="Resetar senha" />
                    <span class="pr-2" />

                    <!-- Funcionalidade sensível de remoção de usuário, precisa de confirmação de senha -->
                    <v-btn icon="mdi-delete-outline" size="x-small" variant="tonal" color="red"
                      @click="deleteUser(user.idUsuario!)" :disabled="user.idUsuario == 1" title="Remover" />
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-list-item>

        <!-- Card de detalhes para cada usuário, expanção controlada por uma variável -->
        <v-expand-transition>
          <div v-if="expandedUserId === user.idUsuario" class="custom-expansion-panel">
            <v-row dense>
              <!-- Conta ativa -->
              <v-col cols="6" class="d-flex justify-center">
                <v-chip :color="user.ativo ? 'success' : 'red'">
                  Conta está ativa?
                  {{ user.ativo ? 'Ativo' : 'Inativo' }}
                </v-chip>
              </v-col>

              <v-divider vertical />

              <!-- Conta bloqueada -->
              <v-col cols="6" class="d-flex justify-center">
                <v-chip :color="!user.contaBloqueada ? 'success' : 'red'">
                  Login está liberado?
                  {{ user.contaBloqueada ? 'Bloqueado' : 'Liberado' }}
                </v-chip>
              </v-col>

              <v-divider />
            </v-row>

            <v-row dense>
              <!-- Conta com a senha expirada, geralmente quando é a senha padrão -->
              <v-col cols="6" class="d-flex justify-center">
                <v-chip :color="!user.senhaExpirada ? 'success' : 'red'">
                  Estado da senha?
                  {{ user.senhaExpirada ? 'Expirada' : 'Válida' }}
                </v-chip>
              </v-col>

              <v-divider vertical />

              <!-- Mostra se o usuário tem permissão para autorizar saídas ou não -->
              <v-col cols="6" class="d-flex justify-center">
                <v-chip :color="user.autorizaSaida ? 'success' : 'red'">
                  Autoriza saídas?
                  {{ user.autorizaSaida ? 'Autoriza' : 'Não autoriza' }}
                </v-chip>
              </v-col>
              <v-divider />
            </v-row>


            <v-row dense>
              <!-- Permissão do usuário -->
              <v-col cols="6" class="d-flex justify-center">
                <v-icon class="pt-3">mdi-badge-account-outline</v-icon>
                <v-chip :color="user.permissao != null ? 'info' : 'red'">
                  {{ user.permissao != null ? user.permissao : 'Permissão pendente' }}<br>
                </v-chip>
              </v-col>

              <v-divider vertical />

              <!-- Previsão de expiração da conta -->
              <v-col cols="6" class="d-flex justify-center">
                <v-icon class="pt-2 pr-2">mdi-account-clock-outline</v-icon>
                <v-chip color="warning">
                  <strong>Data expiração:</strong>
                  {{ user.contaExpiraEm || "Sem previsão" }}
                </v-chip>
              </v-col>
            </v-row>

          </div>
        </v-expand-transition>
        <v-divider />
      </template>
    </v-virtual-scroll>
  </v-card>
  <!-- Componente de paginação -->
  <Paginator :valor-campos="propsPaginator" v-if="apiUsers?.totalRegistros! > 0 && !loading" />
</template>

<script setup lang="ts">
//#region Imports
// Componentes
import DialogUsers from '@/components/dialog/dialogUser/DialogUsers.vue';
import { useDialogStoreUsers } from '@/components/dialog/dialogUser/dialogStoreUsers'
import Paginator from '@/components/paginator/Paginator.vue'
import { usePaginator } from '@/components/paginator/paginatorStore';

// Store
import { useDialogStoreConfirmarSenha } from '@/stores/dialogStoreConfirmaSenha';
import { useSnackbarStore } from '@/stores/SnackbarStore';

// Models
import type { UsuarioConsulta } from '@/models/usersModels/UsuariosModels';
import type { FiltroPaginacao } from '@/models/FiltersModels';

// Services
import { useServicesUsuario } from '@/services/usuariosService';
import { authServices } from "@/services/authService.ts";

// Vue
import { onMounted, ref, watch } from 'vue';
import BtnOpenDialog from '@/components/dialog/BtnOpenDialog.vue';
//#endregion

//#region Variáveis
const expandedUserId = ref<number | null>(null) // Painel de informações do usuário
const usersDialog = useDialogStoreUsers()
const apiUsers = usersDialog.apiUsers
const idSearch = ref<string>()
const paginator = usePaginator()
const confirmarSenha = useDialogStoreConfirmarSenha()
const propsPaginator = ref<FiltroPaginacao>({
  limite: 10,
  offset: 1
})
const loading = ref(false)
const showDialog = ref(false)
//#endregion

//#region Funcionalidades do Vue

onMounted(async () => {
  await getAllUsers()
  propsPaginator.value = paginator.carregarFiltrosDaAPI(apiUsers.value!)
})

watch(() => idSearch.value, async (newValue) => {
  if (newValue !== null && newValue !== '')
    await searchUsuarios(newValue!)
  else
    getAllUsers()
})

watch(() => paginator.filtrosPaginator.value, () => {
  if (paginator.filtrosPaginator.value.search! != null && paginator.filtrosPaginator.value.search! != '')
    searchUsuarios(paginator.filtrosPaginator.value.search!)
  else
    getAllUsers()
}, { deep: true })

//#endregion

//#region Dialog
// Métodos para manipular o dialog de usuário
function openNewUser() {
  usersDialog.startCreatingNewUser()
  showDialog.value = true
}

function completeFormEditUserDialog(user: UsuarioConsulta) {
  usersDialog.completeFormEditUserDialog(user)
  showDialog.value = true
}
//#endregion

//#region funções de consulta, controle e manipulação de usuários
// Consulta paginada de todos os usuários
async function getAllUsers() {
  loading.value = true
  try {
    apiUsers.value = await useServicesUsuario.getAllUsers()
  } catch (error) {
    useSnackbarStore().showSnackbar(error, 'red')
    throw error
  } finally {
    loading.value = false
  }
}
// Consulta com parâmetro de usuários, também pagina os resultados
async function searchUsuarios(search: string) {
  loading.value = true
  try {
    apiUsers.value = await useServicesUsuario.searchUsuarios(search)
  } catch (error) {
    useSnackbarStore().showSnackbar(error, 'red')
    throw error
  } finally {
    loading.value = false
  }
}

// Função para facilitar o bloqueio e desbloqueio da conta de um usuário
async function toggleBloqueioUsuario(user: UsuarioConsulta) {
  try {
    await usersDialog.toggleBloqueioUsuario(user)
    useSnackbarStore().showSnackbar(`Usuário ${user.contaBloqueada ? 'desbloqueado' : 'bloqueado'} com sucesso!`, 'success')
  } catch (error) {
    useSnackbarStore().showSnackbar(error, 'red')
    throw error
  }
}

// Função para facilitar a ativação e inativação da conta de um usuário
async function toggleUsuarioAtivo(user: UsuarioConsulta) {
  try {
    await usersDialog.toggleUsuarioAtivo(user)
    useSnackbarStore().showSnackbar(`Usuário ${user.ativo ? 'inativado' : 'ativado'} com sucesso!`, 'success')
  } catch (error) {
    useSnackbarStore().showSnackbar(error, 'red')
    throw error
  }
}

// Função para facilitar o reset para senha padrão da conta de um usuário
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

// Função para deletar a conta de um usuário
function deleteUser(idUser: number) {
  confirmarSenha.setCallbackPosSenha(async () => {
    try {
      await useServicesUsuario.deleteUser(idUser)
      useSnackbarStore().showSnackbar('Usuário removido!', 'success')
    } catch (error) {
      useSnackbarStore().showSnackbar(error, 'red')
    } finally {
      useDialogStoreUsers().apiUsers.value = await useServicesUsuario.getAllUsers()
    }
  })

  confirmarSenha.openDialogConfirmarSenha()
}
//#endregion

//#region Demais funções
// Função para controlar o v-expand-transition dos detalhes de cada usuario
function toggleUser(id: number) {
  expandedUserId.value = expandedUserId.value === id ? null : id
}

// Usuado no alert quando não o usuário não foi encontrado para exibir novamente a lista com o getAll
function clearSearch() {
  paginator.filtrosPaginator.value.search = ''
}

// Alterar a ordem da exibição da lista de usuários
function toggleOrderBy() {
  paginator.toggleOrderBy()
}
//#endregion
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

.v-progress-circular {
  margin: 1rem;
}
</style>
