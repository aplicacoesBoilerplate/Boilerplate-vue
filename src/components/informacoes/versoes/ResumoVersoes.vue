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
        Resumo
      </div>

      <div class="text-h5 font-weight-bold mb-4">
        {{ totalAlteracoes }} alterações
      </div>

      <v-list
        class="d-flex flex-column ga-2 pa-0 py-3"
        bgColor="transparent"
        density="compact"
      >
        <v-list-item
          v-tooltip="{ text: `Package: v${versaoAtual}` }"
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

          <v-list-item-title>Package</v-list-item-title>
          <v-list-item-subtitle>v{{ versaoAtual }}</v-list-item-subtitle>
        </v-list-item>

        <v-list-item
          v-if="versaoMaisRecenteChangelog"
          v-tooltip="{ text: `Changelog: v${versaoMaisRecenteChangelog.numero} - ${versaoMaisRecenteChangelog.data}` }"
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

          <v-list-item-title>Changelog</v-list-item-title>
          <v-list-item-subtitle>
            v{{ versaoMaisRecenteChangelog.numero }} - {{ versaoMaisRecenteChangelog.data }}
          </v-list-item-subtitle>
        </v-list-item>

        <v-list-item
          v-tooltip="{ text: `Versões: ${versoes.length} registradas` }"
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

          <v-list-item-title>Versões</v-list-item-title>
          <v-list-item-subtitle>{{ versoes.length }} registrada(s)</v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-sheet>
  </v-col>
</template>

<script setup lang="ts">
// Types e Interfaces
import type { TPropsResumoVersoes } from '@/models/components/IVersaoChangelog'
defineProps<TPropsResumoVersoes>();

</script>
