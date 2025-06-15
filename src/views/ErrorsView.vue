<template>

  <!-- Card para definir tamanho de exibição e acoplar os demais elementos -->
  <v-card class="mx-auto" max-width="1000">
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h6">Lista de errors</span>

      <BtnsFilterPaginator :paginator="paginadorClass" :show="{ exibirApenasHoje: true }" @alterado-ordem="aoMudarOrdem"
        @alterado-apenas-hoje="aoMudarApenasHoje" @alterado-aprovacao="aoMudarAprovacao"
        @limpar-filtros="limparFiltros" />

      <!-- Campo para consultar os errors pelo search -->
      <InputUpperCase v-model:="paginadorClass.search" :style="{
        icon: 'mdi-magnify',
        density: 'compact',
        btnDisabled: !paginadorClass.search,
        inputVariant: 'outlined',
        btnVariant: 'text',
        label: 'Consultar errors',
        showPrepend: true,
        hint: 'Responsável ou erro (arquivo, classe, método, linha ou status)',
        maxWidth: 400,
      }" @on-prepend-click="getAllErrors" />
    </v-card-title>
    <v-divider />

    <!-- Loading -->
    <div class="d-flex justify-center" v-if="loading">
      <v-progress-circular color="primary" indeterminate />
    </div>

    <!-- Alerta quando nenhum erro consultado foi encontrado -->
    <div v-if="apiErrors?.totalRegistros == 0 && loading == false" class="pt-4">
      <v-alert text="Nenhum erro encontrado!" type="info" variant="tonal">
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

    <!-- Exibição dos errors -->
    <v-virtual-scroll :items="apiErrors?.registros" height="500" item-height="50" v-else>
      <template v-slot:default="{ item: error }">
        <v-list-item :title="`${error.idError} - ${error.horaError}`" :subtitle="`#método: ${error.metodoError}`">

          <!-- Ícone de cartão de erro -->
          <template v-slot:prepend>
            <v-icon>mdi-alert-circle-outline</v-icon>
          </template>

          <!-- Botões de funcionalidades de mais informações e menu -->
          <template v-slot:append>
            <div class="pe-2">
              <v-btn size="small" variant="elevated" color="white" icon="mdi-information-outline"
                @click="toggleError(error.idError)" title="Informações">
              </v-btn>
            </div>
          </template>

        </v-list-item>
        <!-- Card de detalhes para cada erro, expanção controlada por uma variável -->
        <v-expand-transition>
          <div v-if="expandedErrorId === error.idError" class="custom-expansion-panel">
            <v-divider />
            <v-row dense>
              <!-- Informações do responsável pelo erro -->
              <v-col cols="12" class="d-flex justify-center">
                <v-chip color="info">
                  INFORMAÇÕES DO RESPONSÁVEL
                </v-chip>
              </v-col>
              <br>
              <br>

              <v-col cols="12">
                <div class="d-flex flex-row">
                  <p class="text-info" style="padding-right: 0.35rem;">
                    Responsável:
                  </p>
                  {{ error.nomeResponsavel }}
                </div>
                <div class="d-flex flex-row">
                  <p class="text-info" style="padding-right: 0.35rem;">
                    Email:
                  </p>
                  {{ error.emailResponsavel }}
                </div>
                <div class="d-flex flex-row">
                  <p class="text-info" style="padding-right: 0.35rem;">
                    Permissao:
                  </p>
                  {{ error.permissaoResponsavel }}
                </div>
              </v-col>

              <v-divider />

              <!-- Informações do erro -->
              <v-col cols="12" class="d-flex justify-center">
                <v-chip color="warning">
                  INFORMAÇÕES DO ERRO
                </v-chip>
              </v-col>
              <br>
              <br>

              <v-col cols="12">
                <div class="d-flex flex-row">
                  <p class="text-warning" style="padding-right: 0.35rem;">
                    Mensagem:
                  </p>
                  {{ error.erro }}
                </div>
                <div class="d-flex flex-row">
                  <p class="text-warning" style="padding-right: 0.35rem;">
                    Arquivo de origem:
                  </p>
                  {{ error.arquivoError }}
                </div>
                <div class="d-flex flex-row">
                  <p class="text-warning" style="padding-right: 0.35rem;">
                    Classe de origem:
                  </p>
                  {{ error.classeError }}
                </div>
                <div class="d-flex flex-row">
                  <p class="text-warning" style="padding-right: 0.35rem;">
                    Método de origem:
                  </p>
                  {{ error.metodoError }}
                </div>
                <div class="d-flex flex-row">
                  <p class="text-warning" style="padding-right: 0.35rem;">
                    Linha de origem:
                  </p>
                  {{ error.linhaError }}
                </div>
                <div class="d-flex flex-row">
                  <p class="text-warning" style="padding-right: 0.35rem;">
                    Http status code:
                  </p>
                  {{ error.statusCodeError }}
                </div>
              </v-col>

              <v-divider v-if="error.idSaida > 0" />

              <!-- Registro da saída relacionada -->
              <v-col v-if="error.idSaida > 0" cols="12" class="d-flex justify-center">
                <v-chip color="info">
                  Referente a saída:
                  {{ error.idSaida }}
                  <span class="pr-2" />
                  <BtnOpenDialog :callback="() => visualizarInformacoes(error.idSaida)" icon="mdi-eye-outline"
                    size="x-small" variant="outlined" color="info" class="pt-2" />
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
    v-show="apiErrors?.totalRegistros! > 0 && !loading" />

  <!-- Dialog aberto pelo botão acima -->
  <DialogSaidas :model-value="dialogSaidas" @update:modelValue="clonarObjetoDialogSaidas(dialogSaidas)" />

</template>

<script setup lang="ts">
//#region Imports
// Componentes
import Paginator from '@/components/paginator/Paginator.vue'; // Componente visual para a paginação de registros
import InputUpperCase from '@/components/InputUpperCase.vue'; // Componente visual do input upper case
import BtnOpenDialog from "@/components/dialog/BtnOpenDialog.vue"; // Botão padrão para se comunicar com os dialogs enviando a função de callback
import DialogSaidas from "@/components/dialog/dialogSaidas/DialogSaidas.vue"; // Componente visual para o dialog das saídas, utilizado para exibição das informações
import BtnsFilterPaginator from '@/components/paginator/BtnsFilterPaginator.vue'; // Componente visual que controla os filtros para consulta de registros

// Classes
import { PaginatorClass } from '@/components/paginator/ClassPaginator';
import { DialogSaidasClass } from "@/components/dialog/dialogSaidas/ClassDialogSaidas";

// Store
import { useSnackbarStore } from '@/stores/SnackbarStore';

// Models
import type { ErrorsConsulta } from '@/models/errorsModels/errorsModels';
import type { HeaderPaginatorModel } from '@/models/HeaderPaginatorModel';

// Services
import { errorsServices } from '@/services/errorsService';

// Vue
import { onMounted, ref } from 'vue';
//#endregion

//#region Variáveis
// Booleanos
const loading = ref(false) // Carregamento
const showDialog = ref(false) // Dialog de saída
// Classes
const paginadorClass = ref(new PaginatorClass({ limite: 10, offset: 1, totalPaginas: 0, totalRegistros: 0, orderBy: 'DESC', search: '' })) // Classe para a paginação
const dialogSaidas = ref(new DialogSaidasClass())
// Outros
var apiErrors = ref<HeaderPaginatorModel<ErrorsConsulta>>() // Armazena os dados da resposta das req para exibição no front
const expandedErrorId = ref<number | null>(null) // Painel de informações do erro
//#endregion

//#region Funcionalidades do Vue
onMounted(async () => {
  await getAllErrors()
})
//#endregion

//#region funções de consulta de errors
// Consulta paginada de todos os errors, aceita diversos parâmetros, inclusive o search
async function getAllErrors() {
  loading.value = true
  try {
    const response = await errorsServices.getErrorsConsulta(paginadorClass.value)

    apiErrors.value = response

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

//#region DialogSaida
function visualizarInformacoes(idSaida: number) {
  dialogSaidas.value.visualizarInformacoes(idSaida)
  showDialog.value = true
}
//#endregion

//#region Paginação
async function onBuscar() {
  await getAllErrors()
}

async function aoMudarPagina(novaPagina: number) {
  paginadorClass.value.atualizarPagina(novaPagina)
  await getAllErrors()
}

async function aoMudarOrdem() {
  paginadorClass.value.alterarOrdenacao()
  await getAllErrors()
}

async function aoMudarAprovacao() {
  paginadorClass.value.alterarFiltroAprovacao()
  await getAllErrors()
}

async function aoMudarApenasHoje() {
  paginadorClass.value.alterarFiltroApenasHoje()
  await getAllErrors()
}

async function limparFiltros() {
  paginadorClass.value.limparFiltros()
  await getAllErrors()
}
//#endregion

//#region Demais funções
// Função para controlar o v-expand-transition dos detalhes de cada erro
function toggleError(id?: number) {
  if (id != null)
    expandedErrorId.value = expandedErrorId.value === id ? null : id
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
</style>
