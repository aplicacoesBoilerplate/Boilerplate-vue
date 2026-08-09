<template>
  <BaseDialog
    v-model:exibirDialog="dialogLicenceOpen"
    :maxWidth="400"
    :titulo="t('tooltips.appBar.licence')"
  >
    <template #activator="{ props: dialogProps }">
      <v-tooltip
        :text="t('tooltips.appBar.licence')"
        location="bottom"
      >
        <template #activator="{ props: tooltipProps }">
          <v-btn
            v-bind="mergeProps(dialogProps, tooltipProps)"
            class="mx-1"
            variant="text"
            icon="mdi-license"
            size="small"
          />
        </template>
      </v-tooltip>
    </template>

    <template #title>
      <v-icon
        icon="mdi-information-variant-circle-outline"
        size="small"
      />
      {{ t('app.cardInfoLicence') }}
    </template>

    <template #content>
      <v-list density="compact">
        <v-list-item
          :title="t('app.version') + ': ' + systemVersion"
          :subtitle="t('app.updateDate') + ': ' + formattedVersionDate"
        >
          <template #prepend>
            <v-icon
              icon="mdi-code-block-tags"
              size="x-large"
              class="mr-3"
              color="info"
            />
          </template>
        </v-list-item>

        <v-list-item
          :title="t('app.software')"
          :subtitle="t('app.title')"
        >
          <template #prepend>
            <v-icon
              icon="mdi-license"
              size="x-large"
              class="mr-3"
              color="warning"
            />
          </template>
        </v-list-item>
      </v-list>
    </template>

    <template #actions="{ onFechar }">
      <v-btn
        color="primary"
        variant="tonal"
        text="Fechar"
        class="ml-auto"
        @click="onFechar"
      />
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed, mergeProps } from 'vue';
import { useI18n } from 'vue-i18n';

// Formatação
import { CFormatters } from '@/classes/Utils/CFormatters.ts';

// Constantes
import pkg from '../../../package.json';
// Componentes
import BaseDialog from './base/BaseDialog.vue';

// Composables
const { t } = useI18n();

// Reativas
const dialogLicenceOpen = defineModel<boolean>('dialogLicenceOpen', { required: true });

// Computadas
const formattedVersionDate = computed(() => {
  return CFormatters.formatarDataHora(APP_BUILD_DATE, true);
});

const systemVersion = computed(() => pkg.version);
</script>
