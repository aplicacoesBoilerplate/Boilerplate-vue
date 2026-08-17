<template>
  <v-overlay
    :modelValue="exibirOverlay"
    :scrim="corScrim"
    :opacity="opacidadeScrim"
    class="align-center justify-center"
    persistent
  >
    <div class="d-flex flex-column align-center ga-3 pa-6 text-center text-high-emphasis">
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
import { computed } from 'vue';
import { useTheme } from 'vuetify';

// Reativas - Model
const exibirOverlay = defineModel<boolean>('exibirOverlay', { required: true });

const theme = useTheme();
const corScrim = computed(() => (theme.global.current.value.dark ? '#000000' : '#FFFFFF'));
const opacidadeScrim = computed(() => (theme.global.current.value.dark ? 0.32 : 0.18));
</script>
