<template>
  <div>
    <h1 class="d-flex justify-center mb-6">Dashboard Homepage</h1>
  </div>
  <v-container class="container-dashboard">
    <v-row dense>
      <v-col v-for="indicador in indicadores" :key="indicador.id" cols="12" md="6">
        <v-card variant="outlined" class="mx-auto" :color="indicador.color" max-width="600" :subtitle="indicador.about"
          :title="indicador.title">
          <template v-slot:actions>
            <v-icon>{{ indicador.icon }}</v-icon>
            {{ indicador.amount }}
          </template>
        </v-card>
        <div class="text-center text-caption">{{ indicador.hint }}</div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const indicadores = ref([
  // { id: 0, hint: '', title: '', amount: '', about: '', color: '', icon: '' },
  { id: 1, hint: 'bad', title: 'Tasks pending', amount: '7', about: 'Total number of pending tasks', color: 'red', icon: 'mdi-checkbox-marked-circle-minus-outline' },
  { id: 2, hint: 'good', title: 'Tasks in progress', amount: '3', about: 'Total number of in progress tasks', color: 'primary', icon: 'mdi-checkbox-marked-circle-plus-outline' },
  { id: 3, hint: 'good', title: 'Tasks completed', amount: '3', about: 'Total number of completed tasks', color: 'success', icon: 'mdi-checkbox-marked-circle-auto-outline' },
  { id: 4, hint: 'undefined', title: 'Total tasks', amount: '13', about: 'Total number of tasks registered in the system regardless of status', color: '', icon: 'mdi-calendar-check-outline' }
])
</script>

<style>
.container-dashboard {
  padding: 2rem;
}
</style>
