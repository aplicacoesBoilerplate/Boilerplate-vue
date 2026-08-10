<template>
  <v-app>
    <component
      :is="layoutComponent"
      v-if="!carregandoHealthCheck"
    />

    <SnackbarQueue />

    <OverlayFullscream v-model:exibirOverlay="carregandoHealthCheck">
      <template #mensagem>
        <div class="text-subtitle-1 font-weight-bold">Verificando servidor</div>

        <div class="text-body-2 text-white text-center">
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

// Composables
import { useHealthCheck } from '@/composables/useHealthCheck';
import { useSincronizacaoPermissoesRbac } from '@/composables/useSincronizacaoPermissoesRbac';

// Componentes
import AppLayout from '@/components/layouts/AppLayout.vue';
import DefaultLayout from '@/components/layouts/DefaultLayout.vue';
import OverlayFullscream from '@/components/layouts/OverlayFullscream.vue';

import SnackbarQueue from './components/common/SnackbarQueue.vue';

// Composables
const route = useRoute();
const { carregando: carregandoHealthCheck, verificarHealthCheck } = useHealthCheck();
useSincronizacaoPermissoesRbac();

// Computadas
const layoutComponent = computed(() => {
  return route.meta.hidden === true ? DefaultLayout : AppLayout;
});

// Lifecycle Hooks
onMounted(() => {
  void verificarHealthCheck();
});
</script>
