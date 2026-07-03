<template>
  <v-dialog
    v-model="dialogModel"
    :transition="fullscreen ? 'dialog-bottom-transition' : 'dialog-transition'"
    :persistent="persistent"
    :scrollable="scrollable"
    :fullscreen="fullscreen"
    :minWidth="minWidth"
    :width="width"
    :maxWidth="maxWidth"
    :minHeight="minHeight"
    :height="height"
    :maxHeight="maxHeight"
    :zIndex="zIndex"
  >
    <!-- Slot para renderizar o componente que abre o dialog (ativador) -->
    <template #activator="{ props: activatorProps, isActive }">
      <slot
        name="activator"
        :props="activatorProps"
        :isOpen="isActive"
        :open="open"
      />
    </template>

    <v-card
      class="base-dialog d-flex flex-column"
      :class="{ 'fill-height': fullscreen }"
      :rounded="fullscreen ? '0' : 'lg'"
    >
      <slot
        name="titulo"
        :title="titulo"
        :onFechar="close"
      >
        <v-toolbar
          :title="titulo"
          :iconePrependTitulo="iconePrependTitulo"
          color="primary"
        >
          <template #prepend>
            <v-icon
              :icon="iconePrependTitulo"
              class="px-5"
            />
          </template>

          <template #append>
            <v-btn
              :aria-label="`Fechar ${titulo}`"
              icon="mdi-close"
              variant="text"
              @click="close"
            />
          </template>

          <template
            v-if="mostrarExtensao"
            #extension
          >
            <slot name="extension" />
          </template>
        </v-toolbar>
      </slot>

      <v-card-text
        :class="['flex-grow-1', contentClass]"
        :style="contentStyles"
      >
        <slot name="content" />
      </v-card-text>

      <template v-if="mostrarAcoesDialog">
        <v-divider />

        <v-card-actions>
          <slot
            name="actions"
            :title="titulo"
            :onFechar="close"
            :onSalvar="handleSalvar"
            :onCancelar="handleCancelar"
          >
            <v-btn
              color="error"
              variant="tonal"
              text="CANCELAR"
              @click="handleCancelar"
            />

            <v-spacer />

            <v-btn
              color="primary"
              variant="flat"
              text="SALVAR"
              :loading="loading"
              @click="handleSalvar"
            />
          </slot>
        </v-card-actions>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
// Ecossistema vue
import { computed } from 'vue';

// Types e Interfaces
import type { IPropsBaseDialog } from '@/models/IPropsBaseDialog';

const props = withDefaults(defineProps<IPropsBaseDialog>(), {
  persistent: false,
  scrollable: true,
  fullscreen: false,

  maxWidth: 720,
  maxHeight: 650,
  zIndex: 2400,

  titulo: 'Dialog',
  mostrarSlotExtension: false,
  mostrarAcoes: true,
  loading: false,
  contentClass: '',
});

type TEmits = {
  fechar: [];
  cancelar: [];
  salvar: [];
};
const emits = defineEmits<TEmits>();

// Reativas - Model
const dialogModel = defineModel<boolean>('exibirDialog', { default: false });

// Funções
function setOpen(value: boolean) {
  dialogModel.value = value;
}

function open() {
  setOpen(true);
}

function close() {
  emits('fechar');
  setOpen(false);
}

function handleCancelar() {
  emits('cancelar');
  close();
}

function handleSalvar() {
  emits('salvar');
}

// Computadas
const contentStyles = computed(() => {
  if (props.fullscreen) return {};
  return {
    height: props.height,
    minHeight: props.minHeight,
  };
});

const mostrarExtensao = computed(() => props.mostrarSlotExtension ?? false);
const mostrarAcoesDialog = computed(() => props.mostrarAcoes ?? true);

// Expose
defineExpose({
  open,
  close,
  setOpen,
  handleCancelar,
  handleSalvar,
});
</script>
