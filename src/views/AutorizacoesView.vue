<template>
  <!-- Dialog aberto pela edição -->
  <DialogAutorizacoes :model-value="dialogAutorizacoes"
    @update:modelValue="(val: DialogAutorizacoesClass) => Object.assign(dialogAutorizacoes, val)" />

  <!-- Card para definir tamanho de exibição e acoplar os demais elementos -->
  <v-card class="mx-auto" max-width="700">
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h6">Lista de autorizações</span>
      <v-btn title="Ordem" variant="outlined" color="primary" density="compact"
        @click="aoMudarOrdem(paginadorClass.orderBy || 'ASC')">
        <v-icon>{{ paginadorClass.orderBy == 'ASC' ? "mdi-arrow-down" : "mdi-arrow-up" }}
        </v-icon>
      </v-btn>

      <!-- Campo para consultar as autorizações pelo usuários responsável inserindo no search -->
      <v-text-field clearable v-model="paginadorClass.idFuncionarioResponsavel" density="compact" variant="outlined"
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
          <v-btn color="warning" variant="plain" @click="clearSearch()">
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
          :title="`${autorizacao.idAutorizacao} - Aprovação: ${autorizacao.aprovacaoSaida? 'Autorizado' : 'Negado'}`"
          :subtitle="`#Data da autorização: ${autorizacao.dataAutorizacao ? `autorizacao.dataAutorizacao` : 'Não definido'}`"
          :class="autorizacao.aprovacaoSaida ? 'bg-green-lighten-4' : 'bg-red-lighten-4'"
        >

          <!-- Ícone de cartão de autorização -->
          <template v-slot:prepend>
            <v-icon>mdi-book-check-outline</v-icon>
          </template>

          <!-- Botões de funcionalidades de mais informações e edição -->
          <template v-slot:append>
            <div class="pe-2">
              <v-btn size="small" variant="elevated" :color="autorizacao.aprovacaoSaida ? 'success': 'red'" icon="mdi-information-outline"
                @click="toggleAutorizacao(autorizacao.idAutorizacao)" title="Informações">
              </v-btn>
              <span class="pr-2" />
              <v-btn icon="mdi-pencil" size="x-small" variant="tonal" :color="autorizacao.aprovacaoSaida ? 'info': 'red'"
                @click="completeFormEditAutorizacaoDialog(autorizacao)" title="Editar" />
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
                  {{ autorizacao.idFuncionarioAutorizacao }}
                </v-chip>
              </v-col>

              <v-divider vertical />

              <!-- Registro da saída relacionada -->
              <v-col cols="6" class="d-flex justify-center">
                <v-chip color="info">
                  Referente a saída:
                  {{ autorizacao.idSaida }}
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
      </template>
    </v-virtual-scroll>
  </v-card>
  <!-- Componente de paginação -->
  <Paginator :model-value="paginadorClass" @mudouLimite="aoMudarLimite" @mudouPagina="aoMudarPagina"
    v-if="apiAutorizacoes?.totalRegistros! > 0 && !loading" />

</template>

<script setup lang="ts">
//#region Imports
// Componentes
import Paginator from '@/components/paginator/Paginator.vue' // Componente visual para a paginação de registros

// Classes
import { DialogAutorizacoesClass } from '@/components/dialog/dialogAutorizacoes/ClassDialogAutorizacoes';
import { PaginatorClass } from '@/components/paginator/ClassPaginator';

// Store
import { useSnackbarStore } from '@/stores/SnackbarStore';

// Models
import type { AutorizacoesConsulta } from '@/models/saidasModels/saidasModels';
import type { HeaderPaginatorModel } from '@/models/HeaderPaginatorModel';

// Services
import { autorizacoesServices } from '@/services/autorizacoesServices';

// Vue
import { onMounted, ref, watch } from 'vue';
import DialogAutorizacoes from '@/components/dialog/dialogAutorizacoes/DialogAutorizacoes.vue';
//#endregion

//#region Variáveis
// Booleanos
const loading = ref(false) // Carregamento
const showDialog = ref(false) // Dialog de autorizações

// Classes
const dialogAutorizacoes = ref(new DialogAutorizacoesClass())
const paginadorClass = ref(new PaginatorClass({ limite: 10, offset: 1, totalPaginas: 0, totalRegistros: 0, orderBy: 'DESC', search: '' })) // Classe para a paginação

// Outros
const expandedUserId = ref<number | null>(null) // Painel de informações do usuário
const searchResponsavel = ref<string>() // Parâmetro para consultar usuários
var apiAutorizacoes = ref<HeaderPaginatorModel<AutorizacoesConsulta>>() // Armazena os dados da resposta das req para exibição no front

//#endregion

//#region Funcionalidades do Vue

onMounted(async () => {
  await getAutorizacoes()
})

watch(() => searchResponsavel.value, async (newValue) => {
  getAutorizacoes()
})

watch(() => paginadorClass.value, () => {
  getAutorizacoes()
}, { deep: true })

//#endregion

//#region Dialog das autorizações
// Preeche os campos ao editar uma autorização
function completeFormEditAutorizacaoDialog(autorizacao: AutorizacoesConsulta) {
  dialogAutorizacoes.value.completeForm(autorizacao.idAutorizacao)
  showDialog.value = true
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

//#region Paginação
async function aoMudarLimite(novoLimite: number) {
  paginadorClass.value.atualizarLimite(novoLimite)
  await getAutorizacoes()
}

async function aoMudarPagina(novaPagina: number) {
  paginadorClass.value.atualizarPagina(novaPagina)
  await getAutorizacoes()
}

async function aoMudarOrdem(ordem: string) {
  paginadorClass.value.alterarOrdenacao(ordem)
  await getAutorizacoes()
}
//#endregion

//#region Demais funções
// Função para controlar o v-expand-transition dos detalhes de cada autorização
function toggleAutorizacao(id?: number) {
  if(id != null)
    expandedUserId.value = expandedUserId.value === id ? null : id
}

// Usado no alert quando não a autorização não foi encontrada para exibir novamente a lista com o getAll
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
