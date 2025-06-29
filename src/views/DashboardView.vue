<template>
  <div>
    <h1 class="d-flex justify-center mb-6">Dashboard Homepage</h1>
  </div>

  <div class="d-flex justify-center mb-6">
    <BtnsFilterPaginator :paginator="paginadorClass" :show="filtrosDashboard" @alterado-apenas-hoje="aoMudarApenasHoje"
      @alterado-aprovacao="aoMudarAprovacao" @alterar-input="alterarInputSearch" @limpar-filtros="limparFiltros" />
  </div>

  <v-container class="container-dashboard">
    <v-row dense>
      <v-col v-for="indicador in indicadores" :key="indicador.id" cols="12" md="6">
        <v-card variant="flat" class="mx-auto" :color="indicador.color" max-width="600" :subtitle="indicador.about"
          :title="indicador.title">
          <template v-slot:actions>
            <v-icon>{{ indicador.icon }}</v-icon>
            {{ indicador.amount }}
          </template>
        </v-card>
        <div class="text-center text-caption">{{ indicador.status }}</div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// Componentes
import BtnsFilterPaginator from '@/components/paginator/BtnsFilterPaginator.vue'; // Componente visual que controla os filtros para consulta de registros

// Classes
import { PaginatorClass } from '@/components/paginator/ClassPaginator';

// Models
import type { UsuarioConsulta } from '@/models/usersModels/UsuariosModels';
import { relatoriosServices } from '@/services/relatoriosService';
import { usuarioAutenticado } from '@/stores/usuarioAutenticado';

// Vue
import { onBeforeMount, onMounted, ref } from 'vue';

onBeforeMount(() => {
  getDashboard();
});

// #region API

async function getDashboard() {
  const response = await relatoriosServices.getDashboard(paginadorClass.value);
  const permissao = usuarioAutenticado().usuario.permissao

  indicadores.value[0].amount = response.totalSaidas;
  indicadores.value[1].amount = response.funcionariosAusentes;
  indicadores.value[2].amount = response.retornosPendentes;
  indicadores.value[3].amount = response.aguardandoAutorizacao;

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
  exibirAlterarInput: true
})

async function aoMudarAprovacao() {
  paginadorClass.value.alterarFiltroAprovacao()
  await getDashboard()
}

async function aoMudarApenasHoje() {
  paginadorClass.value.alterarFiltroApenasHoje()
  await getDashboard()
}

function alterarInputSearch() {
  paginadorClass.value.alterarInput = !paginadorClass.value.alterarInput
}

async function limparFiltros() {
  paginadorClass.value.limparFiltros()
  await getDashboard()
}

//#endregion

// #region indicadores

interface Indicador {
  id: number;
  status: string;
  title: string;
  amount: number;
  about: string;
  color: string;
  icon: string;
  permission?: boolean | true;
}

const indicadores = ref<Indicador[]>([
  // { id: 0, status: '', title: '', amount: '', about: '', color: '', icon: '' },
  { id: 1, status: 'bad', title: 'Total de saidas', amount: 0, about: 'Número total de saídas registradas', color: 'info', icon: 'mdi-checkbox-marked-circle-minus-outline' },
  { id: 2, status: 'good', title: 'Funcionários fora da empresa', amount: 0, about: 'Total de saídas em andamento (incluí saídas sem retorno)', color: 'warning', icon: 'mdi-checkbox-marked-circle-plus-outline' },
  { id: 3, status: 'good', title: 'Retornos pendentes', amount: 0, about: 'Quantos funcionários fora da empresa vão retornar', color: 'success', icon: 'mdi-checkbox-marked-circle-auto-outline' },
  { id: 4, status: 'undefined', title: 'Aguardando autorização', amount: 0, about: 'Total de saídas em aberto', color: '', icon: 'mdi-calendar-check-outline' }
])
// #endregion

</script>

<style>
.container-dashboard {
  padding: 2rem;
}
</style>
