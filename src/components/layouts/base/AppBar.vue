<template>
  <v-app-bar app flat border="b">
    <!-- <template v-slot:prepend>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
    </template> -->

    <v-app-bar-title class="font-weight-bold">
      Boilerplate
    </v-app-bar-title>

    <div class="d-flex justify-center">
      AAAA
    </div>

    <template v-slot:append>

      <v-btn
        icon
        variant="text"
        @click="toggleTheme"
        :color="isDark ? 'yellow-lighten-3' : 'primary'"
        title="Alternar Tema"
      >
        <v-icon>
          {{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}
        </v-icon>
      </v-btn>

      <v-divider vertical class="mx-2 my-auto" style="height: 24px" />

      <v-btn icon="mdi-bell-outline"></v-btn>

      <v-btn icon="mdi-account-circle"></v-btn>
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useThemeSwitch } from '@/composables/useThemeSwitch'

const { theme, toggleTheme } = useThemeSwitch()
const isDark = computed(() => theme.global.current.value.dark)

</script>
