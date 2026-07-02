<template>
  <BaseDialog
    v-model:exibirDialog="exibirFiltros"
    title="Filtros"
    maxWidth="1050px"
    height="600px"
    contentClass="pa-0"
  >
    <template #activator="{ props: activatorProps }">
      <slot
        name="activator"
        v-bind="activatorProps"
      >
        <v-tooltip
          :text="t('tooltips.appBar.filter')"
          location="bottom"
        >
          <template #activator="{ props: tooltipProps }">
            <v-btn
              v-bind="mergeProps(tooltipProps, activatorProps)"
              icon="mdi-filter-cog"
              size="small"
            >
              <v-badge
                :model-value="genericFilterStore.appliedCount > 0"
                :content="genericFilterStore.appliedCount"
                class="small-badge"
                offset-x="-2"
                offset-y="-2"
                color="indigo-darken-4"
              >
                <v-icon icon="mdi-filter-cog" />
              </v-badge>
            </v-btn>
          </template>
        </v-tooltip>
      </slot>
    </template>

    <template #titulo="slotProps">
      <v-toolbar color="primary">
        <v-btn
          icon="mdi-menu"
          rounded="xl"
          @click="toggleLeftDrawer = !toggleLeftDrawer"
        />
        <v-toolbar-title>{{ slotProps.title }}</v-toolbar-title>
        <template #append>
          <v-row class="mr-2 ga-2">
            <v-btn
              v-if="genericFilterStore.appliedCount > 0"
              variant="tonal"
              rounded="xl"
              icon
              @click="toggleRightDrawer = !toggleRightDrawer"
            >
              <v-icon>mdi-pin-outline</v-icon>

              <v-badge
                floating
                offset-x="-5"
                offset-y="-5"
                color="indigo-darken-4"
                :content="genericFilterStore.appliedCount"
              />
            </v-btn>

            <v-btn
              icon="mdi-close"
              rounded="xl"
              @click="slotProps.onFechar"
            />
          </v-row>
        </template>
      </v-toolbar>
    </template>

    <template #content>
      <v-layout style="height: 100%; min-height: 450px">
        <DrawerFiltroLeft
          v-model:toggleLeftDrawer="toggleLeftDrawer"
          :camposDisponiveis="camposDisponiveis"
        />

        <DrawerFiltroRight
          v-model:toggleRightDrawer="toggleRightDrawer"
          :camposDisponiveis="camposDisponiveis"
        />

        <v-main
          :class="[
            'dialog-filtro-main ma-2',
            { 'dialog-filtro-main--consulta-aberta': deveExibirConsultaRegistros },
          ]"
        >
          <div class="dialog-filtro-main__formulario">
            <FormFiltros
              v-model:exibirConsultaRegistros="exibirConsultaRegistros"
              :registros="registros"
            />
          </div>

          <Transition name="consulta-registros-drawer">
            <section
              v-if="deveExibirConsultaRegistros"
              class="dialog-filtro-main__consulta pa-1"
              aria-label="Consulta auxiliar de registros"
            >
              <ConsultaRegistrosFiltro
                v-model:valorFiltro="genericFilterStore.filterModel.valor"
                v-model:valoresSelecionados="genericFilterStore.filterModel.valoresSelecionados"
                :campoSelecionado="campoSelecionadoAtual"
                :condicao="genericFilterStore.filterModel.condicao"
                @fechar="exibirConsultaRegistros = false"
              />
            </section>
          </Transition>
        </v-main>
      </v-layout>
    </template>

    <template #actions="slotProps">
      <v-btn
        color="error"
        :height="alturaBotaoAcao"
        :minWidth="larguraMinimaBotaoAcao"
        :size="tamanhoBotaoAcao"
        variant="tonal"
        text="CANCELAR"
        @click="slotProps.onCancelar"
      />

      <v-spacer />

      <v-btn
        color="red-darken-1"
        :height="alturaBotaoAcao"
        :minWidth="larguraMinimaBotaoAcao"
        :size="tamanhoBotaoAcao"
        variant="tonal"
        :text="smAndDown ? 'LIMPAR' : 'LIMPAR FILTROS'"
        :loading="loading"
        @click="handleOnLimparFiltros"
      />

      <v-btn
        color="primary"
        :height="alturaBotaoAcao"
        :minWidth="larguraMinimaBotaoAcao"
        :size="tamanhoBotaoAcao"
        variant="flat"
        text="APLICAR"
        :loading="loading"
        @click="handleOnAplicarFiltros"
      />
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed, mergeProps, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDisplay } from 'vuetify';

// Stores
import { useGenericFilterStore } from '@/stores/genericFilter.store';

// Types e Interfaces
import type { ICampoFiltro } from '@/models/filters/ICampoFiltro';

// Componentes
import BaseDialog from '../base/BaseDialog.vue';
import DrawerFiltroLeft from './fixtures/drawers/DrawerFiltroLeft.vue';
import DrawerFiltroRight from './fixtures/drawers/DrawerFiltroRight.vue';
import ConsultaRegistrosFiltro from './fixtures/consulta/ConsultaRegistrosFiltro.vue';
import FormFiltros from '../../forms/FormFiltros.vue';

type TProps = {
  registros?: object[];
  camposDisponiveis: ICampoFiltro<any>[];
};
defineProps<TProps>();

type TEmits = {
  onAplicarFiltros: [];
};
const emits = defineEmits<TEmits>();

// Stores
const genericFilterStore = useGenericFilterStore();

// Composables
const { smAndDown } = useDisplay();
const { t } = useI18n();

// Reativas - Model
const exibirFiltros = defineModel<boolean>('exibirFiltros', { required: false });

// Reativas - ref
const toggleLeftDrawer = ref<boolean>(true);
const toggleRightDrawer = ref<boolean>(false);
const exibirConsultaRegistros = ref<boolean>(false);
const loading = ref<boolean>(false);

// Funções
function handleOnLimparFiltros() {
  genericFilterStore.clearAll();
  handleOnAplicarFiltros();
}

function handleOnAplicarFiltros() {
  emits('onAplicarFiltros');
  exibirFiltros.value = false;
}

// Computadas
const campoSelecionadoAtual = computed(() => genericFilterStore.campoSelecionado);

const deveExibirConsultaRegistros = computed(() => {
  return exibirConsultaRegistros.value && !!campoSelecionadoAtual.value?.consultaRegistros;
});

const alturaBotaoAcao = computed(() => (smAndDown.value ? 32 : undefined));
const larguraMinimaBotaoAcao = computed(() => (smAndDown.value ? 0 : undefined));
const tamanhoBotaoAcao = computed(() => (smAndDown.value ? 'small' : 'default'));

// Observadores
watch(() => genericFilterStore.appliedCount, (newValue) => {
  toggleRightDrawer.value = newValue > 0;
}, { immediate: true });
</script>

<style src="./DialogFiltro.scss" scoped lang="scss"></style>
