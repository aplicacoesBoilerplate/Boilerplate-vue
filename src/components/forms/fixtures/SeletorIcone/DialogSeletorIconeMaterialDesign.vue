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

    <template #content>
      <v-autocomplete
        v-model="iconeBusca"
        v-model:search="termoBusca"
        :items="iconesFiltrados"
        :label="t('forms.seletorIconeMaterialDesign.dialog.buscarLabel')"
        :loading="carregando"
        :noDataText="t('forms.seletorIconeMaterialDesign.dialog.semResultados')"
        class="mb-4 flex-shrink-0"
        itemTitle="nome"
        itemValue="valor"
        density="comfortable"
        variant="outlined"
        autocomplete="off"
        noFilter
        clearable
        hideDetails
        @update:modelValue="selecionarIconeBusca"
      >
        <template #item="{ props: itemProps, item }">
          <v-list-item
            v-bind="itemProps"
            :subtitle="item.aliases.join(', ')"
            :title="item.nome"
          >
            <template #prepend>
              <v-icon :icon="item.valor" />
            </template>
          </v-list-item>
        </template>
      </v-autocomplete>

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
const iconeBusca = ref<string | null>(null);

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

/**
 * @description Trata a seleção realizada diretamente pela busca autocomplete.
 * @param pValorIcone - Valor escolhido na lista de sugestões.
 */
function selecionarIconeBusca(pValorIcone: string | null): void {
  if (pValorIcone) {
    selecionarIcone(pValorIcone);
  }
}

// Observadores
watch(exibirDialog, (pExibirDialog) => {
  if (!pExibirDialog) {
    termoBusca.value = '';
    iconeBusca.value = null;
    return;
  }

  void carregarCatalogo();
});
</script>
