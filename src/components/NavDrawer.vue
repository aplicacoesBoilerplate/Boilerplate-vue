<template>
  <v-navigation-drawer v-model="modelValue" app>

  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  collapse: boolean
}>()

const emit = defineEmits<{
  (e: 'update:collapse', value: boolean): void
}>()

const modelValue = computed({
  get: () => props.collapse,
  set: value => emit('update:collapse', value)
})

</script>
