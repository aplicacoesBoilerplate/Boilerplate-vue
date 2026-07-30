<template>
  <v-app-bar
    border="b"
    app
    flat
  >
    <v-app-bar-nav-icon
      v-tooltip="t('tooltips.appBar.menu')"
      @click="toggleDrawer"
    />

    <v-app-bar-title class="font-weight-bold">
      {{ t('app.title') }}
    </v-app-bar-title>

    <template v-if="mdAndUp">
      <v-spacer />
      <div style="width: 100%; max-width: 480px">
        <AppBarSearchForm
          :loading="loading"
          @search="handleSearch"
        />
      </div>
      <v-spacer />
    </template>

    <template
      v-if="smAndDown"
      #extension
    >
      <div class="px-4 pb-2 w-100">
        <AppBarSearchForm
          :loading="loading"
          @search="handleSearch"
        />
      </div>
    </template>

    <template #append>
      <MenuOptionsDrawer v-model:dialogLicenceOpen="dialogLicenceOpen" />
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDisplay } from 'vuetify';

// Stores
import { usePreferencesStore } from '@/stores/preferences.store';

// Types e Interfaces
import type { TParametrosBusca } from '@/models/filters/TParametrosBusca.ts';

// Componentes
import AppBarSearchForm from '@/components/forms/AppBarSearchForm.vue';

import MenuOptionsDrawer from './fixtures/MenuOptionsDrawer.vue';

// Stores
const preferencesStore = usePreferencesStore();

// Composables
const { smAndDown, mdAndUp } = useDisplay();
const { t } = useI18n();

// Reativas
const loading = ref(false);
const dialogLicenceOpen = ref(false);

// Funções
function toggleDrawer() {
  preferencesStore.setDesktopDrawerVisible(!preferencesStore.preferences.drawer.isDesktopDrawerVisible);
}

function handleSearch(pParams: TParametrosBusca) {
  loading.value = true;
  setTimeout(() => (loading.value = false), 2000);
}
</script>
