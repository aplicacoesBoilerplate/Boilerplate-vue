<template>
  <v-form
    ref="formRef"
    v-model="vuetifyFormValid"
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
import { computed, nextTick, ref } from 'vue';

import type { VForm } from 'vuetify/components';

export interface IBaseFormExpose<TModel = unknown> {
  refreshForm: (criarObjetoModel: (pData?: TModel) => TModel) => Promise<void>;
  submit: () => void;
  isValid: () => boolean;
}

type TEmits = {
  onSubmit: [];
  onInvalid: [errors: unknown[]];
};
const emits = defineEmits<TEmits>();

const formModel = defineModel<unknown>('formModel', { default: undefined });
const isFormValid = defineModel<boolean>('isValid', { default: false });
const vuetifyFormValid = computed<boolean | null>({
  get: () => isFormValid.value,
  set: (pValor) => {
    isFormValid.value = pValor === true;
  },
});

const formRef = ref<VForm | null>(null);

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

defineExpose({
  refreshForm,
  submit: handleOnSubmit,
  isValid: () => isFormValid.value === true,
} satisfies IBaseFormExpose);
</script>
