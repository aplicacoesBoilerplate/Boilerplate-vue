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
import { computed, nextTick, ref, toRaw, watch } from 'vue';

import type { VForm } from 'vuetify/components';

import { deepClone } from '@/utils/deepClone';

export interface IBaseFormExpose<TModel = unknown> {
  refreshForm: (criarObjetoModel: (pData?: TModel) => TModel) => Promise<void>;
  registrarModeloInicial: () => void;
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
const isFormDirty = defineModel<boolean>('isDirty', { default: false });
const vuetifyFormValid = computed<boolean | null>({
  get: () => isFormValid.value,
  set: (pValor) => {
    isFormValid.value = pValor === true;
  },
});

const formRef = ref<VForm | null>(null);
const initialFormModel = ref<unknown>(undefined);
const hasInitialFormModel = ref(false);

function registrarModeloInicial(): void {
  initialFormModel.value = deepClone(toRaw(formModel.value));
  hasInitialFormModel.value = true;
  isFormDirty.value = false;
}

function modeloFoiAlterado(): boolean {
  return JSON.stringify(toRaw(formModel.value)) !== JSON.stringify(initialFormModel.value);
}

async function handleOnSubmit() {
  const lResultado = await formRef.value?.validate();
  const lValido = lResultado?.valid ?? false;
  const lErros = lResultado?.errors ?? [];
  if (lValido) emits('onSubmit');
  else emits('onInvalid', lErros);
}

async function refreshForm(pCriarObjetoModel: (pData?: unknown) => unknown): Promise<void> {
  if (formModel.value !== undefined) {
    formModel.value = pCriarObjetoModel();
  }
  await nextTick();
  formRef.value?.resetValidation();
  registrarModeloInicial();
}

watch(
  formModel,
  () => {
    if (hasInitialFormModel.value) {
      isFormDirty.value = modeloFoiAlterado();
    }
  },
  { deep: true },
);

defineExpose({
  refreshForm,
  registrarModeloInicial,
  submit: handleOnSubmit,
  isValid: () => isFormValid.value === true,
} satisfies IBaseFormExpose);
</script>
