<template>
  <v-snackbar absolute v-model="snackbar.visible" :color="snackbar.color" :timeout="snackbarTimeout" class="py-15"
    location="top right" variant="elevated" rounded multi-line>
    {{ snackbar.message }}

    <template #actions>
      <v-btn color="white" variant="text" @click="snackbar.hideSnackbar()">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>

    <v-progress-linear :model-value="progress" height="4" color="white" absolute bottom />
  </v-snackbar>
</template>

<script setup lang="ts">
import { useSnackbarStore } from '@/stores/SnackbarStore'
import { ref, watch, onBeforeUnmount } from 'vue'

const snackbar = useSnackbarStore()
const snackbarTimeout = 4000
const progress = ref(100)
const intervalStep = 50 // intervalo entre atualizações
let intervalId: number | null = null

function clearProgress() {
  if (intervalId !== null) {
    clearInterval(intervalId)
    intervalId = null
  }
}

function startProgress() {
  clearProgress()
  let elapsed = 0
  progress.value = 100

  intervalId = setInterval(() => {
    elapsed += intervalStep
    progress.value = 100 - (elapsed / snackbarTimeout) * 100

    if (elapsed >= snackbarTimeout) {
      clearProgress()
    }
  }, intervalStep)
}

// Observa apenas a propriedade `visible` da snackbar
watch(() => snackbar.visible, (visible) => {
  if (visible) {
    startProgress()
  } else {
    clearProgress()
    progress.value = 100
  }
})

onBeforeUnmount(() => {
  clearProgress()
})
</script>
