<template>
  <!-- Botão que recebe o callback para abrir um dialog -->
  <BtnOpenDialog :callback="openNovoMotivo" :label="'Criar novo motivo'" />

  <!-- Dialog aberto pelo botão acima -->
  <DialogMotivos :model-value="dialogMotivos"
    @update:modelValue="(val: DialogMotivosClass) => Object.assign(dialogMotivos, val)"
    @operacao-concluida="getAllMotivos" />

  <!-- Card para definir tamanho de exibição e acoplar os demais elementos -->
  <v-card class="mx-auto" max-width="700">
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h6">Lista de motivos</span>

      <v-btn icon size="x-small" color="primary" variant="outlined" title="Ordem" @click="aoMudarOrdem()">
        <v-icon>{{ paginadorClass.orderBy == 'ASC' ? "mdi-arrow-down" : "mdi-arrow-up" }}
        </v-icon>
      </v-btn>

      <!-- Campo para consultar os motivos pelo search -->
      <InputUpperCase v-model:="paginadorClass.search" :style="{
        icon: 'mdi-magnify',
        density: 'compact',
        disabled: !paginadorClass.search,
        inputVariant: 'outlined',
        btnVariant: 'text',
        label: 'Consultar motivos',
        showPrepend: true,
        hint: 'Código, descrição ou categoria',
        maxWidth: 300,
      }" @on-prepend-click="getAllMotivos" />
    </v-card-title>
    <v-divider />

    <!-- Loading -->
    <div class="d-flex justify-center" v-if="loading">
      <v-progress-circular color="primary" indeterminate />
    </div>

    <!-- Alerta quando nenhum motivo consultado foi encontrado -->
    <div v-if="apiMotivos?.totalRegistros == 0 && loading == false" class="pt-4">
      <v-alert text="Nenhum motivo encontrado!" type="info" variant="tonal">
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

    <!-- Exibição dos motivos -->
    <v-virtual-scroll :items="apiMotivos?.registros" height="500" item-height="50" v-else>
      <template v-slot:default="{ item: motivo }">
        <v-list-item :title="`${motivo.idMotivo} - ${motivo.descricaoMotivo}`"
          :subtitle="`#categoria: ${motivo.categoriaMotivo}`">

          <!-- Ícone de cartão de motivo -->
          <template v-slot:prepend>
            <v-icon>mdi-list-box-outline</v-icon>
          </template>

          <!-- Botões de menu -->
          <template v-slot:append>
            <!-- Menu de opções -->
            <v-menu transition="scale-transition">
              <template v-slot:activator="{ props }">
                <v-btn size="small" color="primary" v-bind="props" icon="mdi-dots-vertical" title="Opções" />
              </template>
              <v-list>
                <v-list-item>
                  <v-list-item-title>
                    <!-- Editar motivo -->
                    <v-btn icon="mdi-pencil" size="x-small" variant="tonal" color="primary"
                      @click="completeFormEditMotivoDialog(motivo)" title="Editar" />
                    <span class="pr-2" />

                    <!-- Funcionalidade sensível de remoção de motivo, precisa de confirmação de senha -->
                    <v-btn icon="mdi-delete-outline" size="x-small" variant="tonal" color="red"
                      @click="deleteMotivo(motivo.idMotivo)" title="Remover" />
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-list-item>
        <v-divider />
      </template>
    </v-virtual-scroll>
  </v-card>
  <!-- Componente de paginação -->
  <Paginator v-model:paginator="paginadorClass" @mudouPagina="aoMudarPagina" @onBuscar="onBuscar"
    v-show="apiMotivos?.totalRegistros! > 0 && !loading" />

  <DialogConfirmarSenha :model-value="confirmarSenha"
    @update:modelValue="(val: ConfirmarSenhaClass) => Object.assign(confirmarSenha, val)" />
</template>

<script setup lang="ts">
//#region Imports
// Componentes
import DialogConfirmarSenha from '@/components/dialog/confirmarSenha/DialogConfirmarSenha.vue'; // Componente visual para confirmação de senha
import DialogMotivos from '@/components/dialog/dialogMotivo/DialogMotivos.vue'; // Componente visual para o dialog de motivos
import BtnOpenDialog from '@/components/dialog/BtnOpenDialog.vue'; // Botão para abrir o Dialog
import Paginator from '@/components/paginator/Paginator.vue' // Componente visual para a paginação de registros
import InputUpperCase from '@/components/InputUpperCase.vue'; // Componente visual do input upper case

// Classes
import { PaginatorClass } from '@/components/paginator/ClassPaginator';
import { DialogMotivosClass } from '@/components/dialog/dialogMotivo/ClassDialogMotivos';
import { ConfirmarSenhaClass } from '@/components/dialog/confirmarSenha/ClassConfirmarSenha';

// Store
import { useSnackbarStore } from '@/stores/SnackbarStore';

// Models
import type { MotivoConsulta } from '@/models/motivosModels/MotivosModels';
import type { HeaderPaginatorModel } from '@/models/HeaderPaginatorModel';

// Services
import { motivosServices } from '@/services/motivosServices';

// Vue
import { onMounted, ref, watch } from 'vue';
//#endregion

//#region Variáveis
// Booleanos
const loading = ref(false) // Carregamento
const showDialog = ref(false) // Dialog de motivos

// Classes
const confirmarSenha = ref(new ConfirmarSenhaClass())
const dialogMotivos = ref(new DialogMotivosClass())
const paginadorClass = ref(new PaginatorClass({ limite: 10, offset: 1, totalPaginas: 0, totalRegistros: 0, orderBy: 'DESC', search: '' })) // Classe para a paginação

// Outros
var apiMotivos = ref<HeaderPaginatorModel<MotivoConsulta>>() // Armazena os dados da resposta das req para exibição no front

//#endregion

//#region Funcionalidades do Vue

onMounted(async () => {
  await getAllMotivos()
})

//#endregion

//#region Dialog de motivos
// Métodos para manipular o dialog de motivo
function openNovoMotivo() {
  dialogMotivos.value.openDialog()
  showDialog.value = true
}

function completeFormEditMotivoDialog(motivo: MotivoConsulta) {
  dialogMotivos.value.completeForm(motivo.idMotivo)
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

//#region funções de consulta, controle e manipulação de motivos
// Consulta paginada de todos os motivos, aceita diversos parâmetros, inclusive o search
async function getAllMotivos() {
  loading.value = true
  try {
    const response = await motivosServices.getMotivos(paginadorClass.value)

    apiMotivos.value = response

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
// Função para deletar um motivo
async function deleteMotivo(idMotivo: number) {
  abrirDialogConfirmacao(async () => {
    try {
      await motivosServices.deleteMotivo(idMotivo)
      useSnackbarStore().showSnackbar('Motivo removido!', 'success')
    } catch (error) {
      useSnackbarStore().showSnackbar(error, 'red')
    } finally {
      await getAllMotivos()
    }
  })
}
//#endregion
//#endregion

//#region Paginação
async function onBuscar() {
  await getAllMotivos()
}

async function aoMudarPagina(novaPagina: number) {
  paginadorClass.value.atualizarPagina(novaPagina)
  await getAllMotivos()
}

async function aoMudarOrdem() {
  paginadorClass.value.alterarOrdenacao()
  await getAllMotivos()
}

async function limparFiltros() {
  paginadorClass.value.limparFiltros()
  await getAllMotivos()
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
