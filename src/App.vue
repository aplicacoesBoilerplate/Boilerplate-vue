<template>
  <v-app>
    <Snackbar />

    <Navigation v-if="isLayoutVisible" v-model="drawerOpen" />
    <AppBar v-if="isLayoutVisible" @toggle-drawer="toggleDrawer" />

    <v-main class="main-scroll">
      <Breadcrumbs v-if="isLayoutVisible" />

      <v-container fluid class="pt-2">
        <BtnFabOtherTemplate v-if="!isLayoutVisible" />
        <RouterView />
      </v-container>
    </v-main>

  </v-app>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue';
import { useRoute } from 'vue-router';
import Snackbar from '@/components/Snackbar.vue';
import AppBar from './components/layouts/base/AppBar.vue';
import Navigation from './components/layouts/base/Navigation.vue';
import Breadcrumbs from './components/layouts/base/Breadcrumbs.vue';
import { useI18n } from 'vue-i18n';
import BtnFabOtherTemplate from './components/layouts/BtnFabOtherTemplate.vue';

const { t, locale } = useI18n();

const route = useRoute();

watch(
  [() => route.meta.title, locale],
  () => {
    const defaultTitle = t('app.title');
    const routeTitle = route.meta.title as string;

    if (routeTitle) {
      document.title = `${t(routeTitle)} - ${defaultTitle}`;
    } else {
      document.title = defaultTitle;
    }
  },
  { immediate: true }
);

const isLayoutVisible = computed(() => {
  return route.meta.hidden !== true;
});

const drawerOpen = ref<boolean | null>(null)

function toggleDrawer() {
  drawerOpen.value = !drawerOpen.value
}
</script>

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
