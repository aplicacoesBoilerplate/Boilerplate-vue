<template>
  <BaseDialog
    v-model:exibirDialog="exibirDialog"
    :titulo="t('forms.seletorIconeMaterialDesign.dialog.titulo')"
    :iconePrependTitulo="'mdi-shape-outline'"
    :mostrarAcoes="false"
    contentClass="d-flex flex-column overflow-hidden pa-4"
    transition="scroll-y-reverse-transition"
    fullscreen
  >
    <template #activator="{ props: dialogProps }">
      <slot
        :props="dialogProps"
        name="activator" />
    </template>

    <template #extension>
      <v-text-field
        v-model="termoBusca"
        :label="t('forms.seletorIconeMaterialDesign.dialog.buscarLabel')"
        :loading="carregando"
        class="mt-5 pa-2 flex-shrink-0"
        density="comfortable"
        variant="outlined"
        autocomplete="off"
        clearable
        hideDetails
      />
    </template>

    <template #content>
      <div
        class="d-flex flex-column flex-grow-1"
        style="min-height: 0">
        <div
          v-if="carregando"
          class="d-flex flex-column align-center justify-center flex-grow-1 text-medium-emphasis"
        >
          <v-progress-circular
            color="primary"
            indeterminate
          />
          <span class="mt-3">{{ t('forms.seletorIconeMaterialDesign.dialog.carregando') }}</span>
        </div>

        <div
          v-else-if="erro"
          class="d-flex flex-column align-center justify-center flex-grow-1 text-center text-medium-emphasis"
        >
          <v-icon
            color="error"
            icon="mdi-alert-circle-outline"
            size="44"
          />
          <span class="mt-3">{{ t('forms.seletorIconeMaterialDesign.dialog.erroCarregamento') }}</span>
          <v-btn
            :text="t('forms.seletorIconeMaterialDesign.dialog.tentarNovamente')"
            class="mt-4"
            color="primary"
            variant="tonal"
            @click="carregarCatalogo"
          />
        </div>

        <div
          v-else-if="!iconesFiltrados.length"
          class="d-flex flex-column align-center justify-center flex-grow-1 text-medium-emphasis"
        >
          <v-icon
            icon="mdi-magnify-remove-outline"
            size="44"
          />
          <span class="mt-3">{{ t('forms.seletorIconeMaterialDesign.dialog.semResultados') }}</span>
        </div>

        <GradeIconesMaterialDesign
          v-else
          :iconeSelecionado="icone"
          :icones="iconesFiltrados"
          @selecionar="selecionarIcone"
        />
      </div>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

// Composables
import { useCatalogoIconesMaterialDesign } from '@/composables/useCatalogoIconesMaterialDesign';

// Componentes
import BaseDialog from '@/components/dialogs/base/BaseDialog.vue';

// Utils
import { CNormalizadores } from '@/classes/Utils/CNormalizadores';

import GradeIconesMaterialDesign from './GradeIconesMaterialDesign.vue';

type TEmits = {
  selecionar: [pValorIcone: string];
};
const emits = defineEmits<TEmits>();

// Composables
const { t } = useI18n();
const { carregando, erro, carregarCatalogo, filtrarIcones } = useCatalogoIconesMaterialDesign();

// Reativas - Model
const icone = defineModel<string>({ default: '' });
const exibirDialog = defineModel<boolean>('exibirDialog', { default: false });

// Reativas - Ref
const termoBusca = ref('');

// Computadas
const iconesFiltrados = filtrarIcones(termoBusca);

// Funções
/**
 * @description Atualiza o valor selecionado, notifica o componente pai e fecha o dialog.
 * @param pValorIcone - Valor do ícone selecionado.
 */
function selecionarIcone(pValorIcone: string): void {
  const valorNormalizado = CNormalizadores.normalizarIconeMaterialDesign(pValorIcone);

  if (!valorNormalizado) {
    return;
  }

  icone.value = valorNormalizado;
  emits('selecionar', valorNormalizado);
  exibirDialog.value = false;
}

// Observadores
watch(exibirDialog, (pExibirDialog) => {
  if (!pExibirDialog) {
    termoBusca.value = '';
    return;
  }

  void carregarCatalogo();
});
</script>
