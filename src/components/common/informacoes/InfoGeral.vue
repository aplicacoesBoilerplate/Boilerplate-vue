<template>
  <v-row>
    <v-col
      v-for="item in cardsInformacoesSistema"
      :key="item.titulo"
      cols="12"
      md="4"
    >
      <v-sheet
        class="border rounded pa-4 h-100"
        color="surface"
      >
        <div class="d-flex align-center ga-2 mb-2">
          <v-icon
            :icon="item.icone"
            color="primary"
          />
          <span class="text-subtitle-1 font-weight-bold">{{ item.titulo }}</span>
        </div>

        <div class="text-body-2 text-medium-emphasis">
          {{ item.descricao }}
        </div>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

// Dados locais
import packageJson from '../../../../package.json';

// Composables
const { t } = useI18n();

const cardsInformacoesSistema = computed(() => [
  {
    titulo: t('components.infoGeral.cards.frontend.titulo'),
    icone: 'mdi-vuejs',
    descricao: t('components.infoGeral.cards.frontend.descricao', {
      vue: packageJson.dependencies.vue,
      vuetify: packageJson.dependencies.vuetify,
      typescript: packageJson.devDependencies.typescript,
    }),
  },
  {
    titulo: t('components.infoGeral.cards.pwa.titulo'),
    icone: 'mdi-cellphone-link',
    descricao: t('components.infoGeral.cards.pwa.descricao'),
  },
  {
    titulo: t('components.infoGeral.cards.boilerplate.titulo'),
    icone: 'mdi-package-variant-closed',
    descricao: t('components.infoGeral.cards.boilerplate.descricao'),
  },
]);
</script>
