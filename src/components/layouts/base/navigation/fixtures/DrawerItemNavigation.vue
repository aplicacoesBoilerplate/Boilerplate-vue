<template>
  <v-list-item
    :prependIcon="item.icon"
    :title="t(item.title || '')"
    :to="item.name ? { name: item.name } : item.path"
    exact
  >
    <template
      v-slot:append
      v-if="item.hotkey && mdAndUp && isPinned"
    >
      <v-hotkey
        :keys="item.hotkey"
        displayMode="icon"
        variant="contained"
        platform="auto"
      />
    </template>
  </v-list-item>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useDisplay, useHotkey } from "vuetify";

// Types e Interfaces
import type { IRouteMeta } from "@/classes/models/ModelRouteMeta";

type TProps = {
  item: IRouteMeta;
  isPinned: boolean;
};
const props = defineProps<TProps>();

// Composables
const { mdAndUp } = useDisplay();
const { t } = useI18n();
const router = useRouter();

// Registra a hotkey acoplada ao ciclo de vida deste item específico
if (props.item.hotkey && props.item.name) {
  useHotkey(props.item.hotkey, () => {
    router.push({ name: props.item.name });
  });
}

</script>
