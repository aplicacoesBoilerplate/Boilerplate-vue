<template>
  <!-- Botão que recebe o callback para abrir um dialog -->
  <BtnOpenDialog :callback="openNovaCategoria" :label="'Criar nova categoria'" />

  <!-- Dialog aberto pelo botão acima -->
  <DialogCategorias :model-value="dialogCategorias" @update:modelValue="clonarObjetoDialogCategorias(dialogCategorias)"
    @operacao-concluida="getAllCategorias" />

  <!-- Card para definir tamanho de exibição e acoplar os demais elementos -->
  <v-card class="mx-auto" max-width="700">
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h6">Lista de categorias</span>

      <BtnsFilterPaginator :paginator="paginadorClass" :show="{ exibirOrdem: true, exibirAprovacao: true }"
        @alterado-ordem="aoMudarOrdem" @alterado-aprovacao="aoMudarAprovacao" @limpar-filtros="limparFiltros" />

      <!-- Campo para consultar as categorias pelo search -->
      <InputUpperCase v-model:="paginadorClass.search" :style="{
        icon: 'mdi-magnify',
        density: 'compact',
        btnDisabled: !paginadorClass.search,
        inputVariant: 'outlined',
        btnVariant: 'text',
        label: 'Consultar categorias',
        showPrepend: true,
        hint: 'Código ou descrição',
        maxWidth: 300,
      }" @on-prepend-click="getAllCategorias" />
    </v-card-title>
    <v-divider />

    <!-- Loading -->
    <div class="d-flex justify-center" v-if="loading">
      <v-progress-circular color="primary" indeterminate />
    </div>

    <!-- Alerta quando nenhuma categoria consultado foi encontrada -->
    <div v-if="apiCategorias?.totalRegistros == 0 && loading == false" class="pt-4">
      <v-alert text="Nenhuma categoria encontrada!" type="info" variant="tonal">
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

    <!-- Exibição das categorias -->
    <v-virtual-scroll :items="apiCategorias?.registros" height="500" item-height="50" v-else>
      <template v-slot:default="{ item: categoria }">
        <v-list-item :title="`${categoria.idCategoria} - ${categoria.descricaoCategoria}`"
          :subtitle="`#emergencial: ${ categoria.emergencial ? 'SIM' : 'NÃO' }`">

          <!-- Ícone de cartão de categoria -->
          <template v-slot:prepend>
            <v-icon>mdi-bookmark-multiple-outline</v-icon>
          </template>

          <!-- Botões de menu -->
          <template v-slot:append>

            <div class="pe-2">
              <v-btn size="small" variant="elevated" color="white" icon="mdi-information-outline"
                @click="toggleCategoria(categoria.idCategoria)" title="Informações">
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
                    <!-- Editar categoria -->
                    <v-btn icon="mdi-pencil" size="x-small" variant="tonal" color="primary"
                      @click="completeFormEditCategoriaDialog(categoria)" title="Editar" />
                    <span class="pr-2" />

                    <!-- Funcionalidade sensível de remoção de categoria, precisa de confirmação de senha -->
                    <v-btn icon="mdi-delete-outline" size="x-small" variant="tonal" color="red"
                      @click="deleteCategoria(categoria.idCategoria)" title="Remover" />
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-list-item>
        <!-- Card de detalhes para cada categoria, expanção controlada por uma variável -->
        <v-expand-transition>
          <div v-if="expandedCategoriaId === categoria.idCategoria" class="custom-expansion-panel">
            <v-divider />

            <v-row dense>
              <!-- Informações da categoria -->
              <v-col cols="12" class="d-flex justify-center">
                <v-chip color="info">
                  INFORMAÇÕES DA CATEGORIA
                </v-chip>
              </v-col>
            </v-row>
            <br>
            <br>

            <v-row dense style="border-bottom: 2px solid black;">
              <v-col cols="6" class="font-weight-medium text-info mb-1">
                Descrição:
              </v-col>
              <v-col cols="6" class="mb-1">
                {{ categoria.descricaoCategoria }}
              </v-col>
            </v-row>

            <v-row dense style="border-bottom: 2px solid black;">
              <v-col cols="6" class="font-weight-medium text-info mb-1">
                Emergencial:
              </v-col>
              <v-col cols="6" class="mb-1" :class="!categoria.emergencial ? 'text-success' : 'text-red'">
                {{ categoria.emergencial ? 'SIM' : 'NÃO' }}
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
    v-show="apiCategorias?.totalRegistros! > 0 && !loading" />

  <DialogConfirmarSenha :model-value="confirmarSenha" @update:modelValue="clonarObjetoConfirmarSenha(confirmarSenha)" />
</template>

<script setup lang="ts">
//#region Imports
// Componentes
import DialogConfirmarSenha from '@/components/dialog/confirmarSenha/DialogConfirmarSenha.vue'; // Componente visual para confirmação de senha
import DialogCategorias from '@/components/dialog/dialogCategorias/DialogCategorias.vue';  // Componente visual para o dialog de categorias
import BtnsFilterPaginator from '@/components/paginator/BtnsFilterPaginator.vue'; // Componente visual que controla os filtros para consulta de registros
import BtnOpenDialog from '@/components/dialog/BtnOpenDialog.vue'; // Botão para abrir o Dialog
import Paginator from '@/components/paginator/Paginator.vue' // Componente visual para a paginação de registros
import InputUpperCase from '@/components/InputUpperCase.vue'; // Componente visual do input upper case

// Classes
import { PaginatorClass } from '@/components/paginator/ClassPaginator';
import { ConfirmarSenhaClass } from '@/components/dialog/confirmarSenha/ClassConfirmarSenha';
import { DialogCategoriasClass } from '@/components/dialog/dialogCategorias/ClassDialogCategorias';

// Store
import { useSnackbarStore } from '@/stores/SnackbarStore';

// Models
import type { CategoriasMotivos } from '@/models/motivosModels/MotivosModels';
import type { HeaderPaginatorModel } from '@/models/HeaderPaginatorModel';

// Services
import { categoriasServices } from '@/services/categoriasServices';

// Vue
import { onMounted, ref } from 'vue';
//#endregion

//#region Variáveis
// Booleanos
const loading = ref(false) // Carregamento
const showDialog = ref(false) // Dialog de categorias

// Classes
const confirmarSenha = ref(new ConfirmarSenhaClass())
const dialogCategorias = ref(new DialogCategoriasClass())
const paginadorClass = ref(new PaginatorClass({ limite: 10, offset: 1, totalPaginas: 0, totalRegistros: 0, orderBy: 'DESC', search: '' })) // Classe para a paginação

// Outros
var apiCategorias = ref<HeaderPaginatorModel<CategoriasMotivos>>() // Armazena os dados da resposta das req para exibição no front
const expandedCategoriaId = ref<number | null>(null) // Painel de informações da categoria
//#endregion

//#region Funcionalidades do Vue

onMounted(async () => {
  await getAllCategorias()
})

//#endregion

//#region Dialog de categorias
// Métodos para manipular o dialog de categorias
function openNovaCategoria() {
  dialogCategorias.value.openDialog()
  showDialog.value = true
}

function completeFormEditCategoriaDialog(categoria: CategoriasMotivos) {
  dialogCategorias.value.completeForm(categoria.idCategoria)
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

//#region funções de consulta, controle e manipulação de categorias
// Consulta paginada de todas as categorias, aceita diversos parâmetros, inclusive o search
async function getAllCategorias() {
  loading.value = true
  try {
    const response = await categoriasServices.getCategorias(paginadorClass.value)

    apiCategorias.value = response

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
// Função para deletar uma categoria
async function deleteCategoria(idCategoria: number) {
  abrirDialogConfirmacao(async () => {
    try {
      await categoriasServices.deleteCategoria(idCategoria)
      useSnackbarStore().showSnackbar('Categoria removida!', 'success')
    } catch (error) {
      useSnackbarStore().showSnackbar(error, 'red')
    } finally {
      await getAllCategorias()
    }
  })
}
//#endregion
//#endregion

//#region Paginação
async function onBuscar() {
  await getAllCategorias()
}

async function aoMudarPagina(novaPagina: number) {
  paginadorClass.value.atualizarPagina(novaPagina)
  await getAllCategorias()
}

async function aoMudarOrdem() {
  paginadorClass.value.alterarOrdenacao()
  await getAllCategorias()
}

async function aoMudarAprovacao() {
  paginadorClass.value.alterarFiltroAprovacao()
  await getAllCategorias()
}

async function limparFiltros() {
  paginadorClass.value.limparFiltros()
  await getAllCategorias()
}
//#endregion

//#region demais funções
function clonarObjetoConfirmarSenha(val: ConfirmarSenhaClass) {
  Object.assign(confirmarSenha, val)
}

function clonarObjetoDialogCategorias(val: DialogCategoriasClass) {
  Object.assign(dialogCategorias, val)
}

// Função para controlar o v-expand-transition dos detalhes de cada erro
function toggleCategoria(id?: number) {
  if (id != null)
    expandedCategoriaId.value = expandedCategoriaId.value === id ? null : id
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
</style>
