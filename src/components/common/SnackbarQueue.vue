<template>
  <v-snackbar-queue v-model="messages">
    <template #actions="{ props, item }">
      <v-btn
        v-if="(item as any).actionUrl"
        v-tooltip="'Abrir link externo'"
        :href="(item as any).actionUrl"
        v-bind="props"
        class="text-none font-weight-bold mr-2"
        target="_blank"
        color="orange"
        size="small"
        variant="tonal"
        icon="mdi-open-in-new"
      />
      <v-btn
        v-bind="props"
        icon="mdi-close-circle"
      />
    </template>
  </v-snackbar-queue>
</template>

<script setup lang="ts">
// Pinia
import { storeToRefs } from 'pinia';

// Store
import { useSnackbarStore } from '@/stores/Snackbar.store';

const snackbarStore = useSnackbarStore();
const { messages } = storeToRefs(snackbarStore);
</script>
