<template>
  <v-app-bar app flat border="b">
    <v-app-bar-nav-icon v-tooltip="t('tooltips.appBar.menu')" @click="emits('toggle-drawer')" />
    <v-app-bar-title class="font-weight-bold">{{ t('app.title') }}</v-app-bar-title>

    <template v-if="mdAndUp">
      <v-spacer />
      <div style="width: 100%; max-width: 480px">
        <AppBarSearchForm :loading="loading" @search="handleSearch" />
      </div>
      <v-spacer />
    </template>

    <template v-slot:extension v-if="smAndDown">
      <div class="px-4 pb-2 w-100">
        <AppBarSearchForm :loading="loading" @search="handleSearch" />
      </div>
    </template>

    <template v-slot:append>
      <v-badge location="bottom left" color="warning" dot class="ms-2">
        <v-icon-btn icon="mdi-bell" v-tooltip="t('tooltips.appBar.notifications')" variant="flat" />
      </v-badge>

      <v-divider
        vertical
        class="mx-2 my-auto"
        style="height: 24px"
        :thickness="2"
      />

      <BtnOpenDialog
        icon="mdi-license"
        v-tooltip="t('tooltips.appBar.licence')"
        :rotate="false"
        @click="toggleDialogLicence"
      />

      <v-divider
        vertical
        class="mx-2 my-auto"
        style="height: 24px"
        :thickness="2"
      />

      <v-menu>
        <template v-slot:activator="{ props }">
          <v-icon-btn icon="mdi-translate" v-bind="props" v-tooltip="t('tooltips.appBar.language')" />
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

      <v-divider
        vertical
        class="mx-2 my-auto"
        style="height: 24px"
        :thickness="2"
      />

      <BtnOpenDialog
        :color="isDark ? 'yellow-lighten-3' : 'primary'"
        :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        v-tooltip="t('tooltips.appBar.theme')"
        :rotate="true"
        class="me-3"
        @click="toggleTheme"
      />
    </template>
  </v-app-bar>

  <BaseDialog v-model:attributes="classDialogLicence.model">
    <template v-slot:title>
      <v-icon size="small" icon="mdi-information-variant-circle-outline" />
      {{ t('app.cardInfoLicence') }}
    </template>

    <template v-slot:default>
      <v-list dense>
        <v-list-item
          :title="t('app.version') + ': ' + systemVersion"
          :subtitle="t('app.updateDate') + ': ' + formattedVersionDate"
        >
          <template v-slot:prepend>
            <v-icon size="x-large" color="info" class="mr-3">mdi-code-block-tags</v-icon>
          </template>
        </v-list-item>

        <v-list-item
          :title="t('app.software')"
          :subtitle="t('app.title')"
        >
          <template v-slot:prepend>
            <v-icon size="x-large" color="warning" class="mr-3">mdi-license</v-icon>
          </template>
        </v-list-item>
      </v-list>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import pkg from '../../../../package.json'
import { availableLocales } from '@/locales/AvailableLocales'
import AppBarSearchForm from '@/components/forms/AppBarSearchForm.vue'
import BaseDialog from '@/components/dialog/BaseDialog.vue'
import BtnOpenDialog from '@/components/dialog/BtnOpenDialog.vue'
import { ClassBaseDialog } from '@/classes/ClassBaseDialog'
import { useThemeSwitch } from '@/composables/useThemeSwitch'
import { formattedDate } from '@/utils/formattedDate'
import { StorageUtils } from '@/utils/StorageUtils'
import { useI18n } from 'vue-i18n'
import { useDisplay } from 'vuetify'
import { ref, computed } from 'vue'

const { smAndDown, mdAndUp } = useDisplay()
const { theme, toggleTheme } = useThemeSwitch()
const isDark = computed(() => theme.global.current.value.dark)
const { t, locale } = useI18n()

const systemVersion = pkg.version
const formattedVersionDate = computed(() => {
  return formattedDate(new Date(__APP_BUILD_DATE__), locale.value);
})

const emits = defineEmits(['toggle-drawer'])

const loading = ref(false)

function handleSearch(term: string) {
  loading.value = true
  setTimeout(() => (loading.value = false), 2000)
}

const classDialogLicence = new ClassBaseDialog({
  view: false,
  maxHeight: 350,
  maxWidth: 400,
})

function toggleDialogLicence() {
  classDialogLicence.toggleDialog()
}

function changeLocale(lang: string) {
  locale.value = lang
  StorageUtils.set('user_locale', lang, 'local');
}
</script>

<style scoped>
.search-form {
  max-width: 480px;
  width: 100%;
}
</style>
