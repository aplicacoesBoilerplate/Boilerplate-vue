<template>
  <v-app theme="dark">
    <NavBar :collapse="collapseDrawer" @toggle="toggleDrawer" />
    <NavDrawer v-model:collapse="collapseDrawer" />
    <v-main>
      <v-container class="py-8">
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NavBar from '@/components/NavBar.vue'
import NavDrawer from '@/components/NavDrawer.vue'

const collapseDrawer = ref(true)

function toggleDrawer() {
  collapseDrawer.value = !collapseDrawer.value
}
</script>
