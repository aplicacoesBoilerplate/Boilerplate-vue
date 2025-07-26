<template>
  <DialogFiltrosRelatorios ref="dialogFiltrosRef" v-model:montarFiltros="filtrosDialog"/>

  <v-card class="mx-auto" max-width="2000">
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h6">Lista de Relatórios</span>

      <!-- Campo para consultar os relatório pelo search -->
      <InputUpperCase v-model:="paginadorClass.search" :style="{
          icon: 'mdi-magnify',
          density: 'compact',
          btnDisabled: !paginadorClass.search,
          inputVariant: 'outlined',
          btnVariant: 'text',
          label: 'Consultar modelo',
          showPrepend: true,
          hideDetails: true,
          maxWidth: 300,
        }" @on-prepend-click="getModelos"
      />

      <BtnsFilterPaginator :paginator="paginadorClass" :show="filtrosDashboard" @alterado-sinteticos="aoMudarSinteticos"
      @alterado-analiticos="aoMudarAnaliticos" @limpar-filtros="limparFiltros" />

    </v-card-title>
    <v-divider />

    <!-- Loading -->
    <div class="d-flex justify-center" v-if="loading">
      <v-progress-circular color="primary" indeterminate />
    </div>

    <!-- Alerta quando nenhuma categoria consultado foi encontrada -->
    <div v-if="apiRelatorios?.length == 0 && loading == false" class="pt-4">
      <v-alert text="Nenhum modelo de relatório encontrado! Verifique os filtros." type="info" variant="tonal">
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

    <!-- Exibição dos relatórios disponíveis -->
    <v-virtual-scroll :items="apiRelatorios" max-height="250" item-height="50" v-else>
      <template v-slot:default="{ item: relatorio }">
        <v-list-item :title="`${relatorio.tipoRelatorio} - ${relatorio.modeloRelatorio}`">
          <!-- Ícone de cartão de relatório -->
          <template v-slot:prepend>
            <v-icon>mdi-chart-bar</v-icon>
          </template>

          <!-- Botões para abrir o dialog dos filtros para gerar relatório -->
          <template v-slot:append>
            <div class="pe-2">
              <BtnOpenDialog :callback="() => openFiltrosRelatorio(relatorio)" :labelLeft="true"
                :label="`Gerar relatório ${relatorio.tipoRelatorio} - ${relatorio.modeloRelatorio}`" size="small"
                variant="elevated" color="info" icon="mdi-chart-donut-variant" title="Emitir relatório" />
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
import DialogFiltrosRelatorios from "@/components/dialog/dialogFiltrosRelatorios/DialogFiltrosRelatorios.vue"; // Componente visual para o dialog dos filtros para geração de raltório
import BtnsFilterPaginator from '@/components/paginator/BtnsFilterPaginator.vue'; // Componente visual que controla os filtros para consulta de registros
import BtnOpenDialog from "@/components/dialog/BtnOpenDialog.vue"; // Botão para abrir o Dialog
import InputUpperCase from '@/components/InputUpperCase.vue'; // Componente visual para o input upper case

// Classes
import { DialogFiltrosRelatoriosClass } from "@/components/dialog/dialogFiltrosRelatorios/ClassDialogFiltrosRelatorios.ts";
import { PaginatorClass } from '@/components/paginator/ClassPaginator';

// Models
import type { Relatorios } from "@/models/relatoriosModels/relatoriosModels.ts";

// Store
import { useSnackbarStore } from "@/stores/SnackbarStore.ts";

// Services
import { relatoriosServices } from "@/services/relatoriosService.ts";

// Vue
import { nextTick, onBeforeMount, onMounted, ref } from "vue";

const loading = ref(false)
const dialogFiltrosRef = ref()
const filtrosDialog = ref(new DialogFiltrosRelatoriosClass()) // Instância da classe do componente para montar os filtros dos relatórios
var apiRelatorios = ref<Array<Relatorios>>() // Armazena os dados da resposta das req para exibição no front

onBeforeMount(() => {
  paginadorClass.value.exibirSintetico = true
})

onMounted(async () => {
  await getModelos()
})

//#region Paginação e filtros

const paginadorClass = ref(new PaginatorClass({
  limite: 10,
  offset: 1,
  totalPaginas: 0,
  totalRegistros: 0,
  orderBy: 'DESC',
  search: '',
  exibirSintetico: false,
  exibirAnalitico: false
}))
const filtrosDashboard = ref({
  exibirOrdem: false,
  exibirSinteticos: true,
  exibirAnaliticos: true
})

async function aoMudarSinteticos() {
  paginadorClass.value.alterarExibicaoSinteticos()
  await getModelos()
}

async function aoMudarAnaliticos() {
  paginadorClass.value.alterarExibicaoAnaliticos()
  await getModelos()
}

async function limparFiltros() {
  paginadorClass.value.limparFiltros()
  await getModelos()
}

//#endregion

// #region consultar modelos

async function getModelos() {
  loading.value = true
  try {
    apiRelatorios.value = await relatoriosServices.getModelos(paginadorClass.value);
  } catch (error) {
    useSnackbarStore().showSnackbar(error, 'red')
    throw error
  } finally {
    loading.value = false
  }
}

// #endregion

// #region dialog filtros
function openFiltrosRelatorio(infoRelatorio: Relatorios) {
  filtrosDialog.value.openDialog(infoRelatorio)

  nextTick(() => {
    dialogFiltrosRef.value?.getTabelasRelacionadas()
  })
}

// #endregion

</script>
