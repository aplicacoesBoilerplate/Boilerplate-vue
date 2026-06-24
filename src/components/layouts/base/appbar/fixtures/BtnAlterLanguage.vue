<template>
  <v-menu
    v-model="isMenuOpen"
    location="bottom end"
  >
    <template #activator="{ props: menuProps }">
      <v-tooltip
        :text="t('tooltips.appBar.language')"
        location="bottom"
      >
        <template #activator="{ props: tooltipProps }">
          <v-btn
            v-bind="mergeProps(menuProps, tooltipProps)"
            class="mx-1"
            variant="text"
            icon="mdi-translate"
            size="small"
          />
        </template>
      </v-tooltip>
    </template>

    <v-list
      density="compact"
      nav
    >
      <v-list-item
        v-for="item in availableLocales"
        :key="item.value"
        :value="item.value"
        :active="locale === item.value"
        color="primary"
        @click="changeLocale(item.value)"
      >
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { mergeProps, ref, watch, inject } from "vue";
import { useI18n } from "vue-i18n";

// Constantes
import { availableLocales } from "@/locales/AvailableLocales";

// Utils
import { ClassManagerStorage } from "@/utils/ManagerStorage";

// Setup de estado do Drawer
const setKeepOpen = inject<((val: boolean) => void) | undefined>(
  "drawerKeepOpen",
  undefined,
);

// Composables
const { t, locale } = useI18n();

// Reativas
const isMenuOpen = ref(false);

// Observadores
watch(isMenuOpen, (val) => {
  if (setKeepOpen) setKeepOpen(val);
});

// Funções
function changeLocale(lang: string) {
  locale.value = lang;
  ClassManagerStorage.set("user_locale", lang, "local");
}

</script>
