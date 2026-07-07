<template>
  <v-navigation-drawer
    v-model="toggleLeftDrawer"
    :absolute="true"
    :temporary="!mdAndUp"
    :mobileBreakpoint="0"
  >
    <v-list-item class="pa-0">
      <InputDebouncer
        v-model:pesquisaCampo="genericFilterStore.pesquisaDrawerLeft"
        @onSearch="onSearchCampo"
      />
    </v-list-item>

    <v-divider />

    <v-list-item
      v-for="campo in camposFiltrados"
      :key="String(campo.valor)"
      :title="campo.descricao"
      :prependIcon="campo.icone"
      :active="genericFilterStore.campoSelecionado?.valor === campo.valor"
      v-tooltip="{ text: campo.descricao, openDelay: 300 }"
      class="mt-1 ma-1"
      color="primary"
      rounded="ts-xl be-xl"
      link
      @click="onSelecionarCampo(campo)"
    />
  </v-navigation-drawer>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { ref, watch } from 'vue';
import { useDisplay } from 'vuetify';

// Types e Interfaces
import type { ICampoFiltro } from '@/models/filters/ICampoFiltro';
import { EOperadoresFiltro } from '@/models/filters/enums/EOperadoresFiltro';

// Stores
import { useGenericFilterStore } from '@/stores/genericFilter.store';

// Componentes
import InputDebouncer from '@/components/forms/fixtures/InputDebouncer.vue';

type TProps = {
  camposDisponiveis: ICampoFiltro<any>[];
};
const props = defineProps<TProps>();

// Stores
const genericFilterStore = useGenericFilterStore();

// Composables
const { mdAndUp } = useDisplay();

// Reativas - Model
const toggleLeftDrawer = defineModel<boolean>('toggleLeftDrawer', { required: true });

// Reativas - ref
const camposFiltrados = ref<ICampoFiltro<any>[]>(props.camposDisponiveis);

// Funções
function onSearchCampo(pTermoPesquisa: string) {
  if (!pTermoPesquisa) {
    camposFiltrados.value = props.camposDisponiveis;
    return;
  }

  const searchUpper = pTermoPesquisa.toUpperCase();
  camposFiltrados.value = props.camposDisponiveis.filter(
    (campo) =>
      String(campo.valor).toUpperCase().includes(searchUpper) || campo.descricao.toUpperCase().includes(searchUpper),
  );
}

function onSelecionarCampo(pCampo: ICampoFiltro<any>) {
  genericFilterStore.filterModel = {
    campo: pCampo.valor as string,
    condicao: EOperadoresFiltro.IGUAL,
    valor: undefined,
  };

  if (!mdAndUp.value) {
    toggleLeftDrawer.value = false;
  }
}

// Observadores
watch(() => [props.camposDisponiveis, genericFilterStore.pesquisaDrawerLeft], () => {
    onSearchCampo(genericFilterStore.pesquisaDrawerLeft);
  },
  { immediate: true, deep: true },
);
</script>
