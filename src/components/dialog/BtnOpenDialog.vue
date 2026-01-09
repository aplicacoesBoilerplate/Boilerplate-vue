<template>
  <div
    class="animated-icon-wrapper d-flex align-center"
    :class="{ 'flex-row-reverse': labelPosition === 'left' }"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <span
      v-if="label"
      class="button-label text-body-2 font-weight-medium"
      :class="{ 'visible': isHovering }"
    >
      {{ label }}
    </span>
    <v-icon-btn
      :icon="icon"
      :variant="variant"
      v-bind="$attrs"
      class="transition-swing"
      :class="{ 'rotate-icon': isHovering && rotate }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineOptions({
  inheritAttrs: false
})

withDefaults(defineProps<{
  icon?: string
  variant?: "flat" | "plain" | "text" | "elevated" | "outlined" | "tonal" | undefined
  label?: string
  labelPosition?: 'left' | 'right'
  rotate?: boolean
}>(), {
  icon: 'mdi-plus',
  variant: 'flat',
  labelPosition: 'right',
  rotate: true
})

const isHovering = ref(false)
</script>

<style scoped>
.animated-icon-wrapper {
  width: fit-content;
  cursor: pointer;
}

.button-label {
  opacity: 0;
  transform: translateX(10px);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  white-space: nowrap;
  pointer-events: none;
}

.flex-row-reverse .button-label {
  transform: translateX(-10px);
}

.button-label.visible {
  opacity: 1;
  transform: translateX(0);
}

.rotate-icon :deep(.v-icon) {
  transform: rotate(360deg);
  transition: transform 0.8s ease-in-out;
}
</style>
