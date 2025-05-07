<template>
  <v-snackbar v-model="snackbar.visible" :color="snackbar.color" timeout="4000" :location="'top right'"
    variant="outlined">
    {{ snackbar.message }}
    <template #actions>
      <v-btn color="white" variant="text" @click="snackbar.hideSnackbar()"><v-icon>mdi-close</v-icon></v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { useSnackbarStore } from '@/components/notifications/notificationsStore'
const snackbar = useSnackbarStore()

</script>
