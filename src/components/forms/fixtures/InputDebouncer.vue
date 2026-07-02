<template>
  <v-text-field
    v-model="pesquisa"
    class="mb-1 pa-1"
    :label="label"
    :appendInnerIcon="icon"
    :density="density"
    :variant="variant"
    autocomplete="off"
    :hideDetails="hideDetails"
    :singleLine="singleLine"
    :clearable="clearable"
    @keypress.enter="handleOnSearch(pesquisa)"
    @click:appendInner="handleOnSearch(pesquisa)"
  >
    <template #append-inner>
      <slot
        name="append"
        :appendIcon="icon"
        :handleFunction="handleOnSearch"
      />
    </template>
  </v-text-field>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { watch } from 'vue';

type TProps = {
  label?: string;
  icon?: string;
  density?: 'default' | 'comfortable' | 'compact';
  variant?: 'underlined' | 'outlined' | 'filled' | 'solo' | 'solo-inverted' | 'solo-filled' | 'plain';
  hideDetails?: boolean;
  singleLine?: boolean;
  clearable?: boolean;
};
withDefaults(defineProps<TProps>(), {
  label: "Pesquisar campo",
  icon: "mdi-magnify",
  density: "compact",
  variant: "solo",
  autocomplete: "off",
  hideDetails: true,
  singleLine: true,
  clearable: true
});

type TEmits = {
  onSearch: [termo: string];
};
const emits = defineEmits<TEmits>();
// Reativas
const pesquisa = defineModel<string | null>('pesquisaCampo', { required: true });

// Variáveis
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

// Funções
function handleOnSearch(pTermoPesquisa: string | null) {
  if (debounceTimer) clearTimeout(debounceTimer);

  if (!pTermoPesquisa) {
    emits('onSearch', '');
    return;
  }

  const lTermoPesquisaTratado = pTermoPesquisa
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(" ", "_");

  debounceTimer = setTimeout(() => {
    emits('onSearch', lTermoPesquisaTratado);
  }, 500);
}

// Observadores
watch(pesquisa, (newValue, oldValue) => {
  if (!newValue){
    handleOnSearch(null);
  } else if (newValue?.toUpperCase() !== oldValue?.toUpperCase()) {
    handleOnSearch(newValue);
  }
});

</script>
