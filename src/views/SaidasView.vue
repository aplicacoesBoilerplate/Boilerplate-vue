<template>
  <!-- Botão que recebe o callback para abrir um dialog -->
  <BtnOpenDialog :callback="openNewSaida" :label="'Solicitar nova saída'" />

  <!-- Dialog aberto pelo botão acima -->
  <DialogSaidas :model-value="dialogSaidas"
    @update:modelValue="(val: DialogSaidasClass) => Object.assign(dialogSaidas, val)"
    @operacao-concluida="getAllSaidas" />

  <!-- Card para definir tamanho de exibição e acoplar os demais elementos -->
  <v-card class="mx-auto" max-width="700">
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h6">Lista de saídas</span>
      <v-btn title="Ordem" variant="outlined" color="primary" density="compact"
        @click="aoMudarOrdem(paginadorClass.orderBy || 'ASC')">
        <v-icon>{{ paginadorClass.orderBy == 'ASC' ? "mdi-arrow-down" : "mdi-arrow-up" }}
        </v-icon>
      </v-btn>

      <!-- Campo para consultar as saídas pelo search -->
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

    <!-- Exibição das saídas -->
    <v-virtual-scroll :items="apiSaidas?.registros" height="500" item-height="50" v-else>
      <template v-slot:default="{ item: saida }">
        <v-list-item :title="`${saida.idSaida} - ${saida.nomeFuncionario}: ${saida.numeroRegistroFuncionario}`"
          :subtitle="identificarSubtitulo(saida)"
          :class="saida.dataAprovacaoSaida ? 'bg-green-accent-2' : 'bg-red-darken-2'">

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
              <!-- Data de solicitação da saída -->
              <v-col cols="6" class="d-flex justify-center">
                <v-chip color="info">
                  Solicitada em:
                  {{ saida.dataSolicitacaoSaida }}
                </v-chip>
              </v-col>

              <v-divider vertical />

              <!-- Aprovação Saída -->
              <v-col cols="6" class="d-flex justify-center">
                <v-chip :color="saida.dataAprovacaoSaida ? 'success' : 'red'">
                  Autorizada em:
                  {{ saida.dataAprovacaoSaida ? saida.dataAprovacaoSaida : 'Não autorizada' }}
                </v-chip>
              </v-col>

              <v-divider />
            </v-row>

            <v-row dense v-if="saida.dataSaidaFuncionario || saida.dataChegadaFuncionario">
              <!-- Previsão de saída -->
              <v-col cols="6" class="d-flex justify-center">
                <v-chip color="info">
                  Data P. saída:
                  {{ saida.dataPrevisaoSaidaFuncionario }}
                </v-chip>
              </v-col>

              <v-divider vertical />

              <!-- Saída real -->
              <v-col cols="6" class="d-flex justify-center">
                <v-chip color="info">
                  Data P. retorno:
                  {{ saida.confirmaRetorno ? `${saida.dataPrevisaoChegadaFuncionario}` : 'Não retorna' }}
                </v-chip>
              </v-col>

              <v-divider />
            </v-row>

            <v-row dense>
              <v-col cols="12" color="info">
                <!-- Motivo da saída -->
                Motivo saída:
                {{ saida.motivoSaida }}
                <br /><br />
                <!-- Observação da saída -->
                Observações da saída: <br />
                {{ saida.observacao_saida }}

              </v-col>
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
