<template>
  <v-autocomplete
    v-model="valoresSelecionados"
    :rules="rulesList"
    :items="opcoesDisponiveis"
    :label="t('components.inputValorFiltro.selecioneValores')"
    itemTitle="title"
    itemValue="value"
    variant="outlined"
    density="compact"
    autocomplete="off"
    hideDetails
    multiple
    clearable
    @keypress.enter="$emit('onEnter')"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

type TProps = {
  opcoesDisponiveis?: { title: string; value: unknown }[];
};

defineProps<TProps>();

type TEmits = {
  onEnter: [];
};

defineEmits<TEmits>();

const { t } = useI18n();

const valor = defineModel<unknown>('valor', { required: true });

const valoresSelecionados = computed<unknown[]>({
  get: () => (Array.isArray(valor.value) ? valor.value : []),
  set: (pNovosValores: unknown[]) => {
    valor.value = pNovosValores;
  },
});

const rulesList = computed(() => {
  return [
    (pValor: unknown) =>
      (Array.isArray(pValor) && pValor.length > 0) || t('components.inputValorFiltro.selecioneAoMenosUmValor'),
  ];
});
</script>
