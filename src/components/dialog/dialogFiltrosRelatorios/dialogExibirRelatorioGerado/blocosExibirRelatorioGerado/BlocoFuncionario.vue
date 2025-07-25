<template>
  {{ dados }}
</template>

<script setup lang="ts">
import type { funcionarioRegistradoDP } from '@/models/firebirdModels/firebirdModels';

const dados = defineModel<funcionarioRegistradoDP>('blocoresponsaveis')

</script>
