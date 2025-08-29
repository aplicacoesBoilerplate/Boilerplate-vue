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
          </template>
        </v-list-item>

        <!-- Card de detalhes para cada saída, expanção controlada por uma variável -->
        <v-expand-transition>
          <div v-if="expandedSaidaId === portaria.idSaida" class="custom-expansion-panel">
            <v-row dense>
              <!-- Informações do responsável pelo erro -->
              <v-col cols="12" class="d-flex justify-center">
                <v-chip color="info">
                  INFORMAÇÕES DESTA SAÍDA
                </v-chip>
              </v-col>
              <br>
            </v-row>

            <v-row dense v-if="portaria.dataSaidaFuncionario">
              <!-- Previsão de saída -->
              <v-col cols="12">
                <div class="d-flex flex-row">
                  <p class="text-info" style="padding-right: 0.35rem;">
                    Data da previsão para saída:
                  </p>
                  <p>
                    {{ portaria.dataPrevisaoSaidaFuncionario }}
                  </p>
                </div>
              </v-col>

              <!-- Previsão de retorno -->
              <v-col cols="12">
                <div class="d-flex flex-row">
                  <p class="text-info" style="padding-right: 0.35rem;">
                    Data da previsão para retorno:
                  </p>
                  <p :class="portaria.confirmaRetorno ? '' : 'text-red'">
                    {{ portaria.confirmaRetorno ? `${portaria.dataPrevisaoChegadaFuncionario}` : 'Não retorna' }}
                  </p>
                </div>
              </v-col>
            </v-row>

            <v-row dense>
              <!-- Motivo da saída -->
              <v-col cols="12">
                <div class="d-flex flex-row">
                  <p class="text-info" style="padding-right: 0.35rem;">
                    Emitida por:
                  </p>
                  <p>
                    {{ portaria.nomeFuncionarioResponsavelSaida }}
                  </p>
                </div>
              </v-col>

              <!-- Status da saída -->
              <v-col cols="12">
                <div class="d-flex flex-row">
                  <p class="text-info" style="padding-right: 0.35rem;">
                    Status:
                  </p>
                  <p :class="portaria.statusSaida == 'AUTORIZADA' ? 'text-success' : 'text-red'">
                    {{ portaria.statusSaida }}
                  </p>
                </div>
              </v-col>


              <!-- Motivo saída -->
              <v-col cols="12">
                <div class="d-flex flex-row">
                  <p class="text-info" style="padding-right: 0.35rem;">
                    Motivo saída:
                  </p>
                  <p>
                    {{ portaria.motivoSaida }}: {{ portaria.categoriaMotivo }} - {{ portaria.descricaoMotivo }}
                  </p>
                </div>
              </v-col>

              <!-- Observação da saída -->
              <v-col v-if="portaria.observacaoSaida != null" cols="12">
                <div class="d-flex flex-row">
                  <p class="text-info" style="padding-right: 0.35rem;">
                    Observações da saída:
                  </p>
                  <p>
                    {{ portaria.observacaoSaida }}
                  </p>
                </div>
              </v-col>
            </v-row>

            <v-divider v-if="portaria.autorizacoes.length > 0" />

            <v-row dense v-if="portaria.autorizacoes.length > 0">
              <!-- Informações do responsável pelo erro -->
              <v-col cols="12" class="d-flex justify-center">
                <v-chip color="info">
                  INFORMAÇÕES DAS AUTORIZAÇÕES DESTA SAÍDA
                </v-chip>
              </v-col>
              <br>
            </v-row>

            <v-row dense v-for="(autorizacao, index) in portaria.autorizacoes">
              <!-- Responsável pela autorização -->
              <v-col cols="12">
                <div class="d-flex flex-row">
                  <p class="text-info" style="padding-right: 0.35rem;">
                    Responsável pela autorização:
                  </p>
                  <p>
                    {{ autorizacao.idFuncionarioAutorizacao }} - {{ autorizacao.nomeResponsavel }}
                  </p>
                </div>
              </v-col>

              <!-- Status da autorização -->
              <v-col cols="12">
                <div class="d-flex flex-row">
                  <p class="text-info" style="padding-right: 0.35rem;">
                    Saída:
                  </p>
                  <p :class="autorizacao.aprovacaoSaida ? 'text-success' : 'text-red'">
                    {{ autorizacao.aprovacaoSaida ? 'Aprovada' : 'Negada' }}
                  </p>
                </div>
              </v-col>

              <!-- Data da resposta da autorização -->
              <v-col cols="12">
                <div class="d-flex flex-row">
                  <p class="text-info" style="padding-right: 0.35rem;">
                    Data de emissão:
                  </p>
                  <p>
                    {{ autorizacao.dataAutorizacao }}
                  </p>
                </div>
              </v-col>

              <!-- Observações da autorização -->
              <v-col v-if="autorizacao.observacaoAutorizacao != null" cols="12">
                <div class="d-flex flex-row">
                  <p class="text-info" style="padding-right: 0.35rem;">
                    Observações desta autorização:
                  </p>
                  <p>
                    {{ autorizacao.observacaoAutorizacao }}
                  </p>
                </div>
              </v-col>
              <v-divider v-if="(index + 1) < portaria.autorizacoes.length" />
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

</template>

<script setup lang="ts">
//#region Imports
// Componentes
import InputUpperCase from '@/components/InputUpperCase.vue'; // Componente visual do input upper case
import Paginator from '@/components/paginator/Paginator.vue' // Componente visual para a paginação de registros
import BtnsFilterPaginator from '@/components/paginator/BtnsFilterPaginator.vue'; // Componente visual que controla os filtros para consulta de registros

// Classes
import { PaginatorClass } from '@/components/paginator/ClassPaginator';

// Store
import { useSnackbarStore } from '@/stores/SnackbarStore';

// Models
import type { HeaderPaginatorModel } from '@/models/HeaderPaginatorModel';
import type { SaidasComAutorizacoes } from '@/models/saidasModels/saidasModels';

// Services
import { portariaServices } from '@/services/portariaServices';

// Vue
import { onMounted, onUnmounted, ref } from 'vue';
import { gerenciamentoInatividade } from '@/utils/gerenciamentoInatividade';
//#endregion

//#region Variáveis
// Booleanos
const loading = ref(false) // Carregamento
// Classes
const paginadorClass = ref(new PaginatorClass({ limite: 10, offset: 1, totalPaginas: 0, totalRegistros: 0, orderBy: 'DESC', search: '' })) // Classe para a paginação
const filtrosPortaria = ref({
  exibirApenasHoje: true,
  exibirAprovacao: true
})

// Outros
const expandedSaidaId = ref<number | null>(null) // Painel de informações da saída
var apiPortaria = ref<HeaderPaginatorModel<SaidasComAutorizacoes>>() // Armazena os dados da resposta das req para exibição no front
let watcherinatividade: gerenciamentoInatividade | null = null;
//#endregion

//#region Funcionalidades do Vue
onMounted(async () => {
  watcherinatividade = new gerenciamentoInatividade(async () => {
    await getPortaria();
  }, 600000);

  watcherinatividade.start();
});

onUnmounted(() => {
  watcherinatividade?.stop();
});
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
    if (statusSaida == 'AUTORIZACOES_PENDENTES')
      corDaSaidaPeloStatus.value = 'bg-orange-darken-1'
    if (statusSaida == 'EXECUTANDO')
      corDaSaidaPeloStatus.value = 'bg-deep-orange-lighten-1'
    if (statusSaida == 'REALIZADA')
      corDaSaidaPeloStatus.value = 'bg-green-darken-4'
  }

  return corDaSaidaPeloStatus.value
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
