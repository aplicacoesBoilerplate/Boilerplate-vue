<template>
  <v-app>
    <component :is="layoutComponent" />
    <Snackbar />
  </v-app>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed } from 'vue';
import { useRoute } from 'vue-router';

// Componentes
import AppLayout from '@/layouts/AppLayout.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import Snackbar from '@/components/Snackbar.vue';

// Composables
const route = useRoute();

// Computadas
const layoutComponent = computed(() => {
  return route.meta.hidden === true ? DefaultLayout : AppLayout;
});
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}
</style>
