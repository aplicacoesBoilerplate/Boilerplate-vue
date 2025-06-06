<template>
  <v-text-field v-bind="$attrs" :v-model="modelValue" @update:model-value="handleUpdate" :density="style.density"
    :variant="style.inputVariant" :label="style.label" clearable>

    <template #prepend-inner>
      <div v-if="style.showPrepend">
        <v-btn icon :disabled="style.disabled" :density="style.density" :variant="style.btnVariant"
          @click="emit('on-prepend-click')">
          <v-icon>{{ style.icon }}</v-icon>
        </v-btn>
      </div>
    </template>
  </v-text-field>
</template>

<script setup lang="ts">

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

function handleUpdate(value: string | null) {
  emit('update:modelValue', (value ?? '').toUpperCase())
}

</script>
