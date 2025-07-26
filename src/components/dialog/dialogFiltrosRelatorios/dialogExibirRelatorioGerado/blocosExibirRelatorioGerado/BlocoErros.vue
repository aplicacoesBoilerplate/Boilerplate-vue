<template>
  <div>
    <h3 class="font-weight-bold pl-3 mb-3">
      <v-icon>mdi-chart-donut-variant</v-icon>
      Errors
    </h3>

    <v-row dense v-for="(error, index) in relatorioGerado" :key="index">
      <v-col cols="12" class="d-flex justify-center">
        <p> #{{ error.idError }} Erro: {{ error.erro }}</p>
      </v-col>

      <v-col cols="12" class="d-flex justify-center">
        <p>Registrado em: {{ error.horaError }}</p>
      </v-col>

      <v-col cols="12">
        <v-row dense>
          <v-col cols="6">
            <p>Arquivo: {{ error.arquivoError }}</p>
          </v-col>

          <v-col cols="6">
            <p>Classe: {{ error.classeError }}</p>
          </v-col>

          <v-col cols="3">
            <p>Metodo: {{ error.metodoError }}</p>
          </v-col>

          <v-col cols="3">
            <p>Linha: {{ error.linhaError }}</p>
          </v-col>

          <v-col cols="3">
            <p>Status code: {{ error.statusCodeError }}</p>
          </v-col>

          <v-col cols="3">
            <p>Saída relacionada: {{ error.idSaida ?? 'Sem vínculo' }}</p>
          </v-col>

        </v-row>
      </v-col>

      <v-col cols="12">
        <p>Responsável:</p>
        <p>#{{ error.idUsuario }} - {{ error.nomeResponsavel }}</p>
        <p>{{ error.emailResponsavel }}</p>
        <p>{{ error.permissaoResponsavel }}</p>
      </v-col>

      <v-divider />
    </v-row>
  </div>
</template>

<script setup lang="ts">
import type { ErrorsConsulta } from '@/models/errorsModels/errorsModels';

const relatorioGerado = defineModel<ErrorsConsulta[]>('blocoresponsaveis')

</script>
