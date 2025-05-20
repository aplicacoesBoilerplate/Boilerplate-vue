<template>
  <div class="pb-2 custom-button-wrapper" @mouseenter="hover = true" @mouseleave="hover = false">
    <v-btn icon @click="executarCallback" class="animated-btn">
      <v-icon :class="{ rotate: hover }" color="white">mdi-plus-circle-outline</v-icon>
    </v-btn>
    <span class="button-label" :class="{ visible: hover }">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
// Vue
import { ref } from 'vue'

// Props
const props = defineProps<{
  callback: () => void | Promise<void>,
  label: string
}>()

const hover = ref(false)

async function executarCallback() {
  if (typeof props.callback === 'function') {
    await props.callback()
  }
}
</script>
