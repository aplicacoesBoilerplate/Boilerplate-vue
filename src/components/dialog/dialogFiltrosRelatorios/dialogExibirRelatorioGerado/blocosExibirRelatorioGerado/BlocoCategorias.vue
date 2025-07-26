<template>
  <div>
    <h3 class="font-weight-bold pl-3 mb-3">
      <v-icon>mdi-chart-donut-variant</v-icon>
      Categorias
    </h3>

    <v-row dense v-for="(categoria, index) in relatorioGerado" :key="index">
      <v-col cols="8">
        <p> #{{ categoria.idCategoria }} {{ categoria.descricaoCategoria }}</p>
      </v-col>

      <v-cols cols="4">
        <p
          :class="!categoria.emergencial ? 'green-darken-2' : 'red-darken-2'"
        >
          {{ !categoria.emergencial ? 'COMUM' : 'EMERGENCIAL' }}
        </p>
      </v-cols>

      <v-divider />
    </v-row>
  </div>
</template>

<script setup lang="ts">
import type { CategoriasMotivos } from '@/models/motivosModels/MotivosModels';

const relatorioGerado = defineModel<CategoriasMotivos[]>('blocoresponsaveis')

</script>
