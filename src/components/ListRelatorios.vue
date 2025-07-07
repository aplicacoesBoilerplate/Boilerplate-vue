<template>

  <v-card class="mx-auto" max-width="2000">
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h6">Lista de Relatórios</span>

      <BtnsFilterPaginator :paginator="paginadorClass" :show="filtrosDashboard"
                           @alterado-sinteticos="aoMudarSinteticos" @alterado-analiticos="aoMudarAnaliticos" @limpar-filtros="limparFiltros" />

    </v-card-title>
    <v-divider />

    <!-- Loading -->
    <div class="d-flex justify-center" v-if="loading">
      <v-progress-circular color="primary" indeterminate />
    </div>

    <!-- Alerta quando nenhuma categoria consultado foi encontrada -->
    <div v-if="apiRelatorios?.length == 0 && loading == false" class="pt-4">
      <v-alert text="Nenhum modelo de relatório encontrado!" type="info" variant="tonal">
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

    <!-- Exibição das categorias -->
    <v-virtual-scroll :items="apiRelatorios" max-height="500" item-height="50" v-else>
      <template v-slot:default="{ item: relatorio }">
        <v-list-item :title="`${relatorio.tipo} - ${relatorio.modelo}`">
          <!-- Ícone de cartão de relatório -->
          <template v-slot:prepend>
            <v-icon>mdi-chart-bar</v-icon>
          </template>

          <!-- Botões para emitir relatório -->
          <template v-slot:append>
            <div class="pe-2">
              <v-btn size="small" variant="elevated" color="info" icon="mdi-check" title="Emitir relatório" />
            </div>
          </template>
        </v-list-item>
        <v-divider />
      </template>
    </v-virtual-scroll>
  </v-card>

</template>

<script setup lang="ts">
// Componentes
import BtnsFilterPaginator from '@/components/paginator/BtnsFilterPaginator.vue'; // Componente visual que controla os filtros para consulta de registros
// Classes
import {PaginatorClass} from '@/components/paginator/ClassPaginator';

// Vue
import {onMounted, ref} from "vue";
import type {Relatorios} from "@/models/relatoriosModels/relatoriosModels.ts";

const loading = ref(false)
var apiRelatorios = ref<Array<Relatorios>>() // Armazena os dados da resposta das req para exibição no front

onMounted( () => {
  apiRelatorios.value = getModelos().value
})

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
  exibirSinteticos: true,
  exibirAnaliticos: true
})

async function aoMudarSinteticos() {
  paginadorClass.value.alterarExibicaoSinteticos()
}

async function aoMudarAnaliticos() {
  paginadorClass.value.alterarExibicaoAnaliticos()
}

async function limparFiltros() {
  paginadorClass.value.limparFiltros()
}

//#endregion

// #region consultar modelos

function getModelos() {
  return ref<Array<Relatorios>>([
    {
      tipo: "SINTETICO",
      modelo: "GERAL"
    },
    {
      tipo: "ANALITICO",
      modelo: "GERAL"
    }
  ])
}

// #endregion

</script>
