<template>
  <v-card class="mx-auto" max-width="2000">
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h6">Indicadores</span>

      <BtnsFilterPaginator :paginator="paginadorClass" :show="filtrosDashboard" @alterado-apenas-hoje="aoMudarApenasHoje"
                           @alterado-aprovacao="aoMudarAprovacao" @limpar-filtros="limparFiltros" />

    </v-card-title>
    <v-divider />

    <!-- Loading -->
    <div class="d-flex justify-center" v-if="loading">
      <v-progress-circular color="primary" indeterminate />
    </div>

    <v-container class="container-dashboard">
      <v-row dense>
        <v-col v-for="indicador in indicadores" :key="indicador.id" cols="12" md="3" :title="indicador.about">
          <v-card variant="flat" class="mx-auto" :color="indicador.color" max-width="600"
                  :title="indicador.title">
            <template v-slot:actions>
              <v-icon>{{ indicador.icon }}</v-icon>
              {{ indicador.amount }}
            </template>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>

  <div class="mt-5"></div>

  <ListRelatorios v-if="permissao != 'EMITE_SAIDA' && permissao != 'PORTARIA'"/>

  {{a}}

</template>

<script setup lang="ts">
// Componentes
import BtnsFilterPaginator from '@/components/paginator/BtnsFilterPaginator.vue'; // Componente visual que controla os filtros para consulta de registros
import ListRelatorios from "@/components/ListRelatorios.vue"; // Listagem das opções de relatórios que o sistema possuí por padrão

// Classes
import { PaginatorClass } from '@/components/paginator/ClassPaginator';

// Stores
import {useSnackbarStore} from "@/stores/SnackbarStore.ts";

// Models
import { relatoriosServices } from '@/services/relatoriosService';
import { usuarioAutenticado } from '@/stores/usuarioAutenticado';

// Vue
import { onBeforeMount, ref } from 'vue';

onBeforeMount(() => {
  getDashboard();
});

const loading = ref(false)
const permissao = ref()

// #region API

async function getDashboard() {
  loading.value = true
  try {
    const response = await relatoriosServices.getDashboard(paginadorClass.value);
    permissao.value = usuarioAutenticado().usuario.permissao

    indicadores.value[0].amount = response.totalSaidas;
    indicadores.value[1].amount = response.funcionariosAusentes;
    indicadores.value[2].amount = response.retornosPendentes;
    indicadores.value[3].amount = response.aguardandoAutorizacao;
  } catch (error) {
    useSnackbarStore().showSnackbar(error, 'red')
    throw error
  } finally {
    loading.value = false
  }
}

// #endregion

//#region Paginação e filtros

const paginadorClass = ref(new PaginatorClass({
  limite: 10,
  offset: 1,
  totalPaginas: 0,
  totalRegistros: 0,
  orderBy: 'DESC',
  search: ''
}))
const filtrosDashboard = ref({
  exibirOrdem: false,
  exibirApenasHoje: true,
  exibirAprovacao: true,
  exibirAlterarInput: false
})

async function aoMudarAprovacao() {
  paginadorClass.value.alterarFiltroAprovacao()
  await getDashboard()
}

async function aoMudarApenasHoje() {
  paginadorClass.value.alterarFiltroApenasHoje()
  await getDashboard()
}

async function limparFiltros() {
  paginadorClass.value.limparFiltros()
  await getDashboard()
}

//#endregion

// #region indicadores

interface Indicador {
  id: number;
  amount: number;
  icon: string;
  color: string;
  title: string;
  about: string;
  permission?: boolean | true;
}

const indicadores = ref<Indicador[]>([
  // { id: 0, amount: '', icon: '', color: '', title: '', about: '' },
  { id: 1, amount: 0, icon: 'mdi-tally-mark-1', color: 'light-blue', title: 'Total de saidas', about: 'Número total de saídas registradas (respeita a alteração dos filtros de busca)' },
  { id: 2, amount: 0, icon: 'mdi-tally-mark-2', color: 'amber-darken-4', title: 'Fora da empresa', about: 'Total de saídas em andamento (incluí saídas sem retorno)' },
  { id: 3, amount: 0, icon: 'mdi-tally-mark-3', color: 'green-darken-3', title: 'Retornos pendentes', about: 'Quantos funcionários fora da empresa vão retornar' },
  { id: 4, amount: 0, icon: 'mdi-tally-mark-4', color: 'indigo', title: 'Aguardando autorização', about: 'Total de saídas aguardando que as autorizações sejam emitidas' }
])

// #endregion

</script>

<style>
.container-dashboard {
  padding: 2rem;
}
</style>
