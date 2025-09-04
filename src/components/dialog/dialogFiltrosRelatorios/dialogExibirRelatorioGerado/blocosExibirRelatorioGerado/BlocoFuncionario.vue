<template>
  <div>
    <h3 class="font-weight-bold pl-3 mb-3">
      <v-icon>mdi-chart-donut-variant</v-icon>
      Funcionários
    </h3>

    <v-row dense v-for="(funcionario, index) in relatorioGerado" :key="index">
      <v-col cols="4">
        <p> #{{ funcionario.codigoFuncionario }} Nome: {{ funcionario.nome }}</p>
      </v-col>

      <v-col cols="4">
        <p>Registro: {{ funcionario.registroDP }}</p>
      </v-col>

      <v-col cols="4">
        <p>Setor: {{ funcionario.setor }}: {{ funcionario.descricaoSetor }}</p>
      </v-col>

      <v-divider />
    </v-row>
  </div>
</template>

<script setup lang="ts">
import type { funcionarioRegistradoDP } from '@/models/firebirdModels/firebirdModels';

const relatorioGerado = defineModel<funcionarioRegistradoDP[]>('dados')

</script>
