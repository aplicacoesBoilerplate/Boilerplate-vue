<template>
  <div>
    <h3 class="font-weight-bold pl-3 mb-3">
      <v-icon>mdi-chart-box-outline</v-icon>
      Respostas sintéticas
    </h3>

    <v-row dense v-for="(sintetico, index) in relatorioGerado" :key="index">
      <v-col cols="10">
        {{ sintetico.descricao }}
      </v-col>

      <v-col cols="2">
        {{ sintetico.valor }}
      </v-col>

      <v-divider />
    </v-row>
  </div>
</template>

<script setup lang="ts">
import type { RelatorioSintetico } from '@/models/relatoriosModels/relatoriosModels';

const relatorioGerado = defineModel<RelatorioSintetico[]>('dados')

</script>
