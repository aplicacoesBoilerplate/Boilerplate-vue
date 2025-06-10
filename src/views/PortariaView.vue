<template>
  <!-- Card para definir tamanho de exibição e acoplar os demais elementos -->
  <v-card class="mx-auto" max-width="1000">
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h6">Controle Portaria</span>

      <BtnsFilterPaginator :paginator="paginadorClass" :show="filtrosPortaria" @alterado-ordem="aoMudarOrdem"
        @alterado-apenas-hoje="aoMudarApenasHoje" @alterado-aprovacao="aoMudarAprovacao"
        @limpar-filtros="limparFiltros" />

      <!-- Campo para consultar as saídas pelo search -->
      <InputUpperCase v-model:="paginadorClass.search" :style="{
        icon: 'mdi-magnify',
        density: 'compact',
        btnDisabled: !paginadorClass.search,
        inputVariant: 'outlined',
        btnVariant: 'text',
        label: 'Consultar por funcionário',
        showPrepend: true,
        hint: 'Motivo, registro, nome ou setor',
        maxWidth: 400,
      }" @on-prepend-click="getPortaria" />
    </v-card-title>
    <v-divider />

    <!-- Loading -->
    <div class="d-flex justify-center" v-if="loading">
      <v-progress-circular color="primary" indeterminate />
    </div>

    <!-- Alerta quando nenhum usuário consultado foi encontrado -->
    <div v-if="apiPortaria?.totalRegistros == 0 && loading == false" class="pt-4">
      <v-alert text="Nenhum registro encontrado!" type="info" variant="tonal">
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
    <v-virtual-scroll :items="apiPortaria?.registros" height="500" item-height="50" v-else>
      <template v-slot:default="{ item: portaria }">
        <v-list-item :title="`${portaria.idSaida} - ${portaria.nomeFuncionario}: ${portaria.numeroRegistroFuncionario}`"
          :subtitle="identificarSubtitulo(portaria)" :class="identificarStylePeloStatus(portaria.statusSaida)">

          <!-- Ícone de cartão de saída -->
          <template v-slot:prepend>
            <v-icon>mdi-exit-run</v-icon>
          </template>

          <!-- Botões de funcionalidades de mais informações e menu -->
          <template v-slot:append>
            <div class="pe-2">
              <v-btn size="small" variant="elevated" color="info" icon="mdi-location-exit"
                @click="lancamentoSaidaFuncionario(portaria.idSaida)" :disabled="portaria.dataSaidaFuncionario != null"
                title="Lançar horário de saída">
              </v-btn>
            </div>
            <div class="pe-2">
              <v-btn size="small" variant="elevated" color="info" icon="mdi-arrow-u-down-left"
                @click="lancamentoRetornoFuncionario(portaria.idSaida)"
                :disabled="!portaria.confirmaRetorno || portaria.dataChegadaFuncionario != null || portaria.dataSaidaFuncionario == null"
                title="Lançar horário de retorno">
              </v-btn>
            </div>
            <div class="pe-2">
              <v-btn size="small" variant="elevated" color="white" icon="mdi-information-outline"
                @click="toggleSaida(portaria.idSaida)" title="Informações">
              </v-btn>
            </div>
            <div>
              <v-btn size="small" variant="elevated" color="white" icon="mdi-lock-check"
                @click="toggleAutorizacoesDaSaida(portaria.idSaida)" title="Autorizações"
                :disabled="portaria.autorizacoes.length == 0">
              </v-btn>
            </div>
          </template>
        </v-list-item>

        <!-- Card de detalhes para cada saída, expanção controlada por uma variável -->
        <v-expand-transition>
          <div v-if="expandedSaidaId === portaria.idSaida" class="custom-expansion-panel">
            <v-row dense>
              <!-- Data de solicitação da saída -->
              <v-col cols="6" class="d-flex justify-center">
                <v-chip color="info">
                  Solicitada em:
                  {{ portaria.dataSolicitacaoSaida }}
                </v-chip>
              </v-col>

              <v-divider vertical />

              <!-- Aprovação Saída -->
              <v-col cols="6" class="d-flex justify-center">
                <v-chip :color="portaria.dataAprovacaoSaida ? 'success' : 'red'">
                  Autorizada em:
                  {{ portaria.dataAprovacaoSaida ? portaria.dataAprovacaoSaida : 'Não autorizada' }}
                </v-chip>
              </v-col>

              <v-divider />
            </v-row>

            <v-row dense v-if="portaria.dataSaidaFuncionario || portaria.dataChegadaFuncionario">
              <!-- Previsão de saída -->
              <v-col cols="6" class="d-flex justify-center">
                <v-chip color="info">
                  Data P. saída:
                  {{ portaria.dataPrevisaoSaidaFuncionario }}
                </v-chip>
              </v-col>

              <v-divider vertical />

              <!-- Saída real -->
              <v-col cols="6" class="d-flex justify-center">
                <v-chip color="info">
                  Data P. retorno:
                  {{ portaria.confirmaRetorno ? `${portaria.dataPrevisaoChegadaFuncionario}` : 'Não retorna' }}
                </v-chip>
              </v-col>

              <v-divider />
            </v-row>

            <v-row dense>
              <v-col cols="12" color="info">
                <!-- Motivo da saída -->
                Emitida por: {{ portaria.nomeFuncionarioResponsavelSaida }}
                <br />
                Status: {{ portaria.statusSaida }}
                <br />
                Motivo saída:
                {{ portaria.motivoSaida }}: {{ portaria.categoriaMotivo }} - {{ portaria.descricaoMotivo }}
                <br />
                <!-- Observação da saída -->
                {{ portaria.observacao_saida ? `Observações da saída: \n${portaria.observacao_saida}` : '' }}
              </v-col>
            </v-row>
          </div>
        </v-expand-transition>

        <v-divider />

        <!-- Card de detalhes para as autorizacoes cada saída, expanção controlada por uma variável -->
        <v-expand-transition>
          <div v-if="expandedAutorizacoesDaSaida === portaria.idSaida" class="custom-expansion-panel">
            <v-row dense v-for="autorizacao in portaria.autorizacoes">
              <!-- Data de solicitação da saída -->
              <v-col cols="6">
                Responsável pela autorização:
                {{ autorizacao.idFuncionarioAutorizacao }} - {{ autorizacao.nomeResponsavel }}
              </v-col>
              <v-col cols="6 d-flex justify-end">
                <v-chip :color="autorizacao.aprovacaoSaida ? 'success' : 'red'">
                  {{ autorizacao.aprovacaoSaida ? 'Aprovada' : 'Rejeitada' }}
                </v-chip>
              </v-col>

              <!-- Segunda linha -->
              <v-col cols="12">
                Data da autorização:
                {{ autorizacao.dataAutorizacao }}
              </v-col>

              <!-- Terceira linha -->
              <v-col cols="12">
                Observações desta autorização:
                {{ autorizacao.observacaoAutorizacao }}
              </v-col>

              <v-divider />
            </v-row>
          </div>
        </v-expand-transition>

        <v-divider />
      </template>
    </v-virtual-scroll>
  </v-card>
  <!-- Componente de paginação -->
  <Paginator v-model:paginator="paginadorClass" @mudouPagina="aoMudarPagina" @onBuscar="onBuscar"
    v-show="apiPortaria?.totalRegistros! > 0 && !loading" />

  <DialogConfirmarSenha :model-value="confirmarSenha" @update:modelValue="clonarObjetoConfirmarSenha(confirmarSenha)" />

</template>

<script setup lang="ts">
//#region Imports
// Componentes
import InputUpperCase from '@/components/InputUpperCase.vue'; // Componente visual do input upper case
import Paginator from '@/components/paginator/Paginator.vue' // Componente visual para a paginação de registros
import BtnsFilterPaginator from '@/components/paginator/BtnsFilterPaginator.vue'; // Componente visual que controla os filtros para consulta de registros
import DialogConfirmarSenha from '@/components/dialog/confirmarSenha/DialogConfirmarSenha.vue'; // Componente visual para confirmação de senha

// Classes
import { PaginatorClass } from '@/components/paginator/ClassPaginator';
import { ConfirmarSenhaClass } from '@/components/dialog/confirmarSenha/ClassConfirmarSenha';

// Store
import { useSnackbarStore } from '@/stores/SnackbarStore';

// Models
import type { HeaderPaginatorModel } from '@/models/HeaderPaginatorModel';
import type { SaidasComAutorizacoes } from '@/models/saidasModels/saidasModels';

// Services
import { portariaServices } from '@/services/portariaServices';

// Vue
import { onMounted, ref } from 'vue';
//#endregion

//#region Variáveis
// Booleanos
const loading = ref(false) // Carregamento

// Classes
const confirmarSenha = ref(new ConfirmarSenhaClass())
const paginadorClass = ref(new PaginatorClass({ limite: 10, offset: 1, totalPaginas: 0, totalRegistros: 0, orderBy: 'DESC', search: '' })) // Classe para a paginação
const filtrosPortaria = ref({
  exibirApenasHoje: true,
  exibirAprovacao: true
})

// Outros
const expandedSaidaId = ref<number | null>(null) // Painel de informações da saída
const expandedAutorizacoesDaSaida = ref<number | null>(null) // Painel de informações da saída
var apiPortaria = ref<HeaderPaginatorModel<SaidasComAutorizacoes>>() // Armazena os dados da resposta das req para exibição no front

//#endregion

//#region Funcionalidades do Vue

onMounted(async () => {
  await getPortaria()
})

//#endregion

//#region funções de consulta, controle e manipulação de motivos
// Consulta paginada de todos os motivos, aceita diversos parâmetros, inclusive o search
async function getPortaria() {
  loading.value = true
  try {
    const response = await portariaServices.getAllSaidas(paginadorClass.value)

    apiPortaria.value = response

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

async function lancamentoSaidaFuncionario(idSaida?: number) {
  if (idSaida) {
    // const saida = await saidasServices.getSaidaById(idSaida)
    // if (saida.dataAprovacaoSaida == null) {
    //   confirmarSenha.value.openDialog()
    // }

    try {
      await portariaServices.LancarHoraSaida(idSaida)
      useSnackbarStore().showSnackbar('Hora de saída lançada atualizada!', 'success')
    } catch (error) {
      useSnackbarStore().showSnackbar(error, 'red')
      throw error
    } finally {
      loading.value = false
      await getPortaria()
    }
  }
}

async function lancamentoRetornoFuncionario(idSaida?: number) {
  if (idSaida) {
    try {
      await portariaServices.LancarHoraRetorno(idSaida)
      useSnackbarStore().showSnackbar('Hora de retorno lançada atualizada!', 'success')
    } catch (error) {
      useSnackbarStore().showSnackbar(error, 'red')
      throw error
    } finally {
      loading.value = false
      await getPortaria()
    }
  }
}

//#endregion

//#region Paginação
async function onBuscar() {
  await getPortaria()
}

async function aoMudarPagina(novaPagina: number) {
  paginadorClass.value.atualizarPagina(novaPagina)
  await getPortaria()
}

async function aoMudarOrdem() {
  paginadorClass.value.alterarOrdenacao()
  await getPortaria()
}

async function aoMudarAprovacao() {
  paginadorClass.value.alterarFiltroAprovacao()
  await getPortaria()
}

async function aoMudarApenasHoje() {
  paginadorClass.value.alterarFiltroApenasHoje()
  await getPortaria()
}

async function limparFiltros() {
  paginadorClass.value.limparFiltros()
  await getPortaria()
}

//#endregion

//#region Demais funções
// Função para controlar o v-expand-transition dos detalhes de cada saída
function toggleSaida(id?: number) {
  if (id != null)
    expandedSaidaId.value = expandedSaidaId.value === id ? null : id
}

function toggleAutorizacoesDaSaida(id?: number) {
  if (id != null)
    expandedAutorizacoesDaSaida.value = expandedAutorizacoesDaSaida.value === id ? null : id
}

function identificarSubtitulo(saida: SaidasComAutorizacoes): string {
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

function identificarStylePeloStatus(statusSaida?: string): string {
  const corDaSaidaPeloStatus = ref('')

  if (statusSaida) {
    if (statusSaida == 'PENDENTE')
      corDaSaidaPeloStatus.value = 'bg-blue-grey-lighten-3'
    if (statusSaida == 'NEGADA')
      corDaSaidaPeloStatus.value = 'bg-red-darken-2'
    if (statusSaida == 'AUTORIZADA')
      corDaSaidaPeloStatus.value = 'bg-green-accent-2'
    if (statusSaida == 'AUTORIZAÇÕES PENDENTES')
      corDaSaidaPeloStatus.value = 'bg-orange-darken-1'
  }

  return corDaSaidaPeloStatus.value
}

function clonarObjetoConfirmarSenha(val: ConfirmarSenhaClass) {
  Object.assign(confirmarSenha, val)
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
