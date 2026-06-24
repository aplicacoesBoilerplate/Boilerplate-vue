<template>
  <v-app>
    <component :is="layoutComponent" />
    <SnackbarQueue />
  </v-app>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed } from 'vue';
import { useRoute } from 'vue-router';

// Componentes
import AppLayout from '@/layouts/AppLayout.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import SnackbarQueue from './components/SnackbarQueue.vue';

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

/* Oculta scrollbars globalmente */
::-webkit-scrollbar {
  display: none; /* Chrome, Safari e Opera */
}

* {
  -ms-overflow-style: none;  /* IE e Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
