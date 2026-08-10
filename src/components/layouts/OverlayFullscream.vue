<template>
  <v-overlay
    :modelValue="exibirOverlay"
    class="align-center justify-center"
    opacity="0.2"
    persistent
  >
    <div class="d-flex flex-column align-center ga-3 pa-6 text-center text-white">
      <v-progress-circular
        color="primary"
        size="44"
        indeterminate
      />

      <slot name="mensagem" />
    </div>
  </v-overlay>
</template>

<script setup lang="ts">
// Reativas - Model
const exibirOverlay = defineModel<boolean>('exibirOverlay', { required: true });
</script>
