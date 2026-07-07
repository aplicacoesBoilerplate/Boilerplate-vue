<template>
  <v-app>
    <component :is="layoutComponent" />
    <SnackbarQueue />

    <OverlayFullscream v-model:exibirOverlay="carregandoHealthCheck">
      <template #mensagem>
        <div class="text-subtitle-1 font-weight-bold">
          Verificando servidor
        </div>

        <div class="text-body-2 text-medium-emphasis text-center">
          Aguarde enquanto validamos a disponibilidade da API.
        </div>
      </template>
    </OverlayFullscream>
  </v-app>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

// Componentes
import AppLayout from '@/layouts/AppLayout.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import SnackbarQueue from './components/SnackbarQueue.vue';
import OverlayFullscream from '@/components/layout/OverlayFullscream.vue';

// Composables
import { useHealthCheck } from '@/composables/useHealthCheck';

// Composables
const route = useRoute();
const { carregando: carregandoHealthCheck, verificarHealthCheck } = useHealthCheck();

// Computadas
const layoutComponent = computed(() => {
  return route.meta.hidden === true ? DefaultLayout : AppLayout;
});

// Lifecycle Hooks
onMounted(() => {
  void verificarHealthCheck();
});
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

/* Oculta scrollbars globalmente */
::-webkit-scrollbar {
  display: none; /* Chrome, Safari e Opera */
}

* {
  -ms-overflow-style: none;  /* IE e Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
