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

    <BtnInfoSistema v-if="route.name != 'InformacoesSistema'" />
    <BtnPaginaInicial v-if="route.name != 'Inicio'" />

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

import DialogLicence from '@/components/dialogs/DialogLicence.vue';

// Componentes
import BtnActionDrawer, { type TPropsBtnDrawer } from './BtnActionDrawer.vue';
import BtnAlterLanguage from './BtnAlterLanguage.vue';
import BtnInfoSistema from './BtnInfoSistema.vue';
import BtnInstalarPwa from './BtnInstalarPwa.vue';
import BtnPaginaInicial from './BtnPaginaInicial.vue';
import BtnToggleTheme from './BtnToggleTheme.vue';

type TProps = {
  exibirDialogLicence?: boolean;
};
withDefaults(defineProps<TProps & TPropsBtnDrawer>(), {
  exibirDialogLicence: true,
  icon: 'mdi-menu-open',
  color: 'primary',
  width: '220px',
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
