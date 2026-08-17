<template>
  <v-app>
    <component
      :is="layoutComponent"
      v-if="!carregandoHealthCheck"
    />

    <SnackbarQueue />

    <OverlayFullscream v-model:exibirOverlay="carregandoHealthCheck">
      <template #mensagem>
        <div class="text-subtitle-1 font-weight-bold">{{ t('common.app.checkingServer') }}</div>

        <div class="text-body-2 text-high-emphasis text-center">
          {{ t('common.app.checkingServerDescription') }}
        </div>
      </template>
    </OverlayFullscream>
  </v-app>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

// Composables
import { useHealthCheck } from '@/composables/useHealthCheck';
import { useSincronizacaoPermissoesRbac } from '@/composables/useSincronizacaoPermissoesRbac';
import { useThemePreferenceSync } from '@/composables/useThemeSwitch';

// Componentes
import AppLayout from '@/components/layouts/AppLayout.vue';
import DefaultLayout from '@/components/layouts/DefaultLayout.vue';
import OverlayFullscream from '@/components/layouts/OverlayFullscream.vue';

import SnackbarQueue from './components/common/SnackbarQueue.vue';

// Composables
const route = useRoute();
const { t } = useI18n();
const { carregando: carregandoHealthCheck, verificarHealthCheck } = useHealthCheck();
useSincronizacaoPermissoesRbac();
useThemePreferenceSync();

// Computadas
const layoutComponent = computed(() => {
  return route.meta.hidden === true ? DefaultLayout : AppLayout;
});

// Lifecycle Hooks
onMounted(() => {
  void verificarHealthCheck();
});
</script>
