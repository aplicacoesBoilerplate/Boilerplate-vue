<template>
  <div>
    <h3 class="font-weight-bold pl-3 mb-3">
      <v-icon>mdi-chart-donut-variant</v-icon>
      Autorizações
    </h3>

    <!-- Loop pelas saídas -->
    <v-row dense v-for="(saida, indexSaida) in relatorioGerado?.informacoesSaidasComAutorizacoes" :key="indexSaida">
      <v-col cols="12">
        <h4 class="font-weight-bold">
          Saída #{{ saida.idSaida }} - {{ saida.nomeFuncionario }}
        </h4>
      </v-col>

      <!-- Loop pelas autorizações dentro da saída -->
      <v-row dense v-for="(autorizacao, indexAut) in saida.autorizacoes" :key="indexAut" class="pl-6">
        <v-col cols="4">
          <p>
            Autorização: {{ autorizacao.idAutorizacao }}
            Responsável: {{ autorizacao.idFuncionarioAutorizacao }}
            {{ autorizacao.nomeResponsavel || '---' }}
          </p>
        </v-col>

        <v-col cols="4">
          <v-row dense>
            <v-col cols="12">
              <p :class="autorizacao.aprovacaoSaida ? 'green-darken-2' : 'red-darken-2'">
                {{ autorizacao.aprovacaoSaida ? 'Autorizado em:' : 'Negado em:' }}
                {{ autorizacao.dataAutorizacao }}
              </p>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="4">
          <p>Permissão: {{ autorizacao.observacaoAutorizacao || '---' }}</p>
        </v-col>

        <v-divider />
      </v-row>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import type { AnaliticoGeral } from '@/models/relatoriosModels/respostasEspecificasModels';

const relatorioGerado = defineModel<AnaliticoGeral>('dados');
</script>
