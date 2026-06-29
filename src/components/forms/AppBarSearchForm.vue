<template>
  <v-form @submit.prevent="onSubmit" class="search-form w-100">
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
      hideDetails
      singleLine
      clearable
    >
      <template v-if="$vuetify.display.mdAndUp" #prepend-inner>
        <div class="d-flex flex-row" v-if="hasFilters">
          <DialogFiltro
            v-model:exibirFiltros="exibirFiltros"
            :camposDisponiveis="genericFilterStore.camposDisponiveis"
          />

          <v-divider
            vertical
            class="mx-1 me-2 my-auto"
            style="height: 24px"
            :thickness="2"
          />
        </div>

        <v-hotkey
          keys="ctrl+k"
          display-mode="icon"
          variant="contained"
          platform="auto"
          class="mr-2"
        />
      </template>

      <template #append-inner>
        <v-btn
          icon="mdi-magnify"
          v-tooltip="t('tooltips.appBar.search')"
          variant="plain"
          @click="onSubmit"
        />
      </template>
    </v-text-field>
  </v-form>
</template>

<script setup lang="ts">
// Ecossistema vue
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHotkey } from 'vuetify'

// Stores
import { useGenericFilterStore } from '@/stores/genericFilter.store'

// Types e Interfaces
import type { TParametrosBusca } from '@/models/filters/TParametrosBusca';
import { EOperadoresFiltro } from '@/models/filters/enums/EOperadoresFiltro';

// Componentes
import DialogFiltro from '../dialogs/filtros/DialogFiltro.vue'

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
const inputRef = ref<any>(null)
const searchQuery = ref('');
const exibirFiltros = ref<boolean>(false);

// Funções
function onSubmit() {
  if (searchQuery.value) {
    const campoPadrao = genericFilterStore.camposDisponiveis.find((c) => c.pesquisaPadrao);
    
    if (campoPadrao) {
      genericFilterStore.filtersApplied.push({
        campo: campoPadrao.valor as string,
        condicao: campoPadrao.operadorPesquisaPadrao || EOperadoresFiltro.CONTEM,
        valor: searchQuery.value,
        dataInicio: '',
        dataFinal: '',
        valoresSelecionados: []
      });
      genericFilterStore.syncToUrl();
    } else {
      emits('search', { queryBasica: searchQuery.value });
    }
    
    searchQuery.value = '';
  }
}

// Computadas
const hasFilters = computed(() => { return !!route.meta?.filterResource; });

// Observadores e Hooks
useHotkey('ctrl+k', () => {
  inputRef.value?.focus()
})

</script>

<style scoped>
.search-form {
  max-width: 480px;
}
.rounded-search :deep(.v-field) {
  overflow: hidden;
}
</style>
