<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navigation from './components/Navigation.vue';
import DialogSearch from './components/dialogSearch/DialogSearch.vue'
</script>

<template>
  <v-app theme="dark">
    <Navigation />
    <DialogSearch />
    <v-main>
      <v-container class="py-8">
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>
