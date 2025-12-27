<template>
  <v-form @submit.prevent="onSubmit" class="search-form w-100">
    <v-text-field
      ref="inputRef"
      v-model="model"
      class="rounded-search"
      hide-details
      single-line
      clearable
      rounded="pill"
      density="compact"
      variant="solo"
      loader-height="2"
      :loading="loading"
      placeholder="Buscar..."
      :rules="[rules.required()]"
    >
      <template #prepend-inner v-if="mdAndUp">
        <v-hotkey keys="ctrl+k" display-mode="icon" variant="contained" platform="auto" class="mr-2"/>
      </template>

      <template #append-inner>
        <v-icon-btn icon="mdi-magnify" variant="plain" @click="onSubmit" />
      </template>
    </v-text-field>
  </v-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useHotkey, useDisplay } from 'vuetify'
import { useRules } from 'vuetify/labs/rules'

const rules = useRules()
const { mdAndUp } = useDisplay();
const props = defineProps<{ loading: boolean }>()
const emits = defineEmits(['search'])

const model = ref('')
const inputRef = ref<any>(null)

useHotkey('ctrl+k', () => {
  inputRef.value?.focus()
})

function onSubmit() {
  if (!model.value) return
  emits('search', model.value)
}
</script>

<style scoped>
.search-form {
  max-width: 480px;
}
.rounded-search :deep(.v-field) {
  overflow: hidden;
}
</style>
