<template>
  <v-list style="height: 64px;">
    <v-list-item>
      <template #prepend>
        <v-avatar
          v-if="authStore.user?.avatar"
          :image="authStore.user.avatar"
        />

        <v-avatar
          v-else
          color="primary"
          class="font-weight-bold"
          >{{ initialLetter }}
        </v-avatar>
      </template>

      <template #title>
        <v-sheet class="d-flex align-center justify-center">
          {{ shortName }}
        </v-sheet>
      </template>

      <template #subtitle>
        <v-sheet class="d-flex align-center justify-center">
          <v-chip
            :appendIcon="iconePapel"
            class="ma-0"
            color="primary"
            size="x-small"
            label
            >{{ authStore.user?.papel }}
          </v-chip>
        </v-sheet>
      </template>

      <template
        v-if="mdAndUp"
        #append
      >
        <v-btn
          :icon="isPinned ? 'mdi-pin' : 'mdi-pin-off'"
          color="primary"
          variant="tonal"
          size="small"
          v-tooltip="isPinned ? 'Desafixar menu' : 'Fixar menu'"
          @click="togglePin"
        />
      </template>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed } from 'vue';
import { useDisplay } from 'vuetify';

// Stores
import { useAuthStore } from '@/stores/auth';
import { usePreferencesStore } from '@/stores/preferences.store';

// Constantes
import { ICONE_PAPEL, type TPapelPadrao } from '@/models/model/usuario/lUsuario';

// Composables
const { mdAndUp } = useDisplay();

// Stores
const authStore = useAuthStore();
const preferencesStore = usePreferencesStore();

// Funções
function togglePin() {
  preferencesStore.setDrawerPinned(!isPinned.value);
}

// Computadas
const shortName = computed(() => authStore.user?.nome?.split(' ')[0] ?? '');

const initialLetter = computed(() => (shortName.value ? shortName.value.charAt(0).toUpperCase() : ''));

const isPinned = computed(() => preferencesStore.preferences.drawer.isDrawerPinned);

const iconePapel = computed(() => ICONE_PAPEL[(authStore.user?.papel ?? 'USER') as TPapelPadrao] ?? 'mdi-account-key');

</script>
