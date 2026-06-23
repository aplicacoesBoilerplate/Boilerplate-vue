<template>
  <Navigation v-model="drawerOpen" />
  <AppBar @toggleDrawer="toggleDrawer" />

  <v-main class="h-100 overflow-y-auto">
    <Breadcrumbs />
    <v-container
      class="pt-2"
      fluid
    >
      <RouterView />
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { ref } from "vue";
import { RouterView } from "vue-router";

// Componentes
import Navigation from "@/components/layouts/base/Navigation.vue";
import AppBar from "@/components/layouts/base/AppBar.vue";
import Breadcrumbs from "@/components/layouts/base/Breadcrumbs.vue";

// Reativas
const drawerOpen = ref<boolean | null>(null);

// Funções
function toggleDrawer() {
  drawerOpen.value = !drawerOpen.value;
}
</script>
