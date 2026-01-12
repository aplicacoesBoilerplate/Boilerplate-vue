<template>
  <v-fab
    key="absolute"
    absolute
    app
    :color="open ? '' : 'primary'"
    location="top left"
    size="large"
    icon
  >
    <v-icon>{{ open ? 'mdi-close' : 'mdi-cog' }}</v-icon>
    <v-speed-dial
      v-model="open"
      location="right center"
      transition="slide-y-reverse-transition"
      activator="parent"
    >
      <div key="1">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-icon-btn
              icon="mdi-translate"
              color="info"
              v-bind="props"
              v-tooltip="t('tooltips.appBar.language')"
            />
          </template>
          <v-list>
            <v-list-item
              v-for="(item, index) in availableLocales"
              :key="index"
              :value="item.value"
              @click="changeLocale(item.value)"
              :active="locale === item.value"
              color="primary"
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
          v-tooltip="t('tooltips.appBar.theme')"
          :rotate="true"
          @click="toggleTheme"
        />
      </div>

      <div key="3">
        <BtnOpenDialog
          color="primary"
          icon="mdi-information"
          v-tooltip="t('tooltips.appBar.info')"
          :rotate="true"
          @click="redirectToInfoSystem"
        />
      </div>
    </v-speed-dial>
  </v-fab>
</template>

<script setup lang="ts">
import { availableLocales } from '@/locales/AvailableLocales'
import BtnOpenDialog from '@/components/dialog/BtnOpenDialog.vue';
import { useThemeSwitch } from '@/composables/useThemeSwitch';
import { StorageUtils } from '@/utils/StorageUtils';
import router from '@/router';
import { useI18n } from 'vue-i18n';
import { computed, ref } from 'vue'

const { theme, toggleTheme } = useThemeSwitch()
const { t, locale } = useI18n()
const open = ref(false)

const isDark = computed(() => theme.global.current.value.dark)

function changeLocale(lang: string) {
  locale.value = lang
  StorageUtils.set('user_locale', lang, 'local');
}

function redirectToInfoSystem() {
  router.push({
    name: 'SystemInfo'
  });
}
</script>
