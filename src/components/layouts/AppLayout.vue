<template>
  <NavigationDrawer />
  <AppBar />
  <v-main class="h-100 overflow-y-auto bg-background">
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
import { RouterView } from 'vue-router';

import AppBar from '@/components/layouts/base/appbar/AppBar.vue';
import Breadcrumbs from '@/components/layouts/base/Breadcrumbs.vue';
// Componentes
import NavigationDrawer from '@/components/layouts/base/navigation/NavigationDrawer.vue';
</script>
