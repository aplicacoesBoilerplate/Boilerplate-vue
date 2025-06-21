<template>
  <v-text-field v-bind="$attrs" :model-value="localValue" @update:model-value="handleUpdate" :density="style.density"
    :variant="style.inputVariant" :label="style.label" :hint="style.hint" :hide-details="style.hideDetails"
    :counter="style.counter" clearable :style="dynamicStyle" :rules="rules" :disabled="style.inputDisabled">
    <template #prepend-inner>
      <div v-if="style.showPrepend">
        <v-btn icon :disabled="style.btnDisabled" :variant="style.btnVariant" size="small"
          @click="emit('on-prepend-click')">
          <v-icon>{{ style.icon }}</v-icon>
        </v-btn>
      </div>
    </template>
    <template #append-inner>
      <!-- Loading -->
      <div class="d-flex justify-center" v-if="style.showLoading">
        <v-progress-circular color="primary" indeterminate />
      </div>
    </template>
  </v-text-field>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { ValidationRule } from 'vuetify'

interface Props {
  modelValue?: string | null
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
    showLoading?: boolean | false
    maxWidth?: number
  }
  rules?: ValidationRule[] | undefined
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'on-prepend-click'): void
}>()

// Valor local do input
const localValue = ref((props.modelValue ?? '').toUpperCase())

// Atualiza localValue quando a prop externa muda (ex: ao vir de uma requisição)
watch(() => props.modelValue, (newVal) => {
  localValue.value = (newVal ?? '').toUpperCase()
})

// Computed para o style informando o tamanho máximo do input
const dynamicStyle = computed(() => {
  return {
    maxWidth: props.style.maxWidth ? `${props.style.maxWidth}px` : '300px'
  }
})

// Emite valor em uppercase sempre que o input for alterado
function handleUpdate(value: string | null) {
  const upper = (value ?? '').toUpperCase()
  localValue.value = upper
  emit('update:modelValue', upper)
}
</script>
