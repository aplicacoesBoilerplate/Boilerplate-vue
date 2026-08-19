<template>
  <v-col
    cols="12"
    md="3"
  >
    <v-sheet
      class="border rounded pa-4 h-100"
      color="surface"
    >
      <div class="text-overline text-medium-emphasis">
        {{ t('components.resumoVersoes.titulo') }}
      </div>

      <div class="text-h5 font-weight-bold mb-4">
        {{ t('components.resumoVersoes.alteracoes', { quantidade: totalAlteracoes }) }}
      </div>

      <v-list
        class="d-flex flex-column ga-2 pa-0 py-3"
        bgColor="transparent"
        density="compact"
      >
        <v-list-item
          v-tooltip="{ text: t('components.resumoVersoes.tooltipPacote', { versao: versaoAtual }) }"
          class="bg-blue-grey-lighten-4"
          variant="elevated"
          rounded="ts-xl be-xl"
        >
          <template #prepend>
            <v-icon
              icon="mdi-package-variant-closed"
              color="primary"
            />
          </template>

          <v-list-item-title>{{ t('components.resumoVersoes.pacote') }}</v-list-item-title>
          <v-list-item-subtitle>v{{ versaoAtual }}</v-list-item-subtitle>
        </v-list-item>

        <v-list-item
          v-if="versaoMaisRecenteChangelog"
          v-tooltip="{ text: t('components.resumoVersoes.tooltipChangelog', {
            versao: versaoMaisRecenteChangelog.numero,
            data: versaoMaisRecenteChangelog.data,
          }) }"
          class="bg-blue-grey-lighten-4"
          variant="elevated"
          rounded="ts-xl be-xl"
        >
          <template #prepend>
            <v-icon
              icon="mdi-source-branch"
              color="success"
            />
          </template>

          <v-list-item-title>{{ t('components.resumoVersoes.changelog') }}</v-list-item-title>
          <v-list-item-subtitle>
            v{{ versaoMaisRecenteChangelog.numero }} - {{ versaoMaisRecenteChangelog.data }}
          </v-list-item-subtitle>
        </v-list-item>

        <v-list-item
          v-tooltip="{ text: t('components.resumoVersoes.tooltipVersoes', { quantidade: versoes.length }) }"
          class="bg-blue-grey-lighten-4"
          variant="elevated"
          rounded="ts-xl be-xl"        
        >
          <template #prepend>
            <v-icon
              icon="mdi-history"
              color="secondary"
            />
          </template>

          <v-list-item-title>{{ t('components.resumoVersoes.versoes') }}</v-list-item-title>
          <v-list-item-subtitle>
            {{ t('components.resumoVersoes.versoesRegistradas', { quantidade: versoes.length }) }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-sheet>
  </v-col>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { useI18n } from 'vue-i18n';

// Types e Interfaces
import type { TPropsResumoVersoes } from '@/models/components/IVersaoChangelog'
defineProps<TPropsResumoVersoes>();

// Composables
const { t } = useI18n();
</script>
