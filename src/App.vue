<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Snackbar from '@/components/Snackbar.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import Navigation from '@/components/Navigation.vue';

const route = useRoute();

const isLayoutVisible = computed(() => {
  return route.name !== 'Login' && route.meta.hidden !== true;
});
</script>

<template>
  <v-app theme="dark">
    <Navigation v-if="isLayoutVisible" />

    <Snackbar />

    <v-main>
      <v-container>
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
