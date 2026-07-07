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
          >{{ letraInicial }}
        </v-avatar>
      </template>

      <template #title>
        <v-sheet class="d-flex align-center justify-center">
          {{ nomeCurto }}
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
          :icon="menuFixado ? 'mdi-pin' : 'mdi-pin-off'"
          color="primary"
          variant="tonal"
          size="small"
          v-tooltip="menuFixado ? t('components.drawerItemUsuario.desafixarMenu') : t('components.drawerItemUsuario.fixarMenu')"
          @click="alternarFixacaoMenu"
        />
      </template>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDisplay } from 'vuetify';

// Stores
import { useAuthStore } from '@/stores/auth.store';
import { usePreferencesStore } from '@/stores/preferences.store';

// Constantes
import { ICONE_PAPEL, type TPapelPadrao } from '@/models/model/usuario/lUsuario';

// Composables
const { mdAndUp } = useDisplay();
const { t } = useI18n();

// Stores
const authStore = useAuthStore();
const preferencesStore = usePreferencesStore();

// Funções
function alternarFixacaoMenu(): void {
  preferencesStore.setDrawerPinned(!menuFixado.value);
}

// Computadas
const nomeCurto = computed(() => authStore.user?.nome?.split(' ')[0] ?? '');

const letraInicial = computed(() => (nomeCurto.value ? nomeCurto.value.charAt(0).toUpperCase() : ''));

const menuFixado = computed(() => preferencesStore.preferences.drawer.isDrawerPinned);

const iconePapel = computed(() => ICONE_PAPEL[(authStore.user?.papel ?? 'USER') as TPapelPadrao] ?? 'mdi-account-key');

</script>
