<template>
  {{ dados }}
</template>

<script setup lang="ts">
import type { MotivoConsulta } from '@/models/motivosModels/MotivosModels';

const dados = defineModel<MotivoConsulta>('blocoresponsaveis')

</script>
