<template>
  <v-overlay
    :modelValue="exibirOverlay"
    class="align-center justify-center"
    persistent
  >
    <v-card
      class="d-flex flex-column align-center ga-3 pa-6"
      minWidth="280"
      rounded="lg"
    >
      <v-progress-circular
        color="primary"
        size="44"
        indeterminate
      />

      <slot name="mensagem" />
    </v-card>
  </v-overlay>
</template>

<script setup lang="ts">
const exibirOverlay = defineModel<boolean>('exibirOverlay', { required: true });
</script>
