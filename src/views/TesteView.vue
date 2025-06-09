<script setup lang="ts">
import DateTimePicker from '@/components/DateTimePicker.vue';
import InputTextUpperCase from '@/components/InputTextUpperCase.vue';
import InputUpperCase from '@/components/InputUpperCase.vue';
import { ref } from 'vue'
const saidaFuncionario1 = ref('')
const saidaFuncionario2 = ref('06/06/2025 12:00:00')
const search = ref('')
const search2 = ref('teste')
const styleTeste = ref({
  icon: 'mdi-magnify',
  density: 'compact',
  disabled: false,
  inputVariant: 'outlined',
  btnVariant: 'text',
  label: 'Consultar',
  showPrepend: true
})
</script>

<template>
  <!-- <DateTimePicker v-model="saidaFuncionario1" label="Data e hora da saída" />
  <p>Data selecionada: {{ saidaFuncionario1 }}</p>
  <DateTimePicker v-model="saidaFuncionario2" label="Data e hora da saída" icon="mdi-calendar-clock" />
  <p>Data selecionada: {{ saidaFuncionario2 }}</p>

  <br>
  <br>

  <v-text-field v-model="search" v-uppercase clearable density="compact" variant="outlined"
    placeholder="Consultar motivos" hide-details style="max-width: 300px">
    <template #prepend-inner>
      <v-btn icon variant="text" size="small" :disabled="!search" @click="console.log('Uso da diretiva: ', search)">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </template>
</v-text-field>

<br>
<br>

<v-text-field v-model="search2" clearable density="compact" variant="outlined" placeholder="Consultar motivos"
  hide-details style="max-width: 300px">
  <template #prepend-inner>
      <v-btn icon variant="text" size="small" :disabled="!search2"
        @click="console.log('Uso de método: ', search2.toUpperCase())">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </template>
</v-text-field>

<br>
<br>

search com diretiva: {{ search }}
<br>
search2 com método: {{ search2 }}

<br>
<br> -->

  <InputUpperCase v-model:="search" :style="styleTeste" @on-prepend-click="console.log('Clicou no botão!')"
    style="max-width: 300px" />

  {{ search }}

  <InputUpperCase v-model:="search2" :style="{
    icon: 'mdi-magnify',
    density: 'compact',
    disabled: false,
    inputVariant: 'outlined',
    btnVariant: 'text',
    label: 'Consultar',
    showPrepend: true,
    maxWidth: 300,
  }" @on-prepend-click="console.log('Clicou no botão!')" />

  {{ search2 }}

  <InputTextUpperCase v-model:="search" :style="{ maxWidth: 300 }" />

</template>
