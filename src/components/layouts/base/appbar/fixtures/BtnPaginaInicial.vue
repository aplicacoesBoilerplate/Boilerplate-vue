<template>
  <v-tooltip
    :text="t('routes.home.title')"
    location="bottom"
  >
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        class="mx-1"
        color="teal"
        variant="text"
        icon="mdi-home"
        size="small"
        @click="redirectToHome"
      />
    </template>
  </v-tooltip>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

// Composables
const router = useRouter();
const { t } = useI18n();

// Funções
function redirectToHome() {
  router.push({ name: 'Inicio' });
}
</script>
