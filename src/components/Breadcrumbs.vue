<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const items = computed(() => {
  const matchedRoutes = route.matched.filter(r => r.meta && r.meta.title);

  const breadcrumbs = matchedRoutes.map((r, index) => ({
    title: r.meta.title as string,
    disabled: index === matchedRoutes.length - 1,
    to: { name: r.name },
    exact: true
  }));

  if (breadcrumbs.length > 0 && breadcrumbs[0].title !== 'Home') {
    breadcrumbs.unshift({
      title: 'Home',
      disabled: false,
      to: { name: 'Home' },
      exact: true
    });
  }

  return breadcrumbs;
});
</script>

<template>
  <v-breadcrumbs
    v-if="items.length > 0"
    :items="items"
    divider="/"
    class="px-0 py-2"
  >
    <template v-slot:title="{ item }">
      {{ item.title }}
    </template>
  </v-breadcrumbs>
</template>
