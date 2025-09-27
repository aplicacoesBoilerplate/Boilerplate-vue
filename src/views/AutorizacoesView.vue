<template>
  <!-- Dialog aberto pela edição -->
  <DialogAutorizacoes v-model:dialogAutorizacoes="dialogAutorizacoes" @atualizar-autorizacoes="getAutorizacoes" />

  <!-- Card para definir tamanho de exibição e acoplar os demais elementos -->
  <v-card class="mx-auto" max-width="700">
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h6">{{ tituloCard }}</span>
      <BtnsFilterPaginator :paginator="paginadorClass" :show="filtrosAutorizacoes" @alterado-ordem="aoMudarOrdem"
        @alterado-apenas-hoje="aoMudarApenasHoje" @alterado-aprovacao="aoMudarAprovacao"
        @alterar-input="alterarInputSearch" @limpar-filtros="limparFiltros" />

      <!-- Campo para consultar as autorizações pelos demais campos de busca inserindo no search -->
      <InputUpperCase v-if="!paginadorClass.alterarInput" v-model:="paginadorClass.search" :style="{
        icon: 'mdi-magnify',
        density: 'compact',
        btnDisabled: !paginadorClass.search,
        inputVariant: 'outlined',
        btnVariant: 'text',
        label: 'Consultar autorizações',
        showPrepend: true,
        hint: 'Motivo, categoria, registro, nome ou setor',
        maxWidth: 300,
      }" @on-prepend-click="getAutorizacoes" />

      <!-- Campo para consultar as autorizações pelo usuários responsável inserindo no search -->
      <InputUpperCase v-else v-model:="paginadorClass.funcionarioResponsavel" :style="{
        icon: 'mdi-magnify',
        density: 'compact',
        btnDisabled: !paginadorClass.funcionarioResponsavel,
        inputVariant: 'outlined',
        btnVariant: 'text',
        label: 'Consultar responsável',
        showPrepend: true,
        hint: 'Código, nome, email',
        maxWidth: 300,
      }" @on-prepend-click="getAutorizacoes" />

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
          :title="`${autorizacao.idAutorizacao}: ${autorizacao.nomeFuncionario} - ${identificarInformacoes(autorizacao.aprovacaoSaida, autorizacao.dataAutorizacao).status}`"
          :subtitle="`#Responsável: ${autorizacao.nomeResponsavel}`"
          :class="identificarInformacoes(autorizacao.aprovacaoSaida, autorizacao.dataAutorizacao).cor">

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
                        @click="negarAutorizacaoSaida(autorizacao)" title="Negar" />
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
              <!-- Informações do responsável pelo erro -->
              <v-col cols="12" class="d-flex justify-center">
                <v-chip color="info">
                  INFORMAÇÕES DA AUTORIZAÇÃO
                </v-chip>
              </v-col>
            </v-row>
            <br>

            <!-- Responsável pela autorização -->
            <v-row dense style="border-bottom: 2px solid black;">
              <v-col cols="6" class="font-weight-medium text-info mb-1">
                Responsável pela autorização:
              </v-col>
              <v-col cols="6" class="mb-1">
                {{ autorizacao.idFuncionarioAutorizacao }} - {{ autorizacao.nomeResponsavel }}
              </v-col>
            </v-row>

            <!-- Data da autorização -->
            <v-row dense style="border-bottom: 2px solid black;">
              <v-col cols="6" class="font-weight-medium text-info mb-1">
                Data da autorização:
              </v-col>
              <v-col cols="6" class="mb-1">
                {{ autorizacao.dataAutorizacao ?? 'Não definido' }}
              </v-col>
            </v-row>

            <!-- Status da autorização -->
            <v-row dense style="border-bottom: 2px solid black;">
              <v-col cols="6" class="font-weight-medium text-info mb-1">
                Aprovação:
              </v-col>
              <v-col cols="6" class="mb-1"
                :class="identificarInformacoes(autorizacao.aprovacaoSaida, autorizacao.dataAutorizacao).texto">
                {{ identificarInformacoes(autorizacao.aprovacaoSaida, autorizacao.dataAutorizacao).status }}
              </v-col>
            </v-row>

            <v-row dense style="border-bottom: 2px solid black;">
              <v-col cols="6" class="font-weight-medium text-info mb-1">
                Status da saída:
              </v-col>
              <v-col cols="6" class="mb-1" :class="identificarStyleStatusSaida(autorizacao.statusSaida).texto">
                {{ autorizacao.statusSaida }}
              </v-col>
            </v-row>

            <!-- Data da resposta da autorização -->
            <v-row dense style="border-bottom: 2px solid black;">
              <v-col cols="6" class="font-weight-medium text-info mb-1">
                Data de emissão:
              </v-col>
              <v-col cols="6" class="mb-1" :class="autorizacao.dataAutorizacao ? 'text-success' : 'text-red'">
                {{ autorizacao.dataAutorizacao ? autorizacao.dataAutorizacao : 'Não definido' }}
              </v-col>
            </v-row>

            <v-row dense v-if="autorizacao.observacaoAutorizacao" style="border-bottom: 2px solid black;">
              <v-col cols="6" class="font-weight-medium text-info mb-1">
                Observação:
              </v-col>
              <v-col cols="6" class="mb-1">
                {{ autorizacao.observacaoAutorizacao }}
              </v-col>
            </v-row>

            <!-- Registro da saída relacionada -->
            <v-col cols="12" class="d-flex justify-center">
              <v-chip color="info">
                Referente a saída:
                {{ autorizacao.idSaida }}
                <span class="pr-2" />
                <BtnOpenDialog :callback="() => visualizarInformacoes(autorizacao.idSaida)" icon="mdi-eye-outline"
                  size="x-small" variant="outlined" color="info" class="pt-2" />
              </v-chip>
            </v-col>
          </div>
        </v-expand-transition>
        <v-divider />

        <!-- Dialog para exibição de observações de autorizações negadas de uma saída -->
        <DialogAutorizacoesNegadas v-model:negadas="dialogAutorizacoesNegadas" @emitir-rejeicao="negarAutorizacaoSaida"
          @emitir-liberacao="emitirAutorizacao" />

      </template>
    </v-virtual-scroll>
  </v-card>
  <!-- Componente de paginação -->
  <Paginator v-model:paginator="paginadorClass" @mudouPagina="aoMudarPagina" @onBuscar="onBuscar"
    v-show="apiAutorizacoes?.totalRegistros! > 0 && !loading" />

  <!-- Dialog aberto pelo botão acima -->
  <DialogSaidas v-model:dialog-saidas="dialogSaidas" :visualizando="true"/>

</template>

<script setup lang="ts">
//#region Imports
// Componentes
import DialogAutorizacoesNegadas from "@/components/dialog/dialogAutorizacoesNegadasPorSaida/DialogAutorizacoesNegadas.vue";
import DialogAutorizacoes from '@/components/dialog/dialogAutorizacoes/DialogAutorizacoes.vue';
import BtnsFilterPaginator from '@/components/paginator/BtnsFilterPaginator.vue'; // Componente visual que controla os filtros para consulta de registros
import DialogSaidas from "@/components/dialog/dialogSaidas/DialogSaidas.vue";
import BtnOpenDialog from "@/components/dialog/BtnOpenDialog.vue";
import Paginator from '@/components/paginator/Paginator.vue'; // Componente visual para a paginação de registros
import InputUpperCase from '@/components/InputUpperCase.vue'; // Componente visual do input upper case

// Classes
import { DialogAutorizacoesNegadasClass } from "@/components/dialog/dialogAutorizacoesNegadasPorSaida/ClassDialogAutorizacoesNegadas.ts";
import { DialogAutorizacoesClass } from '@/components/dialog/dialogAutorizacoes/ClassDialogAutorizacoes';
import { DialogSaidasClass } from "@/components/dialog/dialogSaidas/ClassDialogSaidas.ts";
import { PaginatorClass } from '@/components/paginator/ClassPaginator';

// Store
import { useSnackbarStore } from '@/stores/SnackbarStore';
import { useInatividadeStore } from "@/stores/inatividade";

// Models
import type { AutorizacoesConsulta, AutorizacoesSaidaConsulta } from '@/models/saidasModels/saidasModels';
import type { HeaderPaginatorModel } from '@/models/HeaderPaginatorModel';

// Services
import { autorizacoesServices } from '@/services/autorizacoesServices';

// Vue
import { onBeforeMount, onUnmounted, ref } from 'vue';
//#endregion

//#region Variáveis
// Booleanos
const loading = ref(false) // Carregamento
const showDialog = ref(false) // Dialog de autorizações

// Classes
const dialogSaidas = ref(new DialogSaidasClass())
const dialogAutorizacoes = ref<DialogAutorizacoesClass>(new DialogAutorizacoesClass())
const dialogAutorizacoesNegadas = ref<DialogAutorizacoesNegadasClass>(new DialogAutorizacoesNegadasClass())
const paginadorClass = ref(new PaginatorClass({
  limite: 10,
  offset: 1,
  totalPaginas: 0,
  totalRegistros: 0,
  orderBy: 'DESC',
  search: '',
  apenasHoje: true
}))
const filtrosAutorizacoes = ref({
  exibirApenasHoje: true,
  exibirAprovacao: true,
  exibirAlterarInput: true
})

// Outros
const expandedUserId = ref<number | null>(null) // Painel de informações do usuário
const inatividadeStore = useInatividadeStore();
var apiAutorizacoes = ref<HeaderPaginatorModel<AutorizacoesSaidaConsulta>>() // Armazena os dados da resposta das req para exibição no front

//#endregion

//#region Funcionalidades do Vue
onBeforeMount(async () => {
  await getAutorizacoes();
  inatividadeStore.setAcaoAtualizar(getAutorizacoes);
});

onUnmounted(() => {
    inatividadeStore.setAcaoAtualizar(null);
});
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
    } finally {
      await getAutorizacoes()
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

    paginadorClass.value.alterarInput ? tituloCard.value = 'Lista de autorizações' : tituloCard.value = 'Suas autorizações'

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

//#region identificadores para o template
const tituloCard = ref('Suas autorizações');

interface informacoesIdentificadas {
  cor: string
  texto: string
  status: string
}

function identificarInformacoes(aprovacao?: boolean, dataAprovacao?: string | null): informacoesIdentificadas {
  const informacoes = ref<informacoesIdentificadas>({
    cor: '',
    texto: '',
    status: ''
  })

  if (dataAprovacao) {
    if (aprovacao) {
      informacoes.value.cor = 'bg-green-accent-2'
      informacoes.value.texto = 'text-success'
      informacoes.value.status = 'AUTORIZAÇÃO: AUTORIZADO'
    }
    else {
      informacoes.value.cor = 'bg-red-darken-2'
      informacoes.value.texto = 'text-red'
      informacoes.value.status = 'AUTORIZAÇÃO: NEGADA'
    }
  } else {
    informacoes.value.cor = 'bg-blue-grey-lighten-3'
    informacoes.value.texto = 'text-grey'
    informacoes.value.status = 'AUTORIZAÇÃO: PENDENTE'
  }

  return informacoes.value
}

function identificarStyleStatusSaida(statusSaida?: string): informacoesIdentificadas {
  const informacoes = ref<informacoesIdentificadas>({
    cor: '',
    texto: '',
    status: ''
  })

  if (statusSaida) {
    if (statusSaida == 'PENDENTE') { }
    informacoes.value.texto = 'text-blue-grey-lighten-3'
    if (statusSaida == 'NEGADA')
      informacoes.value.texto = 'text-red-darken-2'
    if (statusSaida == 'AUTORIZADA')
      informacoes.value.texto = 'text-green-accent-2'
    if (statusSaida == 'AUTORIZAÇÕES PENDENTES')
      informacoes.value.texto = 'text-orange-darken-1'
  }

  return informacoes.value
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

function alterarInputSearch() {
  paginadorClass.value.alterarInput = !paginadorClass.value.alterarInput
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

//#region demais funcoes
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
