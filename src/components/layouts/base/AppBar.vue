<template>
  <v-app-bar app flat border="b">
    <v-app-bar-nav-icon @click="emits('toggle-drawer')" />

    <v-app-bar-title class="font-weight-bold">
    Boilerplate
    </v-app-bar-title>

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
        <v-icon-btn icon="mdi-bell" variant="flat" />
      </v-badge>

      <v-divider
        vertical
        class="mx-2 my-auto"
        style="height: 24px"
        :thickness="2"
      />

      <v-btn
        icon
        variant="plain"
        @click="toggleTheme"
        :color="isDark ? 'yellow-lighten-3' : 'primary'"
        title="Alternar Tema"
      >
        <v-icon>
          {{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}
        </v-icon>
      </v-btn>
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'
import { ref, computed } from 'vue';
import { useHotkey } from 'vuetify';
import { useThemeSwitch } from '@/composables/useThemeSwitch'
import AppBarSearchForm from '@/components/forms/AppBarSearchForm.vue';

const { smAndDown, mdAndUp } = useDisplay();

const emits = defineEmits(['toggle-drawer']);

const formSearchRef = ref<any>(null)
const searchInput = ref<any>(null)

useHotkey('ctrl+k', () => {
  searchInput.value?.focus()
})

const loaded = ref(false)
const loading = ref(false)

function onClick () {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    loaded.value = true
  }, 2000)
}

function handleSearch(term: string) {
  loading.value = true
  setTimeout(() => loading.value = false, 2000)
}

const { theme, toggleTheme } = useThemeSwitch()
const isDark = computed(() => theme.global.current.value.dark)

</script>

<style scoped>
.search-form {
  max-width: 480px;
  width: 100%;
}
</style>
