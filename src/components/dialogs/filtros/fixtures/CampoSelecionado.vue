<template>
  <v-card-item class="pa-4">
    <template #prepend>
      <v-icon
        icon="mdi-filter-variant"
        size="x-large"
        class="mr-4 text-grey-darken-1"
      />
    </template>

    <v-card-title class="d-flex align-center font-weight-bold text-h6 text-darkText">
      <v-icon
        :icon="campoSelecionado?.icone || 'mdi-filter-variant'"
        size="small"
        class="mr-2 text-primary"
      />
      {{ campoSelecionado?.descricao || 'Nenhum campo selecionado' }}
    </v-card-title>

    <v-card-subtitle class="mt-1 text-body-2">
      Tipo de Dado: {{ formatarTiposDados(tiposCampoAtual) }}
    </v-card-subtitle>

    <template #append>
      <v-tooltip
        v-if="possuiConsultaRegistros"
        :text="exibirConsultaRegistros ? 'Ocultar consulta auxiliar' : 'Consultar registros'"
        location="bottom"
      >
        <template #activator="{ props: tooltipProps }">
          <v-btn
            v-bind="tooltipProps"
            :icon="exibirConsultaRegistros ? 'mdi-database-eye-off-outline' : 'mdi-database-search-outline'"
            :color="exibirConsultaRegistros ? 'primary' : 'default'"
            variant="tonal"
            density="comfortable"
            size="small"
            @click="exibirConsultaRegistros = !exibirConsultaRegistros"
          />
        </template>
      </v-tooltip>
    </template>
  </v-card-item>

  <v-divider class="mx-4 mb-4 border-opacity-50" />
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed } from 'vue';

// Types e Interfaces
import type { ICampoFiltro } from '@/models/filters/ICampoFiltro';
import type { ETipoFiltro } from '@/models/filters/enums/ETipoFiltro';

type TProps = {
  campoSelecionado: ICampoFiltro<any> | null;
};
const props = defineProps<TProps>();

// Reativas - Model
const exibirConsultaRegistros = defineModel<boolean>('exibirConsultaRegistros', { default: false });

// Funções
function formatarTiposDados(pTipos: ETipoFiltro[]): string {
  const mapaTraducao: Record<string, string> = {
    string: 'Texto',
    number: 'Numérico',
    boolean: 'Lógico (Sim/Não)',
    date: 'Data/Hora',
    select: 'Seleção',
  };
  return pTipos.map((pTipo) => mapaTraducao[pTipo as string] || pTipo).join(', ');
}

// Computadas
const tiposCampoAtual = computed(() => props.campoSelecionado?.tipos ?? []);
const possuiConsultaRegistros = computed(() => !!props.campoSelecionado?.consultaRegistros);
</script>
