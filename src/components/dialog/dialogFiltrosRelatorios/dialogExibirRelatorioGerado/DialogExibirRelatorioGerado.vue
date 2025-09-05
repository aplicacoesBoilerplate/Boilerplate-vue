<template>
  <v-dialog v-model="classRelatorioGerado.show" max-width="1100" max-height="800">
    <v-card
      prepend-icon="mdi-chart-bar"
      :title="`${relatorioGerado.tipoRelatorio} - ${relatorioGerado.modeloRelatorio}`"
      :subtitle="`Gerado em: ${classRelatorioGerado.dataRelatorioGerado}`"
    >
      <v-card-text style="max-height: 500px; overflow-y: auto;">

        <BlocoResponsaveis v-if="relatorioGerado.responsaveis" v-model:dados="relatorioGerado.responsaveis" />
        <BlocoFuncionario v-if="relatorioGerado.funcionario" v-model:dados="relatorioGerado.funcionario" />
        <BlocoSaidas v-if="relatorioGerado.saidas" v-model:dados="relatorioGerado.saidas" />
        <BlocoAutorizacoes v-if="relatorioGerado.autorizacoes" v-model:dados="relatorioGerado.autorizacoes" />
        <BlocoSaidasComAutorizacoes v-if="relatorioGerado.saidasComAutorizacoes" v-model:dados="relatorioGerado.saidasComAutorizacoes" />
        <BlocoCategorias v-if="relatorioGerado.categorias" v-model:dados="relatorioGerado.categorias" />
        <BlocoMotivos v-if="relatorioGerado.motivos" v-model:dados="relatorioGerado.motivos" />
        <BlocoErros v-if="relatorioGerado.errors" v-model:dados="relatorioGerado.errors" />
        <BlocoAnaliticoGeral v-if="relatorioGerado.analiticoGeral" v-model:dados="relatorioGerado.analiticoGeral" />
        <BlocoSintetico v-if="relatorioGerado.respostaSinteticaRelatorios" v-model:dados="relatorioGerado.respostaSinteticaRelatorios" />

      </v-card-text>
      <v-divider />
      <v-card-actions class="sticky-actions">
        <v-btn color="red" variant="plain" @click="closeDialog()">
          <v-icon class="pt-1">mdi-close</v-icon>
          Fechar
        </v-btn>
        <v-spacer />

        <v-btn color="success" variant="tonal" @click="salvarRelatorioEmPDF()">
          <v-icon class="pt-1">mdi-content-save</v-icon>
          Salvar relatório
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <RelatorioPDFRenderer v-if="renderPDF.mostrarComponentePDF" v-model:relatorioGerado="renderPDF" />
</template>

<script setup lang="ts">
// Componentes
import BlocoSaidasComAutorizacoes from './blocosExibirRelatorioGerado/BlocoSaidasComAutorizacoes.vue';
import BlocoResponsaveis from './blocosExibirRelatorioGerado/BlocoResponsaveis.vue';
import BlocoAutorizacoes from './blocosExibirRelatorioGerado/BlocoAutorizacoes.vue';
import BlocoFuncionario from './blocosExibirRelatorioGerado/BlocoFuncionario.vue';
import BlocoCategorias from './blocosExibirRelatorioGerado/BlocoCategorias.vue';
import BlocoMotivos from './blocosExibirRelatorioGerado/BlocoMotivos.vue';
import BlocoSaidas from './blocosExibirRelatorioGerado/BlocoSaidas.vue';
import BlocoErros from './blocosExibirRelatorioGerado/BlocoErros.vue';

// Componente específico para gerar PDF
import RelatorioPDFRenderer from './RelatorioPDFRenderer.vue';
// Classes
import { DialogExibirRelatorioGeradoClass } from './ClassExibirRelatorioGerado';
// Models
import type { RelatorioGerado } from '@/models/relatoriosModels/relatoriosModels';
// Vue
import { nextTick, ref } from 'vue';
import BlocoAnaliticoGeral from './blocosExibirRelatorioGerado/BlocoAnaliticoGeral.vue';
import BlocoSintetico from './blocosExibirRelatorioGerado/BlocoSintetico.vue';

const classRelatorioGerado = ref(new DialogExibirRelatorioGeradoClass())
const relatorioGerado = defineModel<RelatorioGerado>('relatorioGerado', {
  required: true
})

function openDialog() {
  classRelatorioGerado.value.openDialog()
}

function closeDialog() {
  classRelatorioGerado.value.closeDialog()
}

type RenderPDF = {
  mostrarComponentePDF: boolean
  nomeArquivo: string
  data: string
  dados: RelatorioGerado
}

const renderPDF = ref<RenderPDF>({
  mostrarComponentePDF: false,
  nomeArquivo: '',
  data: '',
  dados: relatorioGerado.value
})

function salvarRelatorioEmPDF() {
  renderPDF.value.nomeArquivo = `${relatorioGerado.value.tipoRelatorio}_${relatorioGerado.value.modeloRelatorio}_gerado-em-${classRelatorioGerado.value.dataRelatorioGerado}`
  renderPDF.value.dados = { ...relatorioGerado.value }
  renderPDF.value.data = classRelatorioGerado.value.dataRelatorioGerado
  renderPDF.value.mostrarComponentePDF = false

  nextTick(() => {
    renderPDF.value.mostrarComponentePDF = true
  })
}

defineExpose({ openDialog })

</script>
