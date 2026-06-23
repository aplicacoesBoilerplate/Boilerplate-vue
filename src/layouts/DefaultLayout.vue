<template>
  <v-main>
    <v-container
      class="pt-2 fill-height"
      fluid
    >
      <BtnFabOtherTemplate />
      <RouterView />
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { RouterView } from 'vue-router';

// Componentes
import BtnFabOtherTemplate from '@/components/layouts/BtnFabOtherTemplate.vue';
</script>
