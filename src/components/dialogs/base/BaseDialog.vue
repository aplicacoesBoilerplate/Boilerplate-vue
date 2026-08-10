<template>
  <v-dialog
    v-model="dialogModel"
    :transition="transicaoDialog"
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
    <template #activator="{ props: dialogProps }">
      <slot
        :props="dialogProps"
        name="activator"
      />
    </template>

    <v-card
      :class="{ 'fill-height': fullscreen }"
      :rounded="fullscreen ? '0' : 'lg'"
      class="base-dialog d-flex flex-column"
    >
      <slot
        :title="tituloDialog"
        :titulo="tituloDialog"
        :onFechar="fechar"
        name="titulo"
      >
        <v-toolbar
          :title="tituloDialog"
          class="base-dialog-toolbar"
          color="primary"
        >
          <template
            v-if="iconePrependTitulo"
            #prepend
          >
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
            :title="tituloDialog"
            :titulo="tituloDialog"
            :onFechar="fechar"
            :onSalvar="salvar"
            :onCancelar="cancelar"
            name="actions"
          >
            <v-btn
              :text="t('tooltips.forms.cancel')"
              color="error"
              variant="tonal"
              @click="cancelar"
            />

            <v-spacer />

            <v-btn
              :loading="loading"
              :text="t('tooltips.forms.save')"
              color="primary"
              variant="flat"
              @click="salvar"
            />
          </slot>
        </v-card-actions>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

// Models
import type { IBaseDialogExpose } from '@/models/components/exposes/IBaseDialogExpose';
import type { IPropsBaseDialog } from '@/models/components/props/IPropsBaseDialog';

const props = withDefaults(defineProps<IPropsBaseDialog>(), {
  persistent: false,
  scrollable: true,
  fullscreen: false,
  transition: undefined,

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
function abrir(): void {
  dialogModel.value = true;
}

function fechar(): void {
  emits('fechar');
  dialogModel.value = false;
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

const transicaoDialog = computed(() =>
  props.transition ?? (props.fullscreen ? 'dialog-bottom-transition' : 'dialog-transition'),
);

const tituloDialog = computed(() =>
  props.titulo === 'Dialog' ? t('components.baseDialog.tituloPadrao') : props.titulo,
);

// Expose
defineExpose({
  abrir,
  fechar,
  cancelar,
  salvar,
} satisfies IBaseDialogExpose);
</script>

<style src="./BaseDialog.scss" scoped lang="scss"></style>
