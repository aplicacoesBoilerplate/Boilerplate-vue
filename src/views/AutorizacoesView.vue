<template>
  <!-- Dialog aberto pela edição -->
  <DialogAutorizacoes :model-value="dialogAutorizacoes"
    @update:modelValue="(val: DialogAutorizacoesClass) => Object.assign(dialogAutorizacoes, val)"
    @atualizar-autorizacoes="getAutorizacoes" />

  <!-- Card para definir tamanho de exibição e acoplar os demais elementos -->
  <v-card class="mx-auto" max-width="700">
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h6">Lista de autorizações</span>
      <BtnsFilterPaginator :show="filtrosAutorizacoes" @alterado-ordem="aoMudarOrdem"
        @alterado-apenas-hoje="aoMudarApenasHoje" @alterado-aprovacao="aoMudarAprovacao"
        @limpar-filtros="limparFiltros" />

      <!-- Campo para consultar as autorizações pelo usuários responsável inserindo no search -->
      <v-text-field clearable v-model="paginadorClass.search" density="compact" variant="outlined"
        placeholder="Usuário responsável" hide-details prepend-inner-icon="mdi-magnify" style="max-width: 300px" />
    </v-card-title>
    <v-divider />

    <!-- Loading -->
    <div class="d-flex justify-center" v-if="loading">
      <v-progress-circular color="primary" indeterminate />
    </div>

    <!-- Alerta quando nenhuma autorização consultada foi encontrada -->
    <div v-if="apiAutorizacoes?.totalRegistros == 0 && loading == false" class="pt-4">
      <v-alert text="Nenhuma autorização encontrada!" type="info" variant="tonal">
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

    <!-- Exibição das autorizações -->
    <v-virtual-scroll :items="apiAutorizacoes?.registros" height="500" item-height="50" v-else>
      <template v-slot:default="{ item: autorizacao }">
        <v-list-item
          :title="`${autorizacao.idAutorizacao} - Aprovação: ${autorizacao.aprovacaoSaida ? 'Autorizado' : 'Negado'}`"
          :subtitle="`#Data da autorização: ${autorizacao.dataAutorizacao ? `${autorizacao.dataAutorizacao}` : 'Não definido'}`"
          :class="autorizacao.aprovacaoSaida ? 'bg-green-accent-2' : 'bg-red-darken-2'">

          <!-- Ícone de cartão de autorização -->
          <template v-slot:prepend>
            <v-icon>mdi-book-check-outline</v-icon>
          </template>

          <!-- Botões de funcionalidades de mais informações e edição -->
          <template v-slot:append>
            <div class="pe-2">
              <v-btn size="small" variant="elevated" color="white" icon="mdi-information-outline"
                @click="toggleAutorizacao(autorizacao.idAutorizacao)" title="Informações">
              </v-btn>
              <span class="pr-2" />
              <!-- Menu de opções -->
              <v-menu transition="scale-transition">
                <template v-slot:activator="{ props }">
                  <v-btn size="small" color="primary" v-bind="props" icon="mdi-dots-vertical" title="Opções" />
                </template>
                <v-list>
                  <v-list-item>
                    <v-list-item-title>
                      <!-- Rejeitar autorização -->
                      <v-btn icon="mdi-lock" size="x-small" variant="tonal" color="red"
                        @click="negarAutorizacaoSaida(autorizacao)" title="Rejeitar" />
                      <span class="pr-2" />

                      <!-- Autorizar -->
                      <v-btn icon="mdi-lock-open-outline" size="x-small" variant="tonal" color="success"
                        @click="getAutorizacoesNegadasPorSaida(autorizacao)" title="Autorizar" />
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </template>
        </v-list-item>

        <!-- Card de detalhes para cada autorização, expanção controlada por uma variável -->
        <v-expand-transition>
          <div v-if="expandedUserId === autorizacao.idAutorizacao" class="custom-expansion-panel">
            <v-row dense>
              <!-- Autorização aprovação -->
              <v-col cols="6" class="d-flex justify-center">
                <v-chip color="info">
                  Usuário responsável:
                  {{ autorizacao.idFuncionarioAutorizacao }} - {{ autorizacao.nomeResponsavel }}
                </v-chip>
              </v-col>

              <v-divider vertical />

              <!-- Registro da saída relacionada -->
              <v-col cols="6" class="d-flex justify-center">
                <v-chip color="info">
                  Referente a saída:
                  {{ autorizacao.idSaida }}
                  <span class="pr-2" />
                  <BtnOpenDialog :callback="() => visualizarInformacoes(autorizacao.idSaida)" icon="mdi-eye-outline"
                    size="x-small" variant="outlined" color="info" class="pt-2" />
                </v-chip>

              </v-col>

              <v-col cols="12" v-if="autorizacao.observacaoAutorizacao">
                <v-divider />
                Observação: <br />
                {{ autorizacao.observacaoAutorizacao }}
              </v-col>
            </v-row>
          </div>
        </v-expand-transition>
        <v-divider />

        <!-- Dialog para exibição de observações de autorizações negadas de uma saída -->
        <DialogAutorizacoesNegadas :model-value="dialogAutorizacoesNegadas" @emitir-rejeicao="negarAutorizacaoSaida"
          @emitir-liberacao="emitirAutorizacao" />

      </template>
    </v-virtual-scroll>
  </v-card>
  <!-- Componente de paginação -->
  <Paginator v-model:paginator="paginadorClass" @mudouPagina="aoMudarPagina" @onBuscar="onBuscar"
    v-show="apiAutorizacoes?.totalRegistros! > 0 && !loading" />

  <!-- Dialog aberto pelo botão acima -->
  <DialogSaidas :model-value="dialogSaidas"
    @update:modelValue="(val: DialogSaidasClass) => Object.assign(dialogSaidas, val)" /> <!--Um crime-->

</template>

<script setup lang="ts">
//#region Imports
// Componentes
import DialogAutorizacoesNegadas from "@/components/dialog/dialogAutorizacoesNegadasPorSaida/DialogAutorizacoesNegadas.vue";
import DialogAutorizacoes from '@/components/dialog/dialogAutorizacoes/DialogAutorizacoes.vue';
import BtnsFilterPaginator from '@/components/paginator/BtnsFilterPaginator.vue'; // Componente visual que controla os filtros para consulta de registros
import DialogSaidas from "@/components/dialog/dialogSaidas/DialogSaidas.vue";
import BtnOpenDialog from "@/components/dialog/BtnOpenDialog.vue";
import Paginator from '@/components/paginator/Paginator.vue' // Componente visual para a paginação de registros

// Classes
import {
  DialogAutorizacoesNegadasClass
} from "@/components/dialog/dialogAutorizacoesNegadasPorSaida/ClassDialogAutorizacoesNegadas.ts";
import {
  DialogAutorizacoesClass
} from '@/components/dialog/dialogAutorizacoes/ClassDialogAutorizacoes';

import { PaginatorClass } from '@/components/paginator/ClassPaginator';
// Store

import { useSnackbarStore } from '@/stores/SnackbarStore';
// Models
import type {
  AutorizacoesConsulta,
  AutorizacoesSaidaConsulta
} from '@/models/saidasModels/saidasModels';

import type { HeaderPaginatorModel } from '@/models/HeaderPaginatorModel';
// Services

import { autorizacoesServices } from '@/services/autorizacoesServices';
// Vue
import { onMounted, ref, watch } from 'vue';
import { DialogSaidasClass } from "@/components/dialog/dialogSaidas/ClassDialogSaidas.ts";
//#endregion

//#region Variáveis
// Booleanos
const loading = ref(false) // Carregamento
const showDialog = ref(false) // Dialog de autorizações

// Classes
const dialogSaidas = ref(new DialogSaidasClass())
const dialogAutorizacoes = ref(new DialogAutorizacoesClass())
const dialogAutorizacoesNegadas = ref(new DialogAutorizacoesNegadasClass())
const paginadorClass = ref(new PaginatorClass({
  limite: 10,
  offset: 1,
  totalPaginas: 0,
  totalRegistros: 0,
  orderBy: 'DESC',
  search: ''
}))
const filtrosAutorizacoes = ref({
  exibirApenasHoje: true,
  exibirAprovacao: true
})

// Outros
const expandedUserId = ref<number | null>(null) // Painel de informações do usuário
const searchResponsavel = ref<string>() // Parâmetro para consultar usuários
var apiAutorizacoes = ref<HeaderPaginatorModel<AutorizacoesSaidaConsulta>>() // Armazena os dados da resposta das req para exibição no front

//#endregion

//#region Funcionalidades do Vue

onMounted(async () => {
  await getAutorizacoes()
})

watch(() => searchResponsavel.value, async (newValue) => {
  getAutorizacoes()
})

//#endregion

//#region para as autorizações facilitadas
// Abre o dialog para inserir a observação por ter negado a autorização
function negarAutorizacaoSaida(autorizacao: AutorizacoesConsulta) {
  dialogAutorizacoes.value.completeForm(autorizacao.idAutorizacao, false)
  showDialog.value = true
}

// Informa que a autorização foi enviada
async function emitirAutorizacao(autorizacao: AutorizacoesConsulta) {
  if (autorizacao.observacaoAutorizacao) {
    dialogAutorizacoes.value.completeForm(autorizacao.idAutorizacao, true)
    showDialog.value = true
    useSnackbarStore().showSnackbar('Reveja a observação da saída!', 'info')
  } else {
    const atualizarAutorizacao = { ...autorizacao }
    atualizarAutorizacao.aprovacaoSaida = true

    try {
      const response = await autorizacoesServices.atualizarAutorizacao(atualizarAutorizacao, autorizacao.idAutorizacao)

      apiAutorizacoes.value = response

      paginadorClass.value.atualizarDadosAPI({
        totalPaginas: response.totalPaginas,
        totalRegistros: response.totalRegistros,
      })

      useSnackbarStore().showSnackbar(`Autorização ${autorizacao.idAutorizacao} concedida para a saída ${autorizacao.idSaida}`, 'success')
    } catch (error) {
      useSnackbarStore().showSnackbar(error, 'red')
      throw error
    }
  }
}

//#endregion

//#region funções de consulta, controle e manipulação de usuários
// Consulta paginada de todas as autorizações do usuário responsável
async function getAutorizacoes() {
  loading.value = true
  try {

    const response = await autorizacoesServices.getAutorizacoes(paginadorClass.value)

    apiAutorizacoes.value = response

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

//#endregion

//#region funções para o dialog de autorizações negadas
async function getAutorizacoesNegadasPorSaida(autorizacao: AutorizacoesConsulta) {
  try {
    const response = (await autorizacoesServices.getAutorizacoesNegadasPorSaida(autorizacao.idSaida)).totalRegistros
    if (response > 0)
      dialogAutorizacoesNegadas.value.openDialog(autorizacao)
    else
      emitirAutorizacao(autorizacao)
  } catch (error) {
    throw error
  }
}

//#endregion

//#region Paginação e filtros

async function onBuscar() {
  await getAutorizacoes()
}

async function aoMudarPagina(novaPagina: number) {
  paginadorClass.value.atualizarPagina(novaPagina)
  await getAutorizacoes()
}

async function aoMudarOrdem() {
  paginadorClass.value.alterarOrdenacao()
  await getAutorizacoes()
}

async function aoMudarAprovacao() {
  paginadorClass.value.alterarFiltroAprovacao()
  await getAutorizacoes()
}

async function aoMudarApenasHoje() {
  paginadorClass.value.alterarFiltroApenasHoje()
  await getAutorizacoes()
}

async function limparFiltros() {
  paginadorClass.value.limparFiltros()
  await getAutorizacoes()
}

//#endregion

//#region DialogSaida
function visualizarInformacoes(idSaida: number) {
  dialogSaidas.value.visualizarInformacoes(idSaida)
  showDialog.value = true
}

//#endregion

//#region Demais funções
// Função para controlar o v-expand-transition dos detalhes de cada autorização
function toggleAutorizacao(id?: number) {
  if (id != null)
    expandedUserId.value = expandedUserId.value === id ? null : id
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
