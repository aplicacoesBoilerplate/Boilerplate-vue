<template>
  {{ dados }}
</template>

<script setup lang="ts">
import type { ErrorsConsulta } from '@/models/errorsModels/errorsModels';

const dados = defineModel<ErrorsConsulta>('blocoresponsaveis')

</script>
