<template>
  <v-tabs
    v-model="abaAtual"
    color="primary"
    density="compact"
  >
    <v-tab
      value="dados"
      rounded="ts-xl be-xl"
    >
      <v-icon
        icon="mdi-card-account-details-outline"
        start
      />
      {{ t('common.rbacTabs.data') }}
    </v-tab>
    <v-tab
      value="permissoes"
      rounded="ts-xl be-xl"
    >
      <v-icon
        icon="mdi-shield-key-outline"
        start
      />
      {{ t('common.rbacTabs.permissions') }}
    </v-tab>
    <v-tab
      value="usuarios"
      rounded="ts-xl be-xl"
    >
      <v-icon
        icon="mdi-account-switch-outline"
        start
      />
      {{ t('common.rbacTabs.users') }}
    </v-tab>
  </v-tabs>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

export type TAbas = 'dados' | 'permissoes' | 'usuarios';
const abaAtual = defineModel<TAbas>('abaAtual', { required: true, default: 'dados' });
const { t } = useI18n();
</script>
