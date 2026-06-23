<template>
  <v-fab
    :icon="open ? 'mdi-close' : 'mdi-cog'"
    :color="open ? '' : 'primary'"
    key="absolute"
    location="top left"
    size="large"
    absolute
    app
  >
    <v-speed-dial
      v-model="open"
      location="right center"
      transition="slide-y-reverse-transition"
      activator="parent"
    >
      <div key="1">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              icon="mdi-translate"
              color="info"
              v-tooltip="t('tooltips.appBar.language')"
            />
          </template>
          <v-list>
            <v-list-item
              v-for="(item, index) in availableLocales"
              :key="index"
              :value="item.value"
              :active="locale === item.value"
              color="primary"
              @click="changeLocale(item.value)"
            >
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <div key="2">
        <BtnOpenDialog
          :color="isDark ? 'yellow-lighten-3' : 'primary'"
          :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          :rotate="true"
          v-tooltip="t('tooltips.appBar.theme')"
          @click="toggleTheme"
        />
      </div>

      <div key="3">
        <BtnOpenDialog
          :rotate="true"
          color="primary"
          icon="mdi-information"
          v-tooltip="t('tooltips.appBar.info')"
          @click="redirectToInfoSystem"
        />
      </div>
    </v-speed-dial>
  </v-fab>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

// Router
import router from "@/router";

// Utils
import { StorageUtils } from "@/utils/StorageUtils";

// Composables
import { useThemeSwitch } from "@/composables/useThemeSwitch";

// Componentes
import BtnOpenDialog from "@/components/dialog/BtnOpenDialog.vue";

// Constantes
import { availableLocales } from "@/locales/AvailableLocales";

// Composables
const { theme, toggleTheme } = useThemeSwitch();
const { t, locale } = useI18n();

// Reativas
const open = ref(false);

// Funções
function changeLocale(lang: string) {
  locale.value = lang;
  StorageUtils.set("user_locale", lang, "local");
}

function redirectToInfoSystem() {
  router.push({
    name: "SystemInfo",
  });
}

// Computadas
const isDark = computed(() => theme.global.current.value.dark);

</script>
