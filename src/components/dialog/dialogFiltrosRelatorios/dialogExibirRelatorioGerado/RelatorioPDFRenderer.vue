<template>
  <div
    id="pdf-content"
    ref="pdfContent"
    class="print-only"
    style="position: absolute; top: -9999px; left: -9999px;"
  >
    <h2>{{ relatorio.tipoRelatorio }} - {{ relatorio.modeloRelatorio }}</h2>
    <p>Gerado em: {{ dataRelatorioGerado }}</p>

    <div v-if="relatorio.respostaSinteticaRelatorios">
      <h3>Resumo</h3>
      <ul>
        <li v-for="(item, index) in relatorio.respostaSinteticaRelatorios" :key="index">
          <strong>{{ item.descricao }}:</strong> {{ item.valor }}
        </li>
      </ul>
    </div>

    <div v-if="relatorio.responsaveis">
      <h3>Responsáveis</h3>
      <p>Nome: {{ relatorio.responsaveis.nome }}</p>
      <p>Email: {{ relatorio.responsaveis.email }}</p>
      <!-- Outros campos relevantes -->
    </div>

    <!-- Repetir lógica para os demais blocos: funcionario, saidas, etc -->
  </div>
</template>

<script setup lang="ts">
import { nextTick, watch } from 'vue'
import type { RelatorioGerado } from '@/models/relatoriosModels/relatoriosModels'
import { gerarPdfRelatorio } from '@/utils/pdfRelatorioGerado';

const props = defineProps<{
  relatorio: RelatorioGerado,
  dataRelatorioGerado: string,
  nomeArquivo: string
}>()

watch(
  () => props.relatorio,
  async (novoRelatorio) => {
    if (!novoRelatorio) return;

    await nextTick();

    const element = document.getElementById('pdf-content')
    if (element) {
      gerarPdfRelatorio(element, props.nomeArquivo, 'portrait')
    }
  },
  { immediate: true, deep: true }
)

</script>

<style>
.print-only {
  opacity: 1 !important;
  color: #000 !important;
  background: #fff !important;
  filter: none !important;
}

</style>
