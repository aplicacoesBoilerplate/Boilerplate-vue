<template>
  <v-text-field
    ref="inputRef"
    v-bind="$attrs"
    :modelValue="localValue"
    :density="style.density"
    :variant="style.inputVariant"
    :label="style.label"
    :hint="style.hint"
    :hideDetails="style.hideDetails"
    :counter="style.counter"
    :style="dynamicStyle"
    :rules="rules"
    :disabled="style.inputDisabled"
    clearable
    @input="handleInput"
  >
    <template #prepend-inner>
      <div v-if="style.showPrepend">
        <v-btn
          :disabled="style.btnDisabled"
          :variant="style.btnVariant"
          size="small"
          icon
          @click="emit('on-prepend-click')"
        >
          <v-icon>{{ style.icon }}</v-icon>
        </v-btn>
      </div>
    </template>
    <template #append-inner>
      <!-- Loading -->
      <div
        v-if="style.showLoading"
        class="d-flex justify-center"
      >
        <v-progress-circular
          color="primary"
          indeterminate
        />
      </div>
    </template>
  </v-text-field>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';

import type { ValidationRule } from 'vuetify';

interface IProps {
  modelValue?: string | null;
  style: {
    icon?: string | 'mdi-magnify';
    density?: 'default' | 'compact' | 'comfortable';
    inputDisabled?: boolean | false;
    btnDisabled?: boolean | false;
    inputVariant?: 'filled' | 'outlined' | 'plain' | 'solo' | 'solo-filled' | 'solo-inverted' | 'underlined';
    btnVariant?: 'flat' | 'text' | 'elevated' | 'tonal' | 'outlined' | 'plain' | undefined;
    label?: string | '';
    hint?: string | '';
    hideDetails?: boolean | 'auto';
    counter?: string | number | true;
    showPrepend?: boolean | true;
    showLoading?: boolean | false;
    maxWidth?: number;
  };
  rules?: ValidationRule[] | undefined;
}

const props = defineProps<IProps>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'on-prepend-click'): void;
}>();

// Referência do input real para manipular cursor
const inputRef = ref();

// Valor local do input
const localValue = ref((props.modelValue ?? '').toUpperCase());

// Atualiza localValue quando a prop externa muda (ex: ao vir de uma requisição)
watch(
  () => props.modelValue,
  (pNovoValor) => {
    localValue.value = (pNovoValor ?? '').toUpperCase();
  },
);

// Computed para o style informando o tamanho máximo do input
const dynamicStyle = computed(() => {
  return {
    maxWidth: props.style.maxWidth ? `${props.style.maxWidth}px` : '300px',
  };
});

// Emite valor em uppercase sempre que o input for alterado
function handleInput(pEvent: Event) {
  const target = pEvent.target as HTMLInputElement;

  const original = target.value;
  const transformed = original.toUpperCase();

  // Salva a posição do cursor ANTES da transformação
  const selectionStart = target.selectionStart;
  const offset = transformed.length - original.length;

  localValue.value = transformed;
  emit('update:modelValue', transformed);

  // Aguarda o DOM atualizar e restaura o cursor manualmente
  nextTick(() => {
    const inputEl = inputRef.value?.$el.querySelector('input') as HTMLInputElement;
    if (inputEl && selectionStart != null) {
      const newPos = selectionStart + offset;
      inputEl.setSelectionRange(newPos, newPos);
    }
  });
}
</script>
