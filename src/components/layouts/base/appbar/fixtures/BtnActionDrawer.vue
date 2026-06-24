<template>
  <div
    class="d-flex justify-end align-center ml-2"
    :style="{
      width,
      position: absolute ? 'absolute' : 'relative',
      top: absolute ? top : 'auto',
      right: absolute ? right : 'auto',
      left: absolute ? left : 'auto',
      zIndex: absolute ? 99 : 'auto'
    }"
  >
    <v-hover>
      <template v-slot:default="{ isHovering, props }">
        <v-sheet
          v-bind="props"
          :elevation="(isHovering || isForcedOpen) ? 4 : 2"
          :color="(isHovering || isForcedOpen) ? 'surface' : 'transparent'"
          class="d-flex align-center rounded-pill transition-swing overflow-hidden mr-2"
          style="position: absolute; right: 0; max-height: 40px"
        >
          <v-expand-x-transition>
            <div
              v-show="isHovering || isForcedOpen"
              class="align-center flex-nowrap pl-2 overflow-hidden"
              style="display: flex; width: max-content"
            >
              <slot />
            </div>
          </v-expand-x-transition>

          <v-btn
            :icon="icon"
            variant="text"
            :color="color"
            size="small"
            class="flex-shrink-0 mx-1 my-1 transition-swing"
            :style="{
              transform: (isHovering || isForcedOpen) ? 'rotate(180deg)' : 'rotate(0deg)',
            }"
          />
        </v-sheet>
      </template>
    </v-hover>
  </div>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { ref, provide } from "vue";

// Provide/Inject para manter a gaveta aberta
const isForcedOpen = ref(false);
provide("drawerKeepOpen", (val: boolean) => {
  isForcedOpen.value = val;
});

// Types e Interfaces
export type TPropsBtnDrawer = {
  /** Ícone do botão principal */
  icon?: string;
  /** Cor do botão principal */
  color?: string;
  /** Largura reservada para a expansão da gaveta */
  width?: string;
  /** Se deve ser posicionado absolutamente na tela */
  absolute?: boolean;
  /** Distância do topo (se absolute) */
  top?: string;
  /** Distância da direita (se absolute) */
  right?: string;
  /** Distância da esquerda (se absolute) */
  left?: string;
};

withDefaults(defineProps<TPropsBtnDrawer>(), {
  icon: "mdi-menu-open",
  color: "primary",
  width: "220px",
  absolute: false,
});

</script>
