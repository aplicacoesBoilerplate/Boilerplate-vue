<template>
  <BtnActionDrawer
    :icon="icon"
    :color="color"
    :width="width"
    :top="top"
    :right="right"
    :left="left"
    :absolute="absolute"
  >
    <DialogLicence
      v-if="hasDialogLicence"
      v-model:dialogLicenceOpen="dialogLicenceOpen"
    />

    <BtnAlterLanguage />
    <BtnInfoSystem />
    <BtnToggleTheme />

    <v-divider
      class="mx-1 my-2"
      vertical
    />
  </BtnActionDrawer>
</template>

<script setup lang="ts">
// Componentes
import BtnActionDrawer, { type TPropsBtnDrawer } from './BtnActionDrawer.vue';
import DialogLicence from '@/components/dialogs/DialogLicence.vue';
import BtnAlterLanguage from './BtnAlterLanguage.vue';
import BtnToggleTheme from './BtnToggleTheme.vue';
import BtnInfoSystem from './BtnInfoSystem.vue';

type TProps = {
  hasDialogLicence?: boolean;
}
withDefaults(defineProps<TProps & TPropsBtnDrawer>(), {
  hasDialogLicence: true,
  icon: "mdi-menu-open",
  color: "primary",
  width: "220px",
  top: undefined,
  right: undefined,
  left: undefined,
  absolute: false,
});

// Reativas
const dialogLicenceOpen = defineModel<boolean>('dialogLicenceOpen', { default: false });
</script>
