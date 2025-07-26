<template>
  <div>
    <h3 class="font-weight-bold pl-3 mb-3">
      <v-icon>mdi-chart-donut-variant</v-icon>
      Autorizações
    </h3>

    <v-row dense v-for="(autorizacao, index) in relatorioGerado" :key="index">
      <v-col cols="4">
        <p> #{{ autorizacao.idAutorizacao }} Responsável: #{{ autorizacao.idFuncionarioAutorizacao }} {{ autorizacao.nomeResponsavel }}</p>
      </v-col>

      <v-col cols="4">
        <v-row dense>
          <v-col cols="2">
            <p>Saída: {{ autorizacao.idSaida }}</p>
          </v-col>

          <v-cols cols="10">
            <p :class="autorizacao.aprovacaoSaida ? 'green-darken-2' : 'red-darken-2'">
              {{ autorizacao.aprovacaoSaida ? 'Autorizado em:' : 'Negado em:' }} : {{ autorizacao.dataAutorizacao }}
            </p>
          </v-cols>
        </v-row>
      </v-col>

      <v-col cols="4">
        <p>Permissão: {{ autorizacao.observacaoAutorizacao }}</p>
      </v-col>

      <v-divider />
    </v-row>
  </div>
</template>

<script setup lang="ts">
import type { AutorizacoesConsulta } from '@/models/saidasModels/saidasModels';

const relatorioGerado = defineModel<AutorizacoesConsulta[]>('blocoresponsaveis')

</script>
