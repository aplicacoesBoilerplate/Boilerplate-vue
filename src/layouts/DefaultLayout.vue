<template>
  <v-main>
    <MenuOptionsDrawer
      :hasDialogLicence="false"
      top="24px"
      right="16px"
      width="160px"
      absolute
    />
    <v-container
      class="pt-2 fill-height"
      fluid
    >
      <RouterView />
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { RouterView } from 'vue-router';

// Componentes
import MenuOptionsDrawer from '@/components/layouts/base/appbar/fixtures/MenuOptionsDrawer.vue';
</script>
