<template>
  <div class="pb-2 custom-button-wrapper" @mouseenter="hover = true" @mouseleave="hover = false">
    <span v-if="label && labelLeft" class="button-label" :class="{ visible: hover }">{{ label }}</span>
    <v-btn icon @click="executarCallback" class="animated-btn " :size="size" :variant="variant || 'tonal'">
      <v-icon :class="{ rotate: hover }" color="white">{{ icon || 'mdi-plus-circle-outline' }}</v-icon>
    </v-btn>
    <span v-if="label && labelLeft == false" class="button-label" :class="{ visible: hover }">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
// Vue
import { ref } from 'vue'

// Props
const props = defineProps<{
  callback: () => void | Promise<void>,
  label?: string,
  labelLeft?: boolean,
  icon?: string,
  size?: string,
  variant?: "flat" | "text" | "elevated" | "tonal" | "outlined" | "plain" | undefined
}>()

const hover = ref(false)

async function executarCallback() {
  if (typeof props.callback === 'function') {
    await props.callback()
  }
}

</script>
