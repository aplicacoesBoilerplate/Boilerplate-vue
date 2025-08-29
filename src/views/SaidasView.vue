<template>
  <!-- Botão que recebe o callback para abrir um dialog -->
  <BtnOpenDialog :callback="openNewSaida" :label="'Solicitar nova saída'" />

  <!-- Dialog aberto pelo botão acima -->
  <DialogSaidas :model-value="dialogSaidas" @update:modelValue="clonarObjetoDialogSaidas(dialogSaidas)"
    @operacao-concluida="getAllSaidas" />

  <!-- Card para definir tamanho de exibição e acoplar os demais elementos -->
  <v-card class="mx-auto" max-width="700">
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h6">Lista de saídas</span>

      <BtnsFilterPaginator :paginator="paginadorClass" :show="filtrosSaidas" @alterado-ordem="aoMudarOrdem"
        @alterado-apenas-hoje="aoMudarApenasHoje" @alterado-aprovacao="aoMudarAprovacao"
        @limpar-filtros="limparFiltros" />

      <!-- Campo para consultar as saídas pelo search -->
      <InputUpperCase v-model:="paginadorClass.search" :style="{
        icon: 'mdi-magnify',
        density: 'compact',
        btnDisabled: !paginadorClass.search,
        inputVariant: 'outlined',
        btnVariant: 'text',
        label: 'Consultar saída',
        showPrepend: true,
        hint: 'Motivo, obs, status, registro, nome ou setor',
        maxWidth: 300,
      }" @on-prepend-click="getAllSaidas" />

    </v-card-title>
    <v-divider />

    <!-- Loading -->
    <div class="d-flex justify-center" v-if="loading">
      <v-progress-circular color="primary" indeterminate />
    </div>

    <!-- Alerta quando nenhum usuário consultado foi encontrado -->
    <div v-if="apiSaidas?.totalRegistros == 0 && loading == false" class="pt-4">
      <v-alert text="Nenhuma saída encontrada!" type="info" variant="tonal">
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

    <!-- Exibição das saídas -->
    <v-virtual-scroll :items="apiSaidas?.registros" height="500" item-height="50" v-else>
      <template v-slot:default="{ item: saida }">
        <v-list-item :title="`${saida.idSaida} - ${saida.nomeFuncionario}: ${saida.numeroRegistroFuncionario} - ${saida.statusSaida}`"
          :subtitle="identificarSubtitulo(saida)" :class="identificarStyleStatusSaida(saida.statusSaida).cor">

          <!-- Ícone de cartão de saída -->
          <template v-slot:prepend>
            <v-icon>mdi-exit-run</v-icon>
          </template>

          <!-- Botões de funcionalidades de mais informações e menu -->
          <template v-slot:append>
            <div class="pe-2">
              <v-btn size="small" variant="elevated" color="white" icon="mdi-information-outline"
                @click="toggleSaida(saida.idSaida)" title="Informações">
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
                    <!-- Editar saída -->
                    <v-btn icon="mdi-pencil" size="x-small" variant="tonal" color="primary"
                      @click="completeFormEditSaidaDialog(saida)" title="Editar" />
                    <span class="pr-2" />

                    <!-- Funcionalidade sensível de remoção de saída, precisa de confirmação de senha -->
                    <v-btn icon="mdi-delete-outline" size="x-small" variant="tonal" color="red"
                      @click="deleteSaida(saida.idSaida)" title="Remover" />
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-list-item>

        <!-- Card de detalhes para cada saída, expanção controlada por uma variável -->
        <v-expand-transition>
          <div v-if="expandedSaidaId === saida.idSaida" class="custom-expansion-panel">
            <v-row dense>
              <!-- Informações do usuário -->
              <v-col cols="12" class="d-flex justify-center">
                <v-chip color="info">
                  INFORMAÇÕES DA SAÍDA
                </v-chip>
              </v-col>
            </v-row>
            <br>
            <br>

            <!-- Data de solicitação da saída -->
            <v-row dense style="border-bottom: 2px solid black;">
              <v-col cols="6" class="font-weight-medium text-info mb-1">
                Solicitada em:
              </v-col>
              <v-col cols="6" class="mb-1">
                {{ saida.dataSolicitacaoSaida }}
              </v-col>
            </v-row>

            <!-- Status saída -->
            <v-row dense style="border-bottom: 2px solid black;">
              <v-col cols="6" class="font-weight-medium text-info mb-1">
                Status da saída:
              </v-col>
              <v-col cols="6" class="mb-1" :class="identificarStyleStatusSaida(saida.statusSaida).texto">
                {{ saida.statusSaida }}
              </v-col>
            </v-row>

            <!-- Aprovação Saída -->
            <v-row dense style="border-bottom: 2px solid black;">
              <v-col cols="6" class="d-flex justify-space-between font-weight-medium text-info mb-1">
                Autorizada em:
              </v-col>
              <v-col :class="saida.dataAprovacaoSaida ? 'text-success mb-1' : 'text-red mb-1'">
                {{ saida.dataAprovacaoSaida ? saida.dataAprovacaoSaida : 'Não autorizada' }}
              </v-col>
            </v-row>

              <!-- Previsão de Saída -->
            <v-row dense v-if="saida.dataSaidaFuncionario || saida.dataChegadaFuncionario" style="border-bottom: 2px solid black;">
              <v-col cols="6" class="font-weight-medium text-info mb-1">
                Previsão para saída:
              </v-col>
              <v-col cols="6" class="mb-1">
                {{ saida.dataPrevisaoSaidaFuncionario }}
              </v-col>
            </v-row>

              <!-- Previsão de retorno -->
            <v-row dense v-if="saida.dataSaidaFuncionario || saida.dataChegadaFuncionario" style="border-bottom: 2px solid black;">
              <v-col cols="6" class="font-weight-medium text-info mb-1">
                Previsão para retorno:
              </v-col>
              <v-col cols="6" class="mb-1">
                {{ saida.confirmaRetorno ? `${saida.dataPrevisaoChegadaFuncionario}` : 'Não retorna' }}
              </v-col>
            </v-row>

            <!-- Saída real -->
            <v-row dense v-if="saida.dataSaidaFuncionario" style="border-bottom: 2px solid black;">
              <v-col cols="6" class="font-weight-medium text-info mb-1">
                Data da saída:
              </v-col>
              <v-col cols="6" class="mb-1">
                {{ saida.dataSaidaFuncionario }}
              </v-col>
            </v-row>

            <!-- Retorno real -->
            <v-row dense v-if="saida.dataSaidaFuncionario" style="border-bottom: 2px solid black;">
              <v-col cols="6" class="font-weight-medium text-info mb-1">
                Data do retorno:
              </v-col>
              <v-col cols="6" class="mb-1">
                {{ saida.confirmaRetorno ? `${saida.dataChegadaFuncionario}` : 'Não retorna' }}
              </v-col>
            </v-row>

            <!-- Funcionário que irá sair -->
            <v-row dense style="border-bottom: 2px solid black;">
              <v-col cols="6" class="font-weight-medium text-info mb-1">
                Saída para o Funcionário:
              </v-col>
              <v-col cols="6" class="mb-1">
                {{ saida.numeroRegistroFuncionario }}: {{ saida.nomeFuncionario }}
              </v-col>
            </v-row>

            <!-- Setor do funcionário que irá sair -->
            <v-row dense style="border-bottom: 2px solid black;">
              <v-col cols="6" class="font-weight-medium text-info mb-1">
                Setor do funcionário:
              </v-col>
              <v-col cols="6" class="mb-1">
                {{ saida.setorFuncionario }}
              </v-col>
            </v-row>

            <!-- Motivo pelo qual o funcionário está saindo -->
            <v-row dense style="border-bottom: 2px solid black;">
              <v-col cols="6" class="font-weight-medium text-info mb-1">
                Motivo da saída:
              </v-col>
              <v-col cols="6" class="mb-1">
                {{ saida.motivoSaida }}: {{ saida.descricaoMotivo }}
              </v-col>
            </v-row>

            <!-- Usuário responsável por emitir a saída -->
            <v-row dense style="border-bottom: 2px solid black;">
              <v-col cols="6" class="font-weight-medium text-info mb-1">
                Responsável pela saída:
              </v-col>
              <v-col cols="6" class="mb-1">
                {{ saida.nomeFuncionarioResponsavelSaida }}
              </v-col>
            </v-row>

            <v-row dense style="border-bottom: 2px solid black;">
              <v-col cols="6" class="font-weight-medium text-info mb-1">
                Saída para o Funcionário:
              </v-col>
              <v-col cols="6" class="mb-1">
                {{ saida.nomeFuncionario }}
              </v-col>
            </v-row>

            <!-- Observações da saída -->
            <v-row dense v-if="saida.observacaoSaida != ''" style="border-bottom: 2px solid black;">
              <v-col cols="6" class="font-weight-medium text-info mb-1">
                Observação da saída:
              </v-col>
              <v-col cols="6" class="mb-1">
                {{ saida.observacaoSaida }}
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
    v-show="apiSaidas?.totalRegistros! > 0 && !loading" />
  <DialogConfirmarSenha :model-value="confirmarSenha" @update:modelValue="clonarObjetoConfirmarSenha(confirmarSenha)" />

</template>

<script setup lang="ts">
//#region Imports
// Componentes
import Paginator from '@/components/paginator/Paginator.vue'; // Componente visual para a paginação de registros
import InputUpperCase from '@/components/InputUpperCase.vue'; // Componente visual do input upper case
import BtnOpenDialog from '@/components/dialog/BtnOpenDialog.vue'; // Botão para abrir o Dialog
import DialogSaidas from '@/components/dialog/dialogSaidas/DialogSaidas.vue'; // Componente visual para o dialog de saídas
import BtnsFilterPaginator from '@/components/paginator/BtnsFilterPaginator.vue'; // Componente visual que controla os filtros para consulta de registros
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
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { gerenciamentoInatividade } from '@/utils/gerenciamentoInatividade';
//#endregion

//#region Variáveis
// Booleanos
const loading = ref(false) // Carregamento
const showDialog = ref(false) // Dialog de saídas

// Classes
const confirmarSenha = ref(new ConfirmarSenhaClass())
const dialogSaidas = ref(new DialogSaidasClass())
const paginadorClass = ref(new PaginatorClass({ limite: 10, offset: 1, totalPaginas: 0, totalRegistros: 0, orderBy: 'DESC', search: '' })) // Classe para a paginação
const filtrosSaidas = ref({
  exibirApenasHoje: true,
  exibirAprovacao: true
})

// Outros
const expandedSaidaId = ref<number | null>(null) // Painel de informações da saída
var apiSaidas = ref<HeaderPaginatorModel<SaidaConsulta>>() // Armazena os dados da resposta das req para exibição no front
let watcherinatividade: gerenciamentoInatividade | null = null;

//#endregion

//#region Funcionalidades do Vue
onMounted(async () => {
  watcherinatividade = new gerenciamentoInatividade(async () => {
    await getAllSaidas();
  }, 600000);

  watcherinatividade.start();
});

onUnmounted(() => {
  watcherinatividade?.stop();
});
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

//#region Funções sensíveis
// Função para deletar saída
function deleteSaida(idSaida?: number) {
  abrirDialogConfirmacao(async () => {
    if (idSaida != null) {
      try {
        await saidasServices.deleteSaida(idSaida)
        useSnackbarStore().showSnackbar('Saída removida!', 'success')
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
async function onBuscar() {
  await getAllSaidas()
}

async function aoMudarPagina(novaPagina: number) {
  paginadorClass.value.atualizarPagina(novaPagina)
  await getAllSaidas()
}

async function aoMudarOrdem() {
  paginadorClass.value.alterarOrdenacao()
  await getAllSaidas()
}

async function aoMudarAprovacao() {
  paginadorClass.value.alterarFiltroAprovacao()
  await getAllSaidas()
}

async function aoMudarApenasHoje() {
  paginadorClass.value.alterarFiltroApenasHoje()
  await getAllSaidas()
}

async function limparFiltros() {
  paginadorClass.value.limparFiltros()
  await getAllSaidas()
}

//#endregion

//#region Demais funções
// Função para controlar o v-expand-transition dos detalhes de cada saída
function toggleSaida(id?: number) {
  if (id != null)
    expandedSaidaId.value = expandedSaidaId.value === id ? null : id
}

function identificarSubtitulo(saida: SaidaConsulta): string {
  const definindoSubtitulo = ref('')

  if (saida.dataSaidaFuncionario) { // Se o funcionário possuí o campo de data de saída preenchido, significa que ele está fora da empresa
    if (saida.confirmaRetorno) { // Ele pode ou não retornar
      if (saida.dataChegadaFuncionario) { // Se ele puder retornar e tiver a data de retorno preenchida, ele já está na empresa novamente
        definindoSubtitulo.value = `D. saída: ${saida.dataSaidaFuncionario} - D. retorno: ${saida.dataChegadaFuncionario}` // Se ele já saiu e retornou, mostrar as datas reais
      } else { // Se ele já saiu mas ainda não retornou, mostrar a data real de saída e a previsão de retorno
        definindoSubtitulo.value = `D. saída: ${saida.dataSaidaFuncionario} - P. retorno: ${saida.dataPrevisaoChegadaFuncionario}`
      }
    } else {
      definindoSubtitulo.value = `D. saída: ${saida.dataSaidaFuncionario}` // Se ele não tem retorno, exibe apenas a saída
    }
  } else { // Em caso de ainda não ter a data de saída, significa que ainda está na empresa, portanto existe apenas a previsão
    if (saida.confirmaRetorno) { // Se ele tem confirmação de retorno, mostrar as duas previsões
      definindoSubtitulo.value = `P. saída: ${saida.dataPrevisaoSaidaFuncionario} - P. retorno: ${saida.dataPrevisaoChegadaFuncionario}`
    } else { // Se ele não terá retorno, mostrar apenas a previsão de saída
      definindoSubtitulo.value = `P. saída: ${saida.dataPrevisaoSaidaFuncionario}`
    }
  }

  return definindoSubtitulo.value
}

interface informacoesIdentificadas {
  cor: string
  texto: string
  status: string
}

function identificarStyleStatusSaida(statusSaida?: string): informacoesIdentificadas {
  const informacoes = ref<informacoesIdentificadas>({
    cor: '',
    texto: '',
    status: ''
  })

  if (statusSaida) {
    if (statusSaida == 'PENDENTE') {
      informacoes.value.cor = 'bg-blue-grey-lighten-3'
      informacoes.value.texto = 'text-blue-grey-lighten-3'
    }
    if (statusSaida == 'NEGADA') {
      informacoes.value.cor = 'bg-red-darken-2'
      informacoes.value.texto = 'text-red-darken-2'
    }
    if (statusSaida == 'AUTORIZADA') {
      informacoes.value.cor = 'bg-green-accent-2'
      informacoes.value.texto = 'text-green-accent-2'
    }
    if (statusSaida == 'AUTORIZACOES_PENDENTES') {
      informacoes.value.cor = 'bg-orange-darken-1'
      informacoes.value.texto = 'text-orange-darken-1'
    }
    if (statusSaida == 'EXECUTANDO') {
      informacoes.value.cor = 'bg-deep-orange-lighten-1'
      informacoes.value.texto = 'text-deep-orange-lighten-1'
    }
    if (statusSaida == 'REALIZADA') {
      informacoes.value.cor = 'bg-green-darken-4'
      informacoes.value.texto = 'text-green-darken-4'
    }
  }

  return informacoes.value
}

function clonarObjetoConfirmarSenha(val: ConfirmarSenhaClass) {
  Object.assign(confirmarSenha, val)
}

function clonarObjetoDialogSaidas(val: DialogSaidasClass) {
  Object.assign(dialogSaidas, val)
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

.linha-detalhe {
  display: flex;
  align-items: center;
  position: relative;
}

.linha-detalhe .rotulo {
  white-space: nowrap;
  padding-right: 8px;
  position: relative;
}

.linha-detalhe .valor {
  white-space: nowrap;
  padding-left: 8px;
}

.linha-detalhe::before {
  content: "";
  flex-grow: 1;
  height: 1px;
  border-bottom: 1px dotted rgba(255, 255, 255, 0.3); /* ou qualquer cor */
  margin: 0 4px;
  transform: translateY(1px); /* alinha a linha com o texto */
}


</style>
