<template>
  <div>
    <h3 class="font-weight-bold pl-3 mb-3">
      <v-icon>mdi-chart-donut-variant</v-icon>
      Responsáveis
    </h3>

    <v-row dense v-for="(responsavel, index) in relatorioGerado" :key="index">
      <v-col cols="4">
        <p> #{{ responsavel.idUsuario }} Nome: {{ responsavel.nome }}</p>
      </v-col>

      <v-col cols="4">
        <p>Email: {{ responsavel.email }}</p>
      </v-col>

      <v-col cols="4">
        <p>Permissão: {{ responsavel.permissao }}</p>
      </v-col>

      <v-divider />
    </v-row>
  </div>
</template>

<script setup lang="ts">
import type { UsuarioConsulta } from '@/models/usersModels/UsuariosModels';

const relatorioGerado = defineModel<UsuarioConsulta[]>('blocoresponsaveis')

</script>
