<template>
  <v-tooltip
    :text="t('tooltips.appBar.info')"
    location="bottom"
  >
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        class="mx-1"
        color="teal"
        variant="text"
        icon="mdi-information"
        size="small"
        @click="redirectToInfoSystem"
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
function redirectToInfoSystem() {
  router.push({ name: 'InformacoesSistema' });
}
</script>
