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
    <template #activator="{ props }">
      <slot
        name="activator"
        :props="props"
      />
    </template>

    <v-card
      class="base-dialog d-flex flex-column"
      :class="{ 'fill-height': fullscreen }"
      :rounded="fullscreen ? '0' : 'lg'"
    >
      <slot
        name="titulo"
        :title="tituloDialog"
        :titulo="tituloDialog"
        :onFechar="fechar"
      >
        <v-toolbar
          :title="tituloDialog"
          :iconePrependTitulo="iconePrependTitulo"
          class="base-dialog-toolbar"
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
              :aria-label="t('components.baseDialog.fecharAriaLabel', { titulo: tituloDialog })"
              icon="mdi-close"
              variant="text"
              @click="fechar"
            />
          </template>

          <template
            v-if="$slots['extension']"
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
            :title="tituloDialog"
            :titulo="tituloDialog"
            :onFechar="fechar"
            :onSalvar="salvar"
            :onCancelar="cancelar"
          >
            <v-btn
              color="error"
              variant="tonal"
              :text="t('tooltips.forms.cancel')"
              @click="cancelar"
            />

            <v-spacer />

            <v-btn
              color="primary"
              variant="flat"
              :text="t('tooltips.forms.save')"
              :loading="loading"
              @click="salvar"
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
import { useI18n } from 'vue-i18n';

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

// Composables
const { t } = useI18n();

// Reativas
const dialogModel = defineModel<boolean>('exibirDialog', { default: false });

// Funções
function definirAbertura(pAberto: boolean): void {
  dialogModel.value = pAberto;
}

function abrir(): void {
  definirAbertura(true);
}

function fechar(): void {
  emits('fechar');
  definirAbertura(false);
}

function cancelar(): void {
  emits('cancelar');
  fechar();
}

function salvar(): void {
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

const mostrarAcoesDialog = computed(() => props.mostrarAcoes ?? true);
const tituloDialog = computed(() => props.titulo === 'Dialog' ? t('components.baseDialog.tituloPadrao') : props.titulo);

// Expose
defineExpose({
  abrir,
  fechar,
  definirAbertura,
  cancelar,
  salvar,
  open: abrir,
  close: fechar,
  setOpen: definirAbertura,
  handleCancelar: cancelar,
  handleSalvar: salvar,
});
</script>

<style src="./BaseDialog.scss" scoped lang="scss"></style>
