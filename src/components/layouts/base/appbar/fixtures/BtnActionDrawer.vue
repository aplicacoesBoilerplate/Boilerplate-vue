<template>
  <div
    :style="{
      width,
      position: absolute ? 'absolute' : 'relative',
      top: absolute ? top : 'auto',
      right: absolute ? right : 'auto',
      left: absolute ? left : 'auto',
      zIndex: absolute ? 99 : 'auto',
    }"
    class="d-flex justify-end align-center ml-2"
  >
    <v-hover>
      <template #default="{ isHovering, props }">
        <v-sheet
          v-bind="props"
          :elevation="isHovering || isForcedOpen ? 4 : 2"
          :color="isHovering || isForcedOpen ? 'surface' : 'transparent'"
          class="d-flex align-center rounded-pill transition-swing overflow-hidden mr-2"
          style="position: absolute; right: 0; max-height: 40px"
        >
          <v-expand-x-transition>
            <div
              v-if="isHovering || isForcedOpen"
              class="align-center flex-nowrap pl-2 overflow-hidden"
              style="display: flex; width: max-content"
            >
              <slot />
            </div>
          </v-expand-x-transition>

          <v-btn
            :icon="icon"
            :color="color"
            :style="{
              transform: isHovering || isForcedOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            }"
            variant="text"
            size="small"
            class="flex-shrink-0 mx-1 my-1 transition-swing"
          />
        </v-sheet>
      </template>
    </v-hover>
  </div>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { provide, ref } from 'vue';

// Provide/Inject para manter a gaveta aberta
const isForcedOpen = ref(false);
provide('drawerKeepOpen', (val: boolean) => {
  isForcedOpen.value = val;
});

/**
 * @property {string} icon - Ícone do botão principal.
 * @property {string} color - Cor do botão principal.
 * @property {string} width - Largura reservada para a expansão da gaveta.
 * @property {boolean} absolute - Se deve ser posicionado absolutamente na tela.
 * @property {string} top - Distância do topo (se absolute).
 * @property {string} right - Distância da direita (se absolute).
 * @property {string} left - Distância da esquerda (se absolute).
 */
export type TPropsBtnDrawer = {
  icon?: string;
  color?: string;
  width?: string;
  absolute?: boolean;
  top?: string;
  right?: string;
  left?: string;
};
withDefaults(defineProps<TPropsBtnDrawer>(), {
  icon: 'mdi-menu-open',
  color: 'primary',
  width: '220px',
  absolute: false,
});
</script>
