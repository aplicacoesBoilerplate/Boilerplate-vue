<script setup lang="ts">
import DateTimePicker from '@/components/DateTimePicker.vue';
import { ref } from 'vue'
const saidaFuncionario1 = ref('')
const saidaFuncionario2 = ref('')
</script>

<template>
  <DateTimePicker v-model="saidaFuncionario1" label="Data e hora da saída" />
  <p>Data selecionada: {{ saidaFuncionario1 }}</p>
  <DateTimePicker v-model="saidaFuncionario2" label="Data e hora da saída" icon="mdi-calendar-clock" />
  <p>Data selecionada: {{ saidaFuncionario2 }}</p>
</template>
