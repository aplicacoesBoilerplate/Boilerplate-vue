<template>
  <v-list>
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
            :appendIcon="ROLE_ICONS[authStore.user?.role ?? 'USER']"
            class="ma-0"
            color="primary"
            size="x-small"
            label
            >{{ authStore.user?.role }}
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
import { computed } from "vue";
import { useDisplay } from "vuetify";

// Stores
import { useAuthStore } from "@/stores/auth";
import { usePreferencesStore } from "@/stores/preferences.store";

// Constantes
import { ROLE_ICONS } from "@/models/model/ModelUser";

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
const shortName = computed(() => authStore.user?.username?.split(" ")[0] ?? "");

const initialLetter = computed(() =>
  shortName.value ? shortName.value.charAt(0).toUpperCase() : "",
);

const isPinned = computed(
  () => preferencesStore.preferences.drawer.isDrawerPinned,
);
</script>
