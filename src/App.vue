<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Snackbar from '@/components/Snackbar.vue';
import AppBar from './components/layouts/base/AppBar.vue';
import Navigation from './components/layouts/base/Navigation.vue';
import Breadcrumbs from './components/layouts/base/Breadcrumbs.vue';

const route = useRoute();

const isLayoutVisible = computed(() => {
  return route.name !== 'Login' && route.meta.hidden !== true;
});
</script>

<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <Snackbar />
        <Navigation v-if="isLayoutVisible" />
        <AppBar v-if="isLayoutVisible"/>
        <Breadcrumbs v-if="isLayoutVisible" />
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
