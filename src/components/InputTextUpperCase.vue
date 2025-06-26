<template>
  <v-textarea ref="inputRef" v-bind="$attrs" :model-value="localValue" @input="handleInput" :density="style.density"
    :variant="style.inputVariant" :label="style.label" clearable :style="dynamicStyle" :rules="rules"
    :disabled="style.inputDisabled" :counter="style.counter">
    <template #prepend-inner>
      <div v-if="style.showPrepend">
        <v-btn icon :disabled="style.btnDisabled" :density="style.density" :variant="style.btnVariant"
          @click="emit('on-prepend-click')">
          <v-icon>{{ style.icon }}</v-icon>
        </v-btn>
      </div>
    </template>
  </v-textarea>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import type { ValidationRule } from 'vuetify'

interface Props {
  modelValue: string
  style: {
    icon?: string | 'mdi-magnify'
    density?: 'default' | 'compact' | 'comfortable'
    inputDisabled?: boolean | false
    btnDisabled?: boolean | false
    inputVariant?: "filled" | "outlined" | "plain" | "solo" | "solo-filled" | "solo-inverted" | "underlined"
    btnVariant?: "flat" | "text" | "elevated" | "tonal" | "outlined" | "plain" | undefined
    label?: string | ''
    hint?: string | ''
    hideDetails?: boolean | "auto"
    counter?: string | number | true
    showPrepend?: boolean | true
    maxWidth?: number
  }
  rules?: ValidationRule[] | undefined
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'on-prepend-click'): void
}>()

// Referência do input real para manipular cursor
const inputRef = ref()

// Valor local convertido para uppercase
const localValue = ref((props.modelValue ?? '').toUpperCase())

// Sincroniza localValue quando a prop externa muda
watch(() => props.modelValue, (newVal) => {
  localValue.value = (newVal ?? '').toUpperCase()
})

// Computed para o style informando o tamanho máximo do input
const dynamicStyle = computed(() => {
  return {
    maxWidth: props.style.maxWidth ? `${props.style.maxWidth}px` : '300px'
  }
})

// Emite o valor convertido
function handleInput(event: Event) {
  const target = event.target as HTMLInputElement

  const original = target.value
  const transformed = original.toUpperCase()

  // Salva a posição do cursor ANTES da transformação
  const selectionStart = target.selectionStart
  const offset = transformed.length - original.length

  localValue.value = transformed
  emit('update:modelValue', transformed)

  // Aguarda o DOM atualizar e restaura o cursor manualmente
  nextTick(() => {
    const inputEl = inputRef.value?.$el.querySelector('textarea') as HTMLTextAreaElement
    if (inputEl && selectionStart != null) {
      const newPos = selectionStart + offset
      inputEl.setSelectionRange(newPos, newPos)
    }
  })
}

</script>
