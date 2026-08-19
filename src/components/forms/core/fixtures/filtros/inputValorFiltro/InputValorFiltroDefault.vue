<template>
  <v-text-field
    v-if="htmlType === 'number'"
    v-model="valorNumerico"
    :rules="rulesList"
    :type="htmlType"
    :label="label"
    variant="outlined"
    density="compact"
    inputmode="decimal"
    autocomplete="off"
    hideDetails
    clearable
    @keypress.enter="$emit('onEnter')"
  />

  <v-text-field
    v-else
    v-model="valorTexto"
    :rules="rulesList"
    :type="htmlType"
    :label="label"
    variant="outlined"
    density="compact"
    autocomplete="off"
    hideDetails
    clearable
    @keypress.enter="$emit('onEnter')"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

type TProps = {
  htmlType: string;
  campo?: string | null;
};

defineProps<TProps>();

type TEmits = {
  onEnter: [];
};

defineEmits<TEmits>();

const { t } = useI18n();

const valor = defineModel<unknown>('valor', { required: true });

const label = computed(() => t('messages.value'));

const rulesList: readonly never[] = [];

const valorNumerico = computed<number | null | undefined>({
  get: () => {
    if (valor.value === '' || valor.value === null || valor.value === undefined) return null;
    const numero = Number(valor.value);
    return Number.isNaN(numero) ? null : numero;
  },
  set: (pNovoValor: number | null | undefined) => {
    valor.value = pNovoValor;
  },
});

const valorTexto = computed<string>({
  get: () => {
    if (valor.value === null || valor.value === undefined) return '';
    return String(valor.value);
  },
  set: (pNovoValor: string) => {
    valor.value = pNovoValor;
  },
});
</script>
