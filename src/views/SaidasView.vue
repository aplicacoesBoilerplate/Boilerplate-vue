<template>
  <!-- Botão que recebe o callback para abrir um dialog -->
  <BtnOpenDialog :callback="openNewSaida" :label="'Solicitar nova saída'" />

  <!-- Dialog aberto pelo botão acima -->
  <DialogSaidas :model-value="dialogSaidas"
    @update:modelValue="(val: DialogSaidasClass) => Object.assign(dialogSaidas, val)" />

  <!-- Card para definir tamanho de exibição e acoplar os demais elementos -->
  <v-card class="mx-auto" max-width="700">
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h6">Lista de saídas</span>
      <v-btn title="Ordem" variant="outlined" color="primary" density="compact"
        @click="aoMudarOrdem(paginadorClass.orderBy || 'ASC')">
        <v-icon>{{ paginadorClass.orderBy == 'ASC' ? "mdi-arrow-down" : "mdi-arrow-up" }}
        </v-icon>
      </v-btn>

      <!-- Campo para consultar os usuários pelo search -->
      <v-text-field clearable v-model="paginadorClass.search" density="compact" variant="outlined"
        placeholder="Consultar funcionário" hide-details prepend-inner-icon="mdi-magnify" style="max-width: 300px" />
    </v-card-title>
    <v-divider />

    <!-- Loading -->
    <div class="d-flex justify-center" v-if="loading">
      <v-progress-circular color="primary" indeterminate />
    </div>

    <!-- Alerta quando nenhum usuário consultado foi encontrado -->
    <div v-if="apiSaidas?.totalRegistros == 0 && loading == false" class="pt-4">
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
    <v-virtual-scroll :items="apiSaidas?.registros" height="500" item-height="50" v-else>
      <template v-slot:default="{ item: user }">
        <v-list-item :title="`${user.idSaida}`" :subtitle="`#email: ${user.idFuncionarioResponsavelSaida}`">

          <!-- Ícone de cartão de usuário -->
          <template v-slot:prepend>
            <v-icon>mdi-card-account-details-outline</v-icon>
          </template>

          <!-- Botões de funcionalidades de mais informações e menu -->
          <template v-slot:append>
            <div class="pe-2">
              <v-btn size="small" variant="elevated" color="dark" icon="mdi-information-outline"
                @click="toggleSaida(user.idSaida)" title="Informações">
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
                      @click="completeFormEditSaidaDialog(user)" title="Editar" />
                    <span class="pr-2" />

                    <!-- Visualizar vínculos do usuário com saídas -->
                    <!-- <RouterLink to="/tasks" custom v-slot="{ navigate }">
                      <v-btn icon="mdi-format-list-bulleted" size="x-small" variant="tonal" color="primary"
                        @click="navigate" :disabled="user.idUsuario == 1" title="Vínculos" />
                    </RouterLink>
                    <span class="pr-2" /> -->

                    <!-- Facilitador para bloqueio e desbloqueio do usuário -->
                    <!-- <v-btn :icon="user.contaBloqueada ? 'mdi-lock-outline' : 'mdi-lock-open-variant-outline'"
                      size="x-small" variant="tonal" :color="user.contaBloqueada ? 'red' : 'success'"
                      @click="toggleBloqueioUsuario(user)" :disabled="user.idUsuario == 1"
                      :title="user.contaBloqueada ? 'Desbloquear' : 'Bloquear'" />
                    <span class="pr-2" /> -->

                    <!-- Facilitador para ativar ou desativar um usuário -->
                    <!-- <v-btn :icon="user.ativo ? 'mdi-account-check-outline' : 'mdi-account-cancel-outline'"
                      size="x-small" variant="tonal" :color="user.ativo ? 'success' : 'red'"
                      @click="toggleUsuarioAtivo(user)" :disabled="user.idUsuario == 1"
                      :title="user.ativo ? 'Inativar' : 'Ativar'" />
                    <span class="pr-2" /> -->

                    <!-- Funcionalidade sensível de resetar senha do usuário, precisa de confirmação de senha -->
                    <!-- <v-btn icon="mdi-lock-reset" size="x-small" variant="tonal" color="warning"
                      @click="resetarSenhaAoPadrao(user.email)" :disabled="user.idUsuario == 1" title="Resetar senha" />
                    <span class="pr-2" /> -->

                    <!-- Funcionalidade sensível de remoção de saída, precisa de confirmação de senha -->
                    <v-btn icon="mdi-delete-outline" size="x-small" variant="tonal" color="red"
                      @click="deleteSaida(user.idSaida)" title="Remover" />
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-list-item>

        <!-- Card de detalhes para cada usuário, expanção controlada por uma variável -->
        <v-expand-transition>
          <div v-if="expandedSaidaId === user.idSaida" class="custom-expansion-panel">
            <v-row dense>
              <!-- Retorno do funcionario -->
              <v-col cols="6" class="d-flex justify-center">
                <v-chip :color="user.confirmaRetorno ? 'success' : 'red'">
                  Retorno confirmado?
                  {{ user.confirmaRetorno ? 'Retorna' : 'Sem retorno' }}
                </v-chip>
              </v-col>

              <v-divider vertical />

              <!-- Conta bloqueada -->
              <!-- <v-col cols="6" class="d-flex justify-center">
                <v-chip :color="!user. ? 'success' : 'red'">
                  Login está liberado?
                  {{ user.contaBloqueada ? 'Bloqueado' : 'Liberado' }}
                </v-chip>
              </v-col> -->

              <v-divider />
            </v-row>
          </div>
        </v-expand-transition>
        <v-divider />
      </template>
    </v-virtual-scroll>
  </v-card>
  <!-- Componente de paginação -->
  <Paginator :model-value="paginadorClass" @mudouLimite="aoMudarLimite" @mudouPagina="aoMudarPagina"
    v-if="apiSaidas?.totalRegistros! > 0 && !loading" />
  <DialogConfirmarSenha :model-value="confirmarSenha"
    @update:modelValue="(val: ConfirmarSenhaClass) => Object.assign(confirmarSenha, val)" />

</template>

<script setup lang="ts">
//#region Imports
// Componentes
import Paginator from '@/components/paginator/Paginator.vue' // Componente visual para a paginação de registros
import BtnOpenDialog from '@/components/dialog/BtnOpenDialog.vue'; // Botão para abrir o Dialog
import DialogSaidas from '@/components/dialog/dialogSaidas/DialogSaidas.vue'; // Componente visual para o dialog de saídas
import DialogConfirmarSenha from '@/components/dialog/confirmarSenha/DialogConfirmarSenha.vue'; // Componente visual para confirmação de senha

// Classes
import { PaginatorClass } from '@/components/paginator/ClassPaginator';
import { DialogSaidasClass } from '@/components/dialog/dialogSaidas/ClassDialogSaidas';
import { ConfirmarSenhaClass } from '@/components/dialog/confirmarSenha/ClassConfirmarSenha';

// Store
import { useSnackbarStore } from '@/stores/SnackbarStore';

// Models
import type { HeaderPaginatorModel } from '@/models/HeaderPaginatorModel';
import type { SaidaConsulta } from '@/models/saidasModels/saidasModels';

// Services
import { saidasServices } from '@/services/saidasServices';

// Vue
import { onMounted, ref, watch } from 'vue';
//#endregion

//#region Variáveis
// Booleanos
const loading = ref(false) // Carregamento
const showDialog = ref(false) // Dialog de saídas

// Classes
const confirmarSenha = ref(new ConfirmarSenhaClass())
const dialogSaidas = ref(new DialogSaidasClass())
const paginadorClass = ref(new PaginatorClass({ limite: 10, offset: 1, totalPaginas: 0, totalRegistros: 0, orderBy: 'DESC', search: '' })) // Classe para a paginação

// Outros
const expandedSaidaId = ref<number | null>(null) // Painel de informações da saída
const searchSaida = ref<string>() // Parâmetro para consultar saidas
var apiSaidas = ref<HeaderPaginatorModel<SaidaConsulta>>() // Armazena os dados da resposta das req para exibição no front

//#endregion

//#region Funcionalidades do Vue
onMounted(async () => {
  await getAllSaidas()
})

watch(() => searchSaida.value, async (newValue) => {
  if (newValue !== null && newValue !== '')
    await searchSaidas()
  else
    getAllSaidas()
})

watch(() => paginadorClass.value, () => {
  if (paginadorClass.value.search != null && paginadorClass.value.search != '')
    searchSaidas()
  else
    getAllSaidas()
}, { deep: true })

//#endregion

//#region Dialog de saídas
// Métodos para manipular o dialog de saídas
function openNewSaida() {
  dialogSaidas.value.openDialog()
  showDialog.value = true
}

function completeFormEditSaidaDialog(saida: SaidaConsulta) {
  dialogSaidas.value.completeForm(saida.idSaida)
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

//#region funções de consulta, controle e manipulação de saídas
// Consulta paginada de todas as saídas
async function getAllSaidas() {
  loading.value = true
  try {
    const response = await saidasServices.getAllSaidas(paginadorClass.value)

    apiSaidas.value = response

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
// Consulta com parâmetro de saídas, também pagina os resultados
async function searchSaidas() {
  loading.value = true
  try {
    const response = await saidasServices.getSaidaByFuncionario(paginadorClass.value)
    apiSaidas.value = response

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

//#region Funções sensíveis
// Função para deletar saída
function deleteSaida(idSaida?: number) {
  abrirDialogConfirmacao(async () => {
    if (idSaida != null) {
      try {
        await saidasServices.deleteSaida(idSaida)
        useSnackbarStore().showSnackbar('Saídas removida!', 'success')
      } catch (error) {
        useSnackbarStore().showSnackbar(error, 'red')
      } finally {
        await getAllSaidas()
      }
    }
  })
}
//#endregion
//#endregion

//#region Paginação
async function aoMudarLimite(novoLimite: number) {
  paginadorClass.value.atualizarLimite(novoLimite)
  await getAllSaidas()
}

async function aoMudarPagina(novaPagina: number) {
  paginadorClass.value.atualizarPagina(novaPagina)
  await getAllSaidas()
}

async function aoMudarOrdem(ordem: string) {
  paginadorClass.value.alterarOrdenacao(ordem)
  await getAllSaidas()
}
//#endregion

//#region Demais funções
// Função para controlar o v-expand-transition dos detalhes de cada saída
function toggleSaida(id?: number) {
  if (id != null)
    expandedSaidaId.value = expandedSaidaId.value === id ? null : id
}

// Usado no alert quando não o usuário não foi encontrado para exibir novamente a lista com o getAll
function clearSearch() {
  paginadorClass.value.search = ''
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
