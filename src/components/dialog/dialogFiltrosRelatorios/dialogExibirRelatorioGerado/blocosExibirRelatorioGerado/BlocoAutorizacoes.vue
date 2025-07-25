<template>
  {{ dados }}
</template>

<script setup lang="ts">
import type { AutorizacoesConsulta } from '@/models/saidasModels/saidasModels';

const dados = defineModel<AutorizacoesConsulta>('blocoresponsaveis')

</script>
