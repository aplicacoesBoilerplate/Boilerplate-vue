<template>
  <v-hover>
    <template #default="{ isHovering, props: hoverProps }">
      <v-tooltip
        :text="t('tooltips.appBar.theme')"
        location="bottom"
      >
        <template #activator="{ props: tooltipProps }">
          <v-btn
            v-bind="mergeProps(hoverProps, tooltipProps)"
            :color="isDark ? 'yellow-lighten-3' : 'primary'"
            :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
            :style="{
              transform: isHovering ? 'rotate(360deg)' : 'rotate(0deg)',
              transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            }"
            class="mx-1"
            variant="text"
            size="small"
            @click="toggleTheme"
          />
        </template>
      </v-tooltip>
    </template>
  </v-hover>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed, mergeProps } from 'vue';
import { useI18n } from 'vue-i18n';

// Composables
import { useThemeSwitch } from '@/composables/useThemeSwitch';

const { theme, toggleTheme } = useThemeSwitch();
const { t } = useI18n();

// Computadas
const isDark = computed(() => theme.global.current.value.dark);
</script>
