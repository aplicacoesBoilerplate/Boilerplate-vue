<template>
  <!-- Botão que recebe o callback para abrir um dialog -->
  <BtnOpenDialog :callback="openNewUser" :label="'Criar novo usuário'" />

  <!-- Dialog aberto pelo botão acima -->
  <DialogUsers :model-value="dialogUsers" @update:modelValue="clonarObjetoDialogUsers(dialogUsers)"
    @operacao-concluida="getAllUsers" />

  <!-- Card para definir tamanho de exibição e acoplar os demais elementos -->
  <v-card class="mx-auto" max-width="700">
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h6">Lista de usuários</span>

      <v-btn icon size="x-small" color="primary" variant="outlined" title="Ordem" @click="aoMudarOrdem()">
        <v-icon>{{ paginadorClass.orderBy == 'ASC' ? "mdi-arrow-down" : "mdi-arrow-up" }}
        </v-icon>
      </v-btn>

      <!-- Campo para consultar os usuários pelo search -->
      <InputUpperCase v-model:="paginadorClass.search" :style="{
        icon: 'mdi-magnify',
        density: 'compact',
        btnDisabled: !paginadorClass.search,
        inputVariant: 'outlined',
        btnVariant: 'text',
        label: 'Consultar usuário',
        showPrepend: true,
        hint: 'Código, nome, email ou permissao',
        maxWidth: 300,
      }" @on-prepend-click="getAllUsers" />
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
          <v-btn color="warning" variant="plain" @click="limparFiltros()">
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
        <v-list-item :title="`${user.idUsuario} - ${user.nome}`" :subtitle="`#email: ${user.email}`">

          <!-- Ícone de cartão de usuário -->
          <template v-slot:prepend>
            <v-icon>mdi-card-account-details-outline</v-icon>
          </template>

          <!-- Botões de funcionalidades de mais informações e menu -->
          <template v-slot:append>
            <div class="pe-2">
              <v-btn size="small" variant="elevated" color="white" icon="mdi-information-outline"
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
                    <!-- <RouterLink to="/tasks" custom v-slot="{ navigate }">
                      <v-btn icon="mdi-format-list-bulleted" size="x-small" variant="tonal" color="primary"
                        @click="navigate" :disabled="user.idUsuario == 1" title="Vínculos" />
                    </RouterLink>
                    <span class="pr-2" /> -->

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
  <Paginator v-model:paginator="paginadorClass" @mudouPagina="aoMudarPagina" @onBuscar="onBuscar"
    v-show="apiUsers?.totalRegistros! > 0 && !loading" />
  <DialogConfirmarSenha :model-value="confirmarSenha" @update:modelValue="clonarObjetoConfirmarSenha(confirmarSenha)" />

</template>

<script setup lang="ts">
//#region Imports
// Componentes
import InputUpperCase from '@/components/InputUpperCase.vue'; // Componente visual do input upper case
import Paginator from '@/components/paginator/Paginator.vue'; // Componente visual para a paginação de registros
import BtnOpenDialog from '@/components/dialog/BtnOpenDialog.vue'; // Botão para abrir o Dialog
import DialogUsers from '@/components/dialog/dialogUser/DialogUsers.vue'; // Componente visual para o dialog de usuários
import DialogConfirmarSenha from '@/components/dialog/confirmarSenha/DialogConfirmarSenha.vue'; // Componente visual para confirmação de senha

// Classes
import { PaginatorClass } from '@/components/paginator/ClassPaginator';
import { ConfirmarSenhaClass } from '@/components/dialog/confirmarSenha/ClassConfirmarSenha';
import { DialogUsersClass } from '@/components/dialog/dialogUser/ClassDialogUsers';

// Store
import { useSnackbarStore } from '@/stores/SnackbarStore';

// Models
import type { UsuarioConsulta } from '@/models/usersModels/UsuariosModels';
import type { HeaderPaginatorModel } from '@/models/HeaderPaginatorModel';

// Services
import { usuariosServices } from '@/services/usuariosService';
import { authServices } from "@/services/authService.ts";

// Vue
import { onMounted, ref, watch } from 'vue';
//#endregion

//#region Variáveis
// Booleanos
const loading = ref(false) // Carregamento
const showDialog = ref(false) // Dialog de usuários

// Classes
const confirmarSenha = ref(new ConfirmarSenhaClass())
const dialogUsers = ref(new DialogUsersClass())
const paginadorClass = ref(new PaginatorClass({ limite: 10, offset: 1, totalPaginas: 0, totalRegistros: 0, orderBy: 'DESC', search: '' })) // Classe para a paginação

// Outros
const expandedUserId = ref<number | null>(null) // Painel de informações do usuário
var apiUsers = ref<HeaderPaginatorModel<UsuarioConsulta>>() // Armazena os dados da resposta das req para exibição no front

//#endregion

//#region Funcionalidades do Vue
onMounted(async () => {
  await getAllUsers()
})

//#endregion

//#region Dialog de usuários
// Métodos para manipular o dialog de usuário
function openNewUser() {
  dialogUsers.value.openDialog()
  showDialog.value = true
}

function completeFormEditUserDialog(user: UsuarioConsulta) {
  dialogUsers.value.completeForm(user.idUsuario!)
  showDialog.value = true
}
//#endregion

//#region Dialog confirmar senha
// Abrir o dialog já com o callback setado
function abrirDialogConfirmacao(callback: () => Promise<void>) {
  confirmarSenha.value.setCallback(callback)
  confirmarSenha.value.openDialog()
}

//#endregion

//#region funções de consulta, controle e manipulação de usuários
// Consulta paginada de todos os usuários
async function getAllUsers() {
  loading.value = true
  try {
    const response = await usuariosServices.getAllUsers(paginadorClass.value)

    apiUsers.value = response

    paginadorClass.value.atualizarDadosAPI({
      totalPaginas: response.totalPaginas,
      totalRegistros: response.totalRegistros,
    })
  } catch (error) {
    useSnackbarStore().showSnackbar(error, 'red')
    throw error
  } finally {
    loading.value = false
  }
}

// Função para facilitar o bloqueio e desbloqueio da conta de um usuário
async function toggleBloqueioUsuario(user: UsuarioConsulta) {
  const userToEdit = { ...user }
  userToEdit.contaBloqueada = !userToEdit.contaBloqueada
  try {
    await usuariosServices.updateUser(userToEdit)
    useSnackbarStore().showSnackbar(`Usuário ${user.contaBloqueada ? 'desbloqueado' : 'bloqueado'} com sucesso!`, 'success')
  } catch (error) {
    useSnackbarStore().showSnackbar(error, 'red')
    throw error
  } finally {
    await getAllUsers()
  }
}

// Função para facilitar a ativação e inativação da conta de um usuário
async function toggleUsuarioAtivo(user: UsuarioConsulta) {
  const userToEdit = { ...user }
  userToEdit.ativo = !userToEdit.ativo
  try {
    await usuariosServices.updateUser(userToEdit)
    useSnackbarStore().showSnackbar(`Usuário ${user.ativo ? 'inativado' : 'ativado'} com sucesso!`, 'success')
  } catch (error) {
    useSnackbarStore().showSnackbar(error, 'red')
    throw error
  } finally {
    await getAllUsers()
  }
}

//#region Funções sensíveis
// Função para facilitar o reset para senha padrão da conta de um usuário
async function resetarSenhaAoPadrao(emailUsuario: string) {
  abrirDialogConfirmacao(async () => {
    try {
      await authServices().resetarSenhaAoPadrao(emailUsuario)
      useSnackbarStore().showSnackbar(`Senha resetada com sucesso para o usuário: ${emailUsuario}`, 'success')
    } catch (error) {
      useSnackbarStore().showSnackbar(error, 'red')
      throw error
    }
  })
}

// Função para deletar a conta de um usuário
function deleteUser(idUser: number) {
  abrirDialogConfirmacao(async () => {
    try {
      await usuariosServices.deleteUser(idUser)
      useSnackbarStore().showSnackbar('Usuário removido!', 'success')
    } catch (error) {
      useSnackbarStore().showSnackbar(error, 'red')
    } finally {
      await getAllUsers()
    }
  })
}
//#endregion
//#endregion

//#region Paginação
async function onBuscar() {
  await getAllUsers()
}

async function aoMudarPagina(novaPagina: number) {
  paginadorClass.value.atualizarPagina(novaPagina)
  await getAllUsers()
}

async function aoMudarOrdem() {
  paginadorClass.value.alterarOrdenacao()
  await getAllUsers()
}

async function limparFiltros() {
  paginadorClass.value.limparFiltros()
  await getAllUsers()
}

//#endregion

//#region Demais funções
// Função para controlar o v-expand-transition dos detalhes de cada usuario
function toggleUser(id: number) {
  expandedUserId.value = expandedUserId.value === id ? null : id
}

function clonarObjetoConfirmarSenha(val: ConfirmarSenhaClass) {
  Object.assign(confirmarSenha, val)
}

function clonarObjetoDialogUsers(val: DialogUsersClass) {
  Object.assign(dialogUsers, val)
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
