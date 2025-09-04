<template>
  <div
    id="pdf-content"
    ref="pdfContent"
    style="position: absolute; top: -9999px; left: -9999px;"
  >
    <div class="pdf-wrapper">
      <h2 class="d-flex justify-center">
        RELATÓRIO {{ relatorioGerado.dados.tipoRelatorio }} - {{ relatorioGerado.dados.modeloRelatorio }}
      </h2>
      <p class="d-flex justify-center">{{ relatorioGerado.data }}</p>

      <BlocoResponsaveis v-if="relatorioGerado.dados.responsaveis" v-model:dados="relatorioGerado.dados.responsaveis" />
      <BlocoFuncionario v-if="relatorioGerado.dados.funcionario" v-model:dados="relatorioGerado.dados.funcionario" />
      <BlocoSaidas v-if="relatorioGerado.dados.saidas" v-model:dados="relatorioGerado.dados.saidas" />
      <BlocoAutorizacoes v-if="relatorioGerado.dados.autorizacoes" v-model:dados="relatorioGerado.dados.autorizacoes" />
      <BlocoSaidasComAutorizacoes v-if="relatorioGerado.dados.saidasComAutorizacoes" v-model:dados="relatorioGerado.dados.saidasComAutorizacoes" />
      <BlocoCategorias v-if="relatorioGerado.dados.categorias" v-model:dados="relatorioGerado.dados.categorias" />
      <BlocoMotivos v-if="relatorioGerado.dados.motivos" v-model:dados="relatorioGerado.dados.motivos" />
      <BlocoErros v-if="relatorioGerado.dados.errors" v-model:dados="relatorioGerado.dados.errors" />
      <BlocoAnaliticoGeral v-if="relatorioGerado.dados.analiticoGeral" v-model:dados="relatorioGerado.dados.analiticoGeral" />

      <div v-if="relatorioGerado.dados.respostaSinteticaRelatorios">
        <h3 class="font-weight-bold pl-3 mb-3">
          <v-icon>mdi-chart-donut-variant</v-icon>
          Dados sintéticos
        </h3>

        <v-table fixed-header>
          <thead>
            <tr>
              <th class="text-left">Descrição</th>
              <th class="text-left">Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in relatorioGerado.dados.respostaSinteticaRelatorios" :key="index">
              <td>{{ item.descricao }}</td>
              <td>{{ item.valor }}</td>

              <v-divider />
            </tr>
          </tbody>
        </v-table>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, watch } from 'vue'
import type { RelatorioGerado } from '@/models/relatoriosModels/relatoriosModels'
import { gerarPdfRelatorio } from '@/utils/pdfRelatorioGerado';
import BlocoAnaliticoGeral from './blocosExibirRelatorioGerado/BlocoAnaliticoGeral.vue';

type RenderPDF = {
  mostrarComponentePDF: boolean
  nomeArquivo: string
  data: string
  dados: RelatorioGerado
}

const relatorioGerado = defineModel<RenderPDF>('relatorioGerado', {
  required: true
})

watch(
  () => relatorioGerado.value.dados,
  async (novoRelatorio) => {
    if (!novoRelatorio) return;

    await nextTick()
    setTimeout(() => {
      const element = document.getElementById('pdf-content')
      if (element) {
        gerarPdfRelatorio(element, relatorioGerado.value.nomeArquivo, 'portrait')
      }
    }, 500)
  },
  { immediate: true, deep: true }
)

</script>

<style>

#pdf-content {
  opacity: 1;
  z-index: -1;
}

.pdf-wrapper {
  width: 794px; /* A4 width at 96 DPI */
  min-height: 1123px; /* A4 height at 96 DPI */
  background-color: #2a2a2a;
  color: white;
  padding: 32px;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
}

</style>
