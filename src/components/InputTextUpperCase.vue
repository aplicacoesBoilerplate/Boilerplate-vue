<template>
  <v-textarea v-bind="$attrs" :model-value="localValue" @update:model-value="handleUpdate" :density="style.density"
    :variant="style.inputVariant" :label="style.label" clearable>
    <template #prepend-inner>
      <div v-if="style.showPrepend">
        <v-btn icon :disabled="style.disabled" :density="style.density" :variant="style.btnVariant"
          @click="emit('on-prepend-click')">
          <v-icon>{{ style.icon }}</v-icon>
        </v-btn>
      </div>
    </template>
  </v-textarea>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue: string
  style: {
    icon?: string | 'mdi-magnify'
    density?: 'default' | 'compact' | 'comfortable'
    disabled?: boolean | false
    inputVariant?: "filled" | "outlined" | "plain" | "solo" | "solo-filled" | "solo-inverted" | "underlined"
    btnVariant?: "flat" | "text" | "elevated" | "tonal" | "outlined" | "plain" | undefined
    label?: string | ''
    showPrepend?: boolean | true
  }
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'on-prepend-click'): void
}>()

// Valor local convertido para uppercase
const localValue = ref((props.modelValue ?? '').toUpperCase())

// Sincroniza localValue quando a prop externa muda
watch(() => props.modelValue, (newVal) => {
  localValue.value = (newVal ?? '').toUpperCase()
})

// Emite o valor convertido
function handleUpdate(value: string | null) {
  const upper = (value ?? '').toUpperCase()
  localValue.value = upper
  emit('update:modelValue', upper)
}
</script>
