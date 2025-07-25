<template>
  {{ dados }}
</template>

<script setup lang="ts">
import type { SaidaConsulta } from '@/models/saidasModels/saidasModels';

const dados = defineModel<SaidaConsulta>('blocoresponsaveis')

</script>
