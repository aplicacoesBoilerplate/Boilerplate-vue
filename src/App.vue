<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue';
import DialogSearch from './components/dialogSearch/DialogSearch.vue'
</script>

<template>
  <v-app>
    <NavBar />
    <DialogSearch />
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>
