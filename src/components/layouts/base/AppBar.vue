<template>
  <v-app-bar app flat border="b">

    <v-app-bar-title class="font-weight-bold w-25">
      Boilerplate
    </v-app-bar-title>

    <v-spacer />

    <v-form
      ref="formSearchRef"
      v-model="formSearchIsValid"
      @submit.prevent="submitForm"
      class="w-50"
    >
      <v-text-field
        ref="searchInput"
        v-model="searchInputValue"
        hide-details
        single-line
        clearable
        rounded="pill"
        density="compact"
        variant="solo"
        @click:append-inner="onClick"
        :loading="loading"
      >
        <template v-slot:prepend-inner>
          <v-hotkey
            class="ms-2 me-1"
            keys="cmd+k"
            display-mode="icon"
            variant="contained"
            platform="auto"
          />
        </template>

        <template v-slot:append-inner>
          <v-icon-btn icon="mdi-magnify" class="ms-2 me-1"/>
        </template>
      </v-text-field>
    </v-form>

    <v-spacer />

    <template v-slot:append>
      <v-badge location="bottom left" color="warning" dot class="ms-3">
        <v-icon-btn icon="mdi-bell" variant="flat"/>
      </v-badge>

      <v-divider vertical class="mx-2 my-auto" style="height: 24px" :thickness="2" />

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
import { useThemeSwitch } from '@/composables/useThemeSwitch'
import { ref, computed } from 'vue';
import { useHotkey } from 'vuetify';

const formSearchIsValid = ref(true)
const formSearchRef = ref<any>(null)
const searchInput = ref<any>(null)
const searchInputValue = ref('')

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

async function submitForm() {
  const isValid = await formSearchRef.value?.validate();
  if (!isValid) {
    return;
  } else {
    onClick();
  }
}

const { theme, toggleTheme } = useThemeSwitch()
const isDark = computed(() => theme.global.current.value.dark)

</script>
