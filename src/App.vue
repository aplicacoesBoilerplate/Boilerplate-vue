<script setup lang="ts">
// Componentes
import Navigation from './components/Navigation.vue';

// Vue
import { RouterView, useRoute } from 'vue-router'

const route = useRoute();
</script>

<template>
  <v-app theme="dark">
    <template v-if="route.path !== '/' && route.path !== '/register'">
      <Navigation />
    </template>
    <v-main v-if="route.path == '/' || route.path == '/register'">
      <v-container>
        <RouterView />
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
