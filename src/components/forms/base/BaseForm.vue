<template>
  <v-form
    ref="formRef"
    v-model="isFormValid"
    @submit.prevent="handleOnSubmit"
  >
    <slot></slot>
    <button
      type="submit"
      class="d-none"
    ></button>
  </v-form>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';

import type { VForm } from 'vuetify/components';

export interface IBaseFormExpose<TModel = unknown> {
  refreshForm: (criarObjetoModel: (pData?: TModel) => TModel) => Promise<void>;
  submit: () => void;
  isValid: () => boolean;
}

type TEmits = {
  onSubmit: [];
  onInvalid: [errors: unknown[]];
  'update:isValid': [isValid: boolean];
};
const emits = defineEmits<TEmits>();

const formModel = defineModel<unknown>('formModel', { default: undefined });

const formRef = ref<VForm | null>(null);
const isFormValid = ref(false);

async function handleOnSubmit() {
  const resultado = await formRef.value?.validate();
  const valido = resultado?.valid ?? false;
  const erros = resultado?.errors ?? [];
  if (valido) emits('onSubmit');
  else emits('onInvalid', erros);
}

async function refreshForm(pCriarObjetoModel: (pData?: unknown) => unknown): Promise<void> {
  if (formModel.value !== undefined) {
    formModel.value = pCriarObjetoModel();
  }
  await nextTick();
  formRef.value?.resetValidation();
}

watch(isFormValid, (pNovoValor) => {
  emits('update:isValid', pNovoValor);
});

defineExpose({
  refreshForm,
  submit: handleOnSubmit,
  isValid: () => isFormValid.value,
} satisfies IBaseFormExpose);
</script>
