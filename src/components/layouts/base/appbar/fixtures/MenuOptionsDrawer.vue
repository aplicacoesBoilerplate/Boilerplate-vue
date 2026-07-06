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
      v-if="exibirDialogLicence"
      v-model:dialogLicenceOpen="dialogLicenceOpen"
    />

    <BtnAlterLanguage />
    <BtnInstalarPwa />

    <BtnInfoSystem v-if="route.path != '/system-info'" />
    <BtnPaginaInicial v-else />

    <BtnToggleTheme />

    <v-divider
      class="mx-1 my-2"
      vertical
    />
  </BtnActionDrawer>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { useRoute } from 'vue-router';

// Componentes
import BtnActionDrawer, { type TPropsBtnDrawer } from './BtnActionDrawer.vue';
import DialogLicence from '@/components/dialogs/DialogLicence.vue';
import BtnAlterLanguage from './BtnAlterLanguage.vue';
import BtnInstalarPwa from './BtnInstalarPwa.vue';
import BtnInfoSystem from './BtnInfoSystem.vue';
import BtnPaginaInicial from './BtnPaginaInicial.vue';
import BtnToggleTheme from './BtnToggleTheme.vue';

type TProps = {
  exibirDialogLicence?: boolean;
}
withDefaults(defineProps<TProps & TPropsBtnDrawer>(), {
  exibirDialogLicence: true,
  icon: "mdi-menu-open",
  color: "primary",
  width: "220px",
  top: undefined,
  right: undefined,
  left: undefined,
  absolute: false,
});

// Composables
const route = useRoute();

// Reativas
const dialogLicenceOpen = defineModel<boolean>('dialogLicenceOpen', { default: false });
</script>
