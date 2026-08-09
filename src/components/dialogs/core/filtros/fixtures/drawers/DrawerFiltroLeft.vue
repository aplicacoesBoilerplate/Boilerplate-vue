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
      v-tooltip="{ text: obterDescricaoCampo(campo), openDelay: 300 }"
      :title="obterDescricaoCampo(campo)"
      :prependIcon="campo.icone"
      :active="genericFilterStore.campoSelecionado?.valor === campo.valor"
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
import { useI18n } from 'vue-i18n';
import { useDisplay } from 'vuetify';

// Stores
import { useGenericFilterStore } from '@/stores/genericFilter.store';

import { EOperadoresFiltro } from '@/models/filters/enums/EOperadoresFiltro';
// Types e Interfaces
import type { TCampoFiltroMapeado } from '@/models/filters/MapeamentoFiltros';

// Componentes
import InputDebouncer from '@/components/forms/fixtures/InputDebouncer.vue';

type TProps = {
  camposDisponiveis: TCampoFiltroMapeado[];
};
const props = defineProps<TProps>();

// Stores
const genericFilterStore = useGenericFilterStore();

// Composables
const { mdAndUp } = useDisplay();
const { t, te } = useI18n();

// Reativas - Model
const toggleLeftDrawer = defineModel<boolean>('toggleLeftDrawer', { required: true });

// Reativas - ref
const camposFiltrados = ref<TCampoFiltroMapeado[]>(props.camposDisponiveis);

// Funções
function obterDescricaoCampo(pCampo: TCampoFiltroMapeado): string {
  const chave = `components.dialogFiltro.campos.${pCampo.valor}`;
  return te(chave) ? t(chave) : pCampo.descricao;
}

function onSearchCampo(pTermoPesquisa: string) {
  if (!pTermoPesquisa) {
    camposFiltrados.value = props.camposDisponiveis;
    return;
  }

  const searchUpper = pTermoPesquisa.toUpperCase();
  camposFiltrados.value = props.camposDisponiveis.filter(
    (pCampo) =>
      String(pCampo.valor).toUpperCase().includes(searchUpper) ||
      obterDescricaoCampo(pCampo).toUpperCase().includes(searchUpper),
  );
}

function onSelecionarCampo(pCampo: TCampoFiltroMapeado) {
  genericFilterStore.filterModel = {
    campo: pCampo.valor,
    condicao: EOperadoresFiltro.IGUAL,
    valor: undefined,
  };

  if (!mdAndUp.value) {
    toggleLeftDrawer.value = false;
  }
}

// Observadores
watch(
  () => [props.camposDisponiveis, genericFilterStore.pesquisaDrawerLeft],
  () => {
    onSearchCampo(genericFilterStore.pesquisaDrawerLeft);
  },
  { immediate: true, deep: true },
);
</script>
