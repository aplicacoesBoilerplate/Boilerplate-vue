<template>
  <v-row density="comfortable">
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

// Dados locais
import packageJson from '../../../package.json';

const cardsInformacoesSistema = computed(() => [
  {
    titulo: 'Frontend',
    icone: 'mdi-vuejs',
    descricao: `Vue ${packageJson.dependencies.vue}, Vuetify ${packageJson.dependencies.vuetify} e TypeScript ${packageJson.devDependencies.typescript}.`,
  },
  {
    titulo: 'PWA',
    icone: 'mdi-cellphone-link',
    descricao: 'Aplicação preparada para instalação, service worker e experiência responsiva em dispositivos móveis.',
  },
  {
    titulo: 'Boilerplate',
    icone: 'mdi-package-variant-closed',
    descricao: 'Base com autenticação visual, filtros globais, RBAC, listas genéricas, exportação e componentes reutilizáveis.',
  },
]);
</script>
