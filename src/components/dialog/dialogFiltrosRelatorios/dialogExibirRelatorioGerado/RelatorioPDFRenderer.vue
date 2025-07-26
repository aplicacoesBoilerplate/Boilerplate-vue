<template>
  <div
    id="pdf-content"
    ref="pdfContent"
    style="position: absolute; top: -9999px; left: -9999px;"
  >
    <div class="pdf-wrapper">
      <h2 class="d-flex justify-center">
        RELATÓRIO {{ relatorioGerado.tipoRelatorio }} - {{ relatorioGerado.modeloRelatorio }}
      </h2>
      <p class="d-flex justify-center">{{ dataRelatorioGerado }}</p>

      <BlocoResponsaveis v-if="relatorioGerado.responsaveis" v-model:dados="relatorioGerado.responsaveis" />
      <BlocoFuncionario v-if="relatorioGerado.funcionario" v-model:dados="relatorioGerado.funcionario" />
      <BlocoSaidas v-if="relatorioGerado.saidas" v-model:dados="relatorioGerado.saidas" />
      <BlocoAutorizacoes v-if="relatorioGerado.autorizacoes" v-model:dados="relatorioGerado.autorizacoes" />
      <BlocoSaidasComAutorizacoes v-if="relatorioGerado.saidasComAutorizacoes" v-model:dados="relatorioGerado.saidasComAutorizacoes" />
      <BlocoCategorias v-if="relatorioGerado.categorias" v-model:dados="relatorioGerado.categorias" />
      <BlocoMotivos v-if="relatorioGerado.motivos" v-model:dados="relatorioGerado.motivos" />
      <BlocoErros v-if="relatorioGerado.errors" v-model:dados="relatorioGerado.errors" />

      <div v-if="relatorioGerado.respostaSinteticaRelatorios">
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
            <tr v-for="(item, index) in relatorioGerado.respostaSinteticaRelatorios" :key="index">
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

const props = defineProps<{
  relatorioGerado: RelatorioGerado,
  dataRelatorioGerado: string,
  nomeArquivo: string
}>()

watch(
  () => props.relatorioGerado,
  async (novoRelatorio) => {
    if (!novoRelatorio) return;

    await nextTick()
    setTimeout(() => {
      const element = document.getElementById('pdf-content')
      if (element) {
        gerarPdfRelatorio(element, props.nomeArquivo, 'portrait')
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
