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
          v-if="hasFilters"
          class="d-flex flex-row"
        >
          <DialogFiltro
            v-model:exibirFiltros="exibirFiltros"
            :camposDisponiveis="genericFilterStore.camposDisponiveis"
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
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useHotkey } from 'vuetify';

// Stores
import { useGenericFilterStore } from '@/stores/genericFilter.store';

import { EOperadoresFiltro } from '@/models/filters/enums/EOperadoresFiltro';
// Types e Interfaces
import type { TParametrosBusca } from '@/models/filters/TParametrosBusca';

// Componentes
import DialogFiltro from '@/components/dialogs/core/filtros/DialogFiltro.vue';

type TProps = { loading: boolean };
defineProps<TProps>();

type TEmits = { search: [consulta: TParametrosBusca] };
const emits = defineEmits<TEmits>();

// Composables
const route = useRoute();
const { t } = useI18n();

// Stores
const genericFilterStore = useGenericFilterStore();

// Reativas - ref
const inputRef = ref<any>(null);
const searchQuery = ref('');
const exibirFiltros = ref<boolean>(false);

// Funções
function onSubmit() {
  if (searchQuery.value) {
    const campoPadrao = genericFilterStore.camposDisponiveis.find((c) => c.pesquisaPadrao);

    if (campoPadrao) {
      const condicaoFiltro = campoPadrao.operadorPesquisaPadrao || EOperadoresFiltro.CONTEM;
      const indexFiltroExistente = genericFilterStore.filtersApplied.findIndex(
        (f) => f.campo === campoPadrao.valor && f.condicao === condicaoFiltro,
      );

      if (indexFiltroExistente !== -1) {
        genericFilterStore.filtersApplied[indexFiltroExistente].valor = searchQuery.value;
      } else {
        genericFilterStore.filtersApplied.push({
          campo: campoPadrao.valor as string,
          condicao: condicaoFiltro,
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
const hasFilters = computed(() => {
  return !!route.meta?.filterResource;
});

// Observadores e Hooks
useHotkey('ctrl+k', () => {
  inputRef.value?.focus();
});
</script>

<style scoped>
.rounded-search :deep(.v-field) {
  overflow: hidden;
}
</style>
