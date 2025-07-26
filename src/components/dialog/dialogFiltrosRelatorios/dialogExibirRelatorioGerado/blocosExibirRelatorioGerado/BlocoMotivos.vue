<template>
  <div>
    <h3 class="font-weight-bold pl-3 mb-3">
      <v-icon>mdi-chart-donut-variant</v-icon>
      Motivos
    </h3>

    <v-row dense v-for="(motivo, index) in relatorioGerado" :key="index">
      <v-col cols="4">
        <p> #{{ motivo.idMotivo }}: {{ motivo.descricaoMotivo }}</p>
      </v-col>

      <v-col cols="4">
        <p>Categoria: #{{ motivo.idCategoria }} {{ motivo.descricaoCategoria }}</p>
      </v-col>

      <v-col cols="4">
        <p :class="motivo.emergencial ? 'green-darken-2' : 'red-darken-2'">{{ motivo.emergencial ? 'COMUM' : 'EMERGENCIAL' }}</p>
      </v-col>

      <v-divider />
    </v-row>
  </div>
</template>

<script setup lang="ts">
import type { MotivoConsulta } from '@/models/motivosModels/MotivosModels';

const relatorioGerado = defineModel<MotivoConsulta[]>('blocoresponsaveis')

</script>
