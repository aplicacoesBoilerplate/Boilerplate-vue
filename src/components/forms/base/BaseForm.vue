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
// Ecossistema vue
import { nextTick, ref, watch } from "vue";

type TEmits = {
  onSubmit: [];
  onInvalid: [errors: any[]];
  "update:isValid": [isValid: boolean];
};
const emits = defineEmits<TEmits>();

// Reativas
const formRef = ref<any>(null);
const isFormValid = ref(false);

// Funções
async function handleOnSubmit() {
  const { valid, errors } = await formRef.value.validate();
  if (valid) emits("onSubmit");
  else emits("onInvalid", errors);
}

// Observadores
watch(isFormValid, (novoValor) => {
  emits("update:isValid", novoValor);
});

// Expose
defineExpose({
  resetValidation: async () => {
    await nextTick();
    formRef.value?.resetValidation();
  },
  submit: handleOnSubmit,
  isValid: () => isFormValid.value,
});
</script>
