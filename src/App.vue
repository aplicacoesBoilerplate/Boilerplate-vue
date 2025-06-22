<script setup lang="ts">
// Componentes
import SnackbarNotifications from '@/components/Snackbar.vue';
import Navigation from './components/Navigation.vue';

// Vue
import { RouterView, useRoute } from 'vue-router'

const route = useRoute();
</script>

<template>
  <v-app theme="dark">
    <SnackbarNotifications />
    <Navigation v-if="route.path !== '/' && route.path !== '/register'" />

    <v-main>
      <v-container>
        <RouterView v-if="route.path == '/' || route.path == '/register'" />
        <!-- v-if acima evita duplicidade na exibição dos componentes -->
      </v-container>
    </v-main>
  </v-app>
</template>

<style global>
html,
v-main {
  height: 100vh;
  margin: 0;
  padding: 0;
}
</style>
