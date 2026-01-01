<template>
  <v-app-bar app flat border="b">
    <v-app-bar-nav-icon v-tooltip="'Menu'" @click="emits('toggle-drawer')" />

    <v-app-bar-title class="font-weight-bold"> Boilerplate </v-app-bar-title>

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
        <v-icon-btn icon="mdi-bell" v-tooltip="'Notificações'" variant="flat" />
      </v-badge>

      <v-divider
        vertical
        class="mx-2 my-auto"
        style="height: 24px"
        :thickness="2"
      />

      <BtnOpenDialog
        icon="mdi-license"
        v-tooltip="'Licença'"
        :rotate="false"
        @click="toggleDialogLicenca"
      />

      <v-divider
        vertical
        class="mx-2 my-auto"
        style="height: 24px"
        :thickness="2"
      />

      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props" v-tooltip="t('menu.language')">
            <v-icon>mdi-translate</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in availableLocales"
            :key="index"
            :value="item.value"
            @click="changeLocale(item.value)"
            :active="currentLocale === item.value"
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
        v-tooltip="isDark ? 'Tema claro' : 'Tema escuro'"
        :rotate="true"
        class="me-3"
        @click="toggleTheme"
      />
    </template>
  </v-app-bar>

  <BaseDialog v-model:atributos="classDialogLicenca.model">
    <template #titulo>
      <v-icon size="small" icon="mdi-information-variant-circle-outline" />
      Informações da licença
    </template>

    <template #default>
      <v-list dense>
        <v-list-item>
          <template v-slot:prepend>
            <v-list-item-icon>
              <v-icon size="x-large" color="info" class="mr-3">mdi-code-block-tags</v-icon>
            </v-list-item-icon>
          </template>
          <v-list-item-content>
            <v-list-item-title>Versão: {{ versaoDoSistema }}</v-list-item-title>
            <v-list-item-subtitle>Atualizado em: {{ dataVersaoFormatada }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <template v-slot:prepend>
            <v-list-item-icon>
              <v-icon size="x-large" color="warning" class="mr-3">mdi-license</v-icon>
            </v-list-item-icon>
          </template>
          <v-list-item-content>
            <v-list-item-title>Software</v-list-item-title>
            <v-list-item-subtitle><em>Boilerplate</em></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import pkg from '../../../../package.json'
import { ClassBaseDialog } from '@/classes/ClassBaseDialog'
import AppBarSearchForm from '@/components/forms/AppBarSearchForm.vue'
import BaseDialog from '@/components/dialog/BaseDialog.vue'
import BtnOpenDialog from '@/components/dialog/BtnOpenDialog.vue'
import { useThemeSwitch } from '@/composables/useThemeSwitch'
import { useI18n } from 'vue-i18n'
import { useDisplay } from 'vuetify'
import { ref, computed } from 'vue'

const { smAndDown, mdAndUp } = useDisplay()
const { theme, toggleTheme } = useThemeSwitch()
const isDark = computed(() => theme.global.current.value.dark)

const versaoDoSistema = pkg.version
const dataVersaoFormatada = computed(() => {
  const data = new Date(__APP_BUILD_DATE__)
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(data)
})

const emits = defineEmits(['toggle-drawer'])

const loading = ref(false)

function handleSearch(term: string) {
  loading.value = true
  setTimeout(() => (loading.value = false), 2000)
}

const classDialogLicenca = new ClassBaseDialog({
  visualizar: false,
  maxHeight: 350,
  maxWidth: 400,
})

function toggleDialogLicenca() {
  classDialogLicenca.toggleDialog()
}

const { t, locale } = useI18n()
const currentLocale = computed(() => locale.value)

const availableLocales = [
  { title: 'Português', value: 'pt' },
  { title: 'English', value: 'en' },
  { title: 'Español', value: 'es' }
]

function changeLocale(lang: string) {
  locale.value = lang
}
</script>

<style scoped>
.search-form {
  max-width: 480px;
  width: 100%;
}
</style>
