<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import Navigation from './components/Navigation.vue';
import DialogSearch from './components/dialog/dialogSearch/DialogSearch.vue'
import DialogConfirmarSenha from './components/dialog/dialogConfirmaSenha/DialogConfirmarSenha.vue';

const route = useRoute();

</script>

<template>
  <v-app theme="dark">
    <template v-if="route.path !== '/'">
      <!-- && route.path !== '/register' -->
      <Navigation />
      <DialogSearch />
      <DialogConfirmarSenha />
    </template>
    <v-main v-if="route.path == '/'">
      <v-container class="py-8">
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>
