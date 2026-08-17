<template>
  <v-row class="mt-1 align-center"
  >
    <v-col
      cols="12"
      md="6"
    >
      <v-number-input
        v-if="htmlType === 'number'"
        v-model="valorInicialNumerico"
        :type="htmlType"
        :label="t('messages.from')"
        controlVariant="stacked"
        variant="outlined"
        density="compact"
        autocomplete="off"
        hideDetails
        @keypress.enter="$emit('onEnter')"
      />

      <v-text-field
        v-else
        v-model="valorInicialTexto"
        :type="htmlType"
        :label="t('messages.from')"
        variant="outlined"
        density="compact"
        autocomplete="off"
        hideDetails
        @keypress.enter="$emit('onEnter')"
      />
    </v-col>

    <v-col
      cols="12"
      md="6"
    >
      <v-number-input
        v-if="htmlType === 'number'"
        v-model="valorFinalNumerico"
        :type="htmlType"
        :label="t('messages.until')"
        controlVariant="stacked"
        variant="outlined"
        density="compact"
        autocomplete="off"
        hideDetails
        @keypress.enter="$emit('onEnter')"
      />

      <v-text-field
        v-else
        v-model="valorFinalTexto"
        :type="htmlType"
        :label="t('messages.until')"
        variant="outlined"
        density="compact"
        autocomplete="off"
        hideDetails
        @keypress.enter="$emit('onEnter')"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

type TProps = {
  htmlType: string;
};

const props = defineProps<TProps>();

type TEmits = {
  onEnter: [];
};

defineEmits<TEmits>();

const { t } = useI18n();

const valor = defineModel<unknown>('valor', { required: true });

function obterValor(pIndice: 0 | 1): unknown {
  if (Array.isArray(valor.value)) return valor.value[pIndice] ?? criarInicial();
  return criarInicial();
}

function definirValor(pIndice: 0 | 1, pNovoValor: unknown): void {
  const atual = Array.isArray(valor.value) ? [...valor.value] : [criarInicial(), criarInicial()];
  atual[pIndice] = pNovoValor;
  valor.value = atual;
}

function criarInicial(): string | null {
  return props.htmlType === 'number' ? null : '';
}

const valorInicialNumerico = computed<number | null | undefined>({
  get: () => {
    const v = obterValor(0);
    if (v === '' || v === null || v === undefined) return null;
    const numero = Number(v);
    return Number.isNaN(numero) ? null : numero;
  },
  set: (pNovoValor: number | null | undefined) => {
    definirValor(0, pNovoValor);
  },
});

const valorFinalNumerico = computed<number | null | undefined>({
  get: () => {
    const v = obterValor(1);
    if (v === '' || v === null || v === undefined) return null;
    const numero = Number(v);
    return Number.isNaN(numero) ? null : numero;
  },
  set: (pNovoValor: number | null | undefined) => {
    definirValor(1, pNovoValor);
  },
});

const valorInicialTexto = computed<string>({
  get: () => String(obterValor(0) ?? ''),
  set: (pNovoValor: string) => {
    definirValor(0, pNovoValor);
  },
});

const valorFinalTexto = computed<string>({
  get: () => String(obterValor(1) ?? ''),
  set: (pNovoValor: string) => {
    definirValor(1, pNovoValor);
  },
});
</script>
