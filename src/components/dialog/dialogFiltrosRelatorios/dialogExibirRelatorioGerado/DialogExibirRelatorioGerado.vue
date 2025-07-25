<template>
  <v-dialog v-model="classRelatorioGerado.show" max-width="1100">
    <v-card prepend-icon="mdi-chart-bar"
      :title="`${relatorioGerado.tipoRelatorio} - ${relatorioGerado.modeloRelatorio}`"
      :subtitle="`Gerado em: ${classRelatorioGerado.dataRelatorioGerado}`"
    >
      <v-card-text>

        <!-- Exibição do relatório gerado -->
        <v-virtual-scroll
          :items="relatorioGerado.respostaSinteticaRelatorios"
          height="500" item-height="50"
          v-if="relatorioGerado.tipoRelatorio === 'SINTETICO'"
        >
          <template v-slot:default="{ item: relatorioSintetico }">
            <v-list-item>

              <!-- Ícone de cartão do dado presente no relatório -->
              <template v-slot:prepend>
                <v-icon>mdi-chart-box-outline</v-icon>
              </template>

              <v-row dense>
                <v-col cols="10">
                  {{ relatorioSintetico.descricao }}
                </v-col>

                <v-col cols="2">
                  {{ relatorioSintetico.valor }}
                </v-col>
              </v-row>

            </v-list-item>

            <v-divider />
          </template>
        </v-virtual-scroll>

        <BlocoResponsaveis v-if="relatorioGerado.responsaveis" v-model:dados="relatorioGerado.responsaveis" />
        <BlocoFuncionario v-if="relatorioGerado.funcionario" v-model:dados="relatorioGerado.funcionario" />
        <BlocoSaidas v-if="relatorioGerado.saidas" v-model:dados="relatorioGerado.saidas" />
        <BlocoAutorizacoes v-if="relatorioGerado.autorizacoes" v-model:dados="relatorioGerado.autorizacoes" />
        <BlocoSaidasComAutorizacoes v-if="relatorioGerado.saidasComAutorizacoes" v-model:dados="relatorioGerado.saidasComAutorizacoes" />
        <BlocoCategorias v-if="relatorioGerado.categorias" v-model:dados="relatorioGerado.categorias" />
        <BlocoMotivos v-if="relatorioGerado.motivos" v-model:dados="relatorioGerado.motivos" />
        <BlocoErros v-if="relatorioGerado.errors" v-model:dados="relatorioGerado.errors" />

      </v-card-text>

      <v-divider />

      <v-card-actions>
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

  <RelatorioPDFRenderer
    v-if="mostrarComponentePDF"
    :relatorio="relatorioGerado"
    :dataRelatorioGerado="classRelatorioGerado.dataRelatorioGerado"
    :nomeArquivo="nomeArquivoPDF"
  />

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

const mostrarComponentePDF = ref(false)
const nomeArquivoPDF = ref('')

function salvarRelatorioEmPDF() {
  nomeArquivoPDF.value = `${relatorioGerado.value.tipoRelatorio}_${relatorioGerado.value.modeloRelatorio}_gerado-em-${classRelatorioGerado.value.dataRelatorioGerado}`
  mostrarComponentePDF.value = false

  nextTick(() => {
    mostrarComponentePDF.value = true
  })
}

defineExpose({ openDialog })

</script>
