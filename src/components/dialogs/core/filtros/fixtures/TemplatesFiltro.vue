<template>
  <v-progress-linear
    v-if="carregando"
    color="primary"
    indeterminate
  />

  <v-chip-group
    v-else-if="templates.length"
    class="pa-2"
  >
    <v-chip
      v-for="template in templates"
      :key="template.id"
      prependIcon="mdi-filter-check-outline"
      color="primary"
      variant="tonal"
      @click="aplicarTemplate(template)"
    >
      {{ template.nome }}
    </v-chip>
  </v-chip-group>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { ref, watch } from 'vue';

// Stores
import { useGenericFilterStore } from '@/stores/genericFilter.store';

// Types e Interfaces
import type { ITemplateFiltro } from '@/models/filters/ITemplateFiltro';

// Services
import { templateFiltroService } from '@/services/CTemplateFiltroService';

/**
 * @property {string} recurso - Contexto estável que separa os templates de cada recurso.
 */
type TProps = {
  recurso: string;
};
const props = defineProps<TProps>();

// Stores
const genericFilterStore = useGenericFilterStore();

// Reativas
const carregando = ref(false);
const templates = ref<ITemplateFiltro[]>([]);

// Funções
function clonarFiltros(pTemplate: ITemplateFiltro): ITemplateFiltro['filtros'] {
  return pTemplate.filtros.map((pFiltro) => ({ ...pFiltro, valoresSelecionados: [...(pFiltro.valoresSelecionados ?? [])] }));
}

function aplicarTemplate(pTemplate: ITemplateFiltro): void {
  genericFilterStore.filtersApplied = clonarFiltros(pTemplate);
  genericFilterStore.confirmarAplicacaoFiltros();
}

async function carregarTemplates(): Promise<void> {
  carregando.value = true;

  try {
    templates.value = await templateFiltroService.buscarTemplates(props.recurso);
  } finally {
    carregando.value = false;
  }
}

// Observadores
watch(
  () => props.recurso,
  () => void carregarTemplates(),
  { immediate: true },
);
</script>
