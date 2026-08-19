<template>
  <v-row>
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

import ListaRealizadosVersoes from './ListaRealizadosVersoes.vue';
// Componentes
import ResumoVersoes from './ResumoVersoes.vue';

type TProps = TPropsResumoVersoes & TPropsListaRealizadosVersoes
defineProps<TProps>();

</script>
