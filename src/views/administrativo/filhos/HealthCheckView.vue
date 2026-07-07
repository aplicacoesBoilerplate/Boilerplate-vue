<template>
  <v-container
    class="pa-0"
    fluid
  >
    <v-card
      class="pa-4"
      elevation="4"
    >
      <div class="d-flex align-center justify-space-between flex-wrap ga-3 mb-4">
        <div>
          <div class="text-h6 font-weight-bold">Health-check</div>
          <div class="text-body-2 text-medium-emphasis">
            Retorno atual do endpoint administrativo da API.
          </div>
        </div>

        <div class="d-flex align-center ga-2">
          <v-chip
            :color="statusColor"
            variant="tonal"
          >
            HTTP {{ resultado?.statusCode ?? '-' }}
          </v-chip>

          <v-btn
            icon="mdi-refresh"
            color="primary"
            variant="tonal"
            :loading="carregando"
            @click="verificar"
          />
        </div>
      </div>

      <v-alert
        :type="resultado?.statusCode === 200 ? 'success' : 'warning'"
        variant="tonal"
        class="mb-4"
      >
        Status da API: {{ statusApi }}
      </v-alert>

      <v-sheet
        class="pa-3 overflow-auto bg-background"
        rounded
        border
        maxHeight="520"
      >
        <pre class="ma-0 text-body-2">{{ retornoFormatado }}</pre>
      </v-sheet>
    </v-card>

    <OverlayFullscream v-model:exibirOverlay="carregando">
      <template #mensagem>
        <div class="text-subtitle-1 font-weight-bold">
          Consultando health-check
        </div>

        <div class="text-body-2 text-medium-emphasis text-center">
          Aguarde enquanto buscamos o retorno atualizado do servidor.
        </div>
      </template>
    </OverlayFullscream>
  </v-container>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed, onMounted } from 'vue';

// Composables
import { useHealthCheck } from '@/composables/useHealthCheck';

// Componentes
import OverlayFullscream from '@/components/layout/OverlayFullscream.vue';

// Composables
const { carregando, resultado, verificarHealthCheck } = useHealthCheck();

// Funções
async function verificar(): Promise<void> {
  await verificarHealthCheck({
    detalhado: true,
  });
}

// Computadas
const statusApi = computed(() => String(resultado.value?.data?.status ?? 'Indisponível'));
const statusColor = computed(() => (resultado.value?.statusCode === 200 ? 'success' : 'error'));
const retornoFormatado = computed(() => JSON.stringify(resultado.value?.data ?? {}, null, 2));

// Lifecycle Hooks
onMounted(() => {
  void verificar();
});
</script>
