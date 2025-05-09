<template>
  <v-snackbar v-model="snackbar.visible" :color="snackbar.color" :timeout="snackbarTimeout" :location="'top right'"
    variant="outlined" rounded multi-line>
    {{ snackbar.message }}
    <template #actions>
      <v-btn color="white" variant="text" @click="snackbar.hideSnackbar()"><v-icon>mdi-close</v-icon></v-btn>
    </template>
    <v-progress-linear :model-value="progress" height="4" :color="snackbar.color" absolute bottom />
  </v-snackbar>
</template>

<script setup lang="ts">
import { useSnackbarStore } from '@/components/notifications/notificationsStore'
import { onBeforeUnmount, ref, watch } from 'vue';
const snackbar = useSnackbarStore()
const snackbarTimeout = 4000
const progress = ref(100)
let intervalId: number | null = null

watch(snackbar, (newVal) => {
  if (newVal) {
    progress.value = 100
    let timeLeft = snackbarTimeout
    const step = 100

    intervalId = setInterval(() => {
      timeLeft -= step
      progress.value = (timeLeft / snackbarTimeout) * 100

      if (timeLeft <= 0) {
        clearInterval(intervalId!)
      }
    }, step)
  } else {
    if (intervalId !== null) {
      clearInterval(intervalId)
    }
  }
})

onBeforeUnmount(() => {
  if (intervalId !== null) {
    clearInterval(intervalId)
  }
})

</script>
