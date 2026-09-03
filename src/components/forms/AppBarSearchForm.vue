<template>
  <v-form
    class="w-100"
    @submit.prevent="onSubmit"
  >
    <v-text-field
      ref="inputRef"
      v-model="searchQuery"
      :placeholder="t('forms.formSearch.inputSearch.placeholder')"
      :loading="loading"
      class="rounded-search"
      density="compact"
      variant="solo"
      rounded="pill"
      loaderHeight="2"
      autocomplete="off"
      hideDetails
      singleLine
      clearable
    >
      <template #prepend-inner>
        <div
          v-if="possuiFiltros"
          class="d-flex flex-row"
        >
          <DialogFiltro
            v-model:exibirFiltros="exibirFiltros"
            :camposDisponiveis="genericFilterStore.camposDisponiveis"
            :filtrosPreDefinidos="filtrosPreDefinidos"
          />

          <v-divider
            :thickness="2"
            class="mx-1 me-2 my-auto"
            style="height: 24px"
            vertical
          />
        </div>

        <v-hotkey
          v-if="$vuetify.display.mdAndUp"
          keys="ctrl+k"
          displayMode="icon"
          variant="contained"
          platform="auto"
          class="mr-2"
        />
      </template>

      <template #append-inner>
        <v-btn
          v-tooltip="t('tooltips.appBar.search')"
          icon="mdi-magnify"
          variant="plain"
          @click="onSubmit"
        />
      </template>
    </v-text-field>
  </v-form>
</template>

<script setup lang="ts">
// Ecossistema vue
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useHotkey } from 'vuetify';

// Stores
import { useGenericFilterStore } from '@/stores/genericFilter.store';

import { EOperadoresFiltro } from '@/models/filters/enums/EOperadoresFiltro';
// Types e Interfaces
import type { IFiltroPreDefinido } from '@/models/filters/ICampoFiltro';
import type { TParametrosBusca } from '@/models/filters/TParametrosBusca';
import type { VInput } from 'vuetify/components';

// Componentes
import DialogFiltro from '@/components/dialogs/core/filtros/DialogFiltro.vue';

type TProps = { loading: boolean };
defineProps<TProps>();

type TEmits = { search: [consulta: TParametrosBusca] };
const emits = defineEmits<TEmits>();

// Composables
const route = useRoute();
const { t } = useI18n();

useHotkey('ctrl+k', () => {
  inputRef.value?.focus();
});

// Stores
const genericFilterStore = useGenericFilterStore();

// Reativas - ref
const inputRef = ref<typeof VInput | null>(null);
const searchQuery = ref('');
const exibirFiltros = ref<boolean>(false);

// Funções
function onSubmit() {
  if (searchQuery.value) {
    const lCampoPadrao = genericFilterStore.camposDisponiveis.find((pCampo) => pCampo.pesquisaPadrao);

    if (lCampoPadrao) {
      const lCondicaoFiltro = lCampoPadrao.operadorPesquisaPadrao || EOperadoresFiltro.CONTEM;
      const lIndexFiltroExistente = genericFilterStore.filtersApplied.findIndex(
        (pFiltro) => pFiltro.campo === lCampoPadrao.valor && pFiltro.condicao === lCondicaoFiltro,
      );

      if (lIndexFiltroExistente !== -1) {
        genericFilterStore.filtersApplied[lIndexFiltroExistente].valor = searchQuery.value;
      } else {
        genericFilterStore.filtersApplied.push({
          campo: lCampoPadrao.valor as string,
          condicao: lCondicaoFiltro,
          valor: searchQuery.value,
          dataInicio: '',
          dataFinal: '',
          valoresSelecionados: [],
        });
      }
      genericFilterStore.confirmarAplicacaoFiltros();
    } else {
      emits('search', { queryBasica: searchQuery.value });
    }

    searchQuery.value = '';
  }
}

// Computadas
const possuiFiltros = computed(() => {
  return !!route.meta?.filterResource;
});
const filtrosPreDefinidos = computed<IFiltroPreDefinido[]>(() => {
  return route.meta.predefinedFilters ?? [];
});
</script>

<style scoped>
.rounded-search :deep(.v-field) {
  overflow: hidden;
}
</style>
