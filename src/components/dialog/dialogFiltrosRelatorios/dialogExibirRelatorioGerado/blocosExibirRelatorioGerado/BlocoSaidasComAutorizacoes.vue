<template>
  {{ dados }}
</template>

<script setup lang="ts">
import type { SaidasComAutorizacoes } from '@/models/saidasModels/saidasModels';

const dados = defineModel<SaidasComAutorizacoes>('blocoresponsaveis')

</script>
