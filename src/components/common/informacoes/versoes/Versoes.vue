<template>
  <v-row density="comfortable">
    <ResumoVersoes
      :totalAlteracoes="totalAlteracoes"
      :versaoAtual="versaoAtual"
      :versaoMaisRecenteChangelog="versaoMaisRecenteChangelog"
      :versoes="versoes"
    />

    <ListaRealizadosVersoes
      :versaoAtual="versaoAtual"
      :versoes="versoes"
    />
  </v-row>
</template>

<script setup lang="ts">
// Types e Interfaces
import type { TPropsResumoVersoes } from '@/models/components/IVersaoChangelog'
import type { TPropsListaRealizadosVersoes } from '@/models/components/IVersaoChangelog'

// Componentes
import ResumoVersoes from './ResumoVersoes.vue';
import ListaRealizadosVersoes from './ListaRealizadosVersoes.vue';

type TProps = TPropsResumoVersoes & TPropsListaRealizadosVersoes
const props = defineProps<TProps>();

</script>
