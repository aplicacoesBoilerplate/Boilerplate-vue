<script setup lang="ts">
  import { computed, ref } from 'vue';
import { useDisplay } from 'vuetify';
import { useRoute } from 'vue-router';
import Snackbar from '@/components/Snackbar.vue';
import AppBar from './components/layouts/base/AppBar.vue';
import Navigation from './components/layouts/base/Navigation.vue';
import Breadcrumbs from './components/layouts/base/Breadcrumbs.vue';

const route = useRoute();
const isLayoutVisible = computed(() => {
  return route.name !== 'Login' && route.meta.hidden !== true;
});

const drawerOpen = ref<boolean | null>(null)

function toggleDrawer() {
  drawerOpen.value = !drawerOpen.value
}
</script>

<template>
  <v-app>
    <Snackbar />

    <Navigation v-if="isLayoutVisible" v-model="drawerOpen" />
    <AppBar v-if="isLayoutVisible" @toggle-drawer="toggleDrawer" />

    <v-main class="main-scroll">
      <Breadcrumbs v-if="isLayoutVisible" />

      <v-container fluid class="pt-2">
        <RouterView />
      </v-container>
    </v-main>

  </v-app>
</template>

<style global>
html,
v-main {
  margin: 0;
  padding: 0;
}

.main-scroll {
  height: calc(100vh - var(--v-layout-top));
  overflow-y: auto;
}

</style>
