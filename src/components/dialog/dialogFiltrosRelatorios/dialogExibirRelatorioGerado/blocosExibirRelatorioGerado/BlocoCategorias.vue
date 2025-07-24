<template>
  {{ dados }}
</template>

<script setup lang="ts">
import type { CategoriasMotivos } from '@/models/motivosModels/MotivosModels';

const dados = defineModel<CategoriasMotivos>('blocoresponsaveis')

</script>
