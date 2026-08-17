<template>
  <v-breadcrumbs
    v-if="items.length > 0"
    :items="items"
    class="bg-background border-b px-4 py-2"
    divider="/"
    style="position: sticky; top: 0; z-index: 10"
  >
    <template #title="{ item }">
      {{ item.title }}
    </template>
  </v-breadcrumbs>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

// Composables
const route = useRoute();
const { t } = useI18n();

// Computadas
const items = computed(() => {
  const matchedRoutes = route.matched.filter((pRoute) => pRoute.meta && pRoute.meta.title);

  const breadcrumbs = matchedRoutes.map((pRoute, pIndex) => ({
    title: t(pRoute.meta.title as string),
    disabled: pIndex === matchedRoutes.length - 1,
    to: { name: pRoute.name },
    exact: true,
  }));

  if (breadcrumbs.length > 0 && breadcrumbs[0].title !== t('routes.home.title')) {
    breadcrumbs.unshift({
      title: t('routes.home.title'),
      disabled: false,
      to: { name: 'Inicio' },
      exact: true,
    });
  }

  return breadcrumbs;
});
</script>
