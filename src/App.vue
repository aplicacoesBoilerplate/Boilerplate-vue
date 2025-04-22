<script setup lang="ts">
import { useRoute } from 'vue-router'
import Navigation from './components/Navigation.vue';
import DialogSearch from './components/dialogSearch/DialogSearch.vue'

const route = useRoute();
</script>

<template>
  <v-app theme="dark">
    <template v-if="route.path !== '/'">
      <!-- && route.path !== '/register' -->
      <Navigation />
      <DialogSearch />
    </template>
  </v-app>
</template>
