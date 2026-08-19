<template>
  <BaseDialog
    v-model:exibirDialog="exibirFiltros"
    :titulo="t('components.dialogFiltro.titulo')"
    maxWidth="1050px"
    height="600px"
    contentClass="pa-0"
  >
    <template #activator="{ props: dialogProps }">
      <slot
        name="activator"
        :props="dialogProps"
      >
        <v-tooltip
          :text="t('tooltips.appBar.filter')"
          location="bottom"
        >
          <template #activator="{ props: tooltipProps }">
            <v-btn
              v-bind="mergeProps(tooltipProps, dialogProps)"
              icon="mdi-filter-cog"
              size="small"
            >
              <v-badge
                :modelValue="genericFilterStore.appliedCount > 0"
                :content="genericFilterStore.appliedCount"
                class="small-badge"
                offsetX="-2"
                offsetY="-2"
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
                :content="genericFilterStore.appliedCount"
                offsetX="-5"
                offsetY="-5"
                color="indigo-darken-4"
                floating
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

        <v-main :class="['dialog-filtro-main ma-2', { 'dialog-filtro-main--consulta-aberta': deveExibirConsultaRegistros }]"
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
              :aria-label="t('components.dialogFiltro.consultaRegistrosAriaLabel')"
              class="dialog-filtro-main__consulta pa-1"
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
        :height="alturaBotaoAcao"
        :minWidth="larguraMinimaBotaoAcao"
        :size="tamanhoBotaoAcao"
        :text="t('tooltips.forms.cancel')"
        color="error"
        variant="tonal"
        @click="slotProps.onCancelar"
      />

      <v-spacer />

      <v-btn
        :height="alturaBotaoAcao"
        :minWidth="larguraMinimaBotaoAcao"
        :size="tamanhoBotaoAcao"
        :text="smAndDown ? t('tooltips.forms.reset') : t('components.dialogFiltro.limparFiltros')"
        :loading="loading"
        color="red-darken-1"
        variant="tonal"
        @click="limparFiltros"
      />

      <v-btn
        :height="alturaBotaoAcao"
        :minWidth="larguraMinimaBotaoAcao"
        :size="tamanhoBotaoAcao"
        :text="t('components.dialogFiltro.aplicar')"
        :loading="loading"
        color="primary"
        variant="flat"
        @click="aplicarFiltros"
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
import type { TFiltroConsultaSerializado } from '@/models/filters/IFiltrosConsulta';
import type { TCampoFiltroMapeado } from '@/models/filters/MapeamentoFiltros';

// Componentes
import BaseDialog from '@/components/dialogs/base/BaseDialog.vue';
import FormFiltros from '@/components/forms/core/FormFiltros.vue';

import ConsultaRegistrosFiltro from './fixtures/consulta/ConsultaRegistrosFiltro.vue';
import DrawerFiltroLeft from './fixtures/drawers/DrawerFiltroLeft.vue';
import DrawerFiltroRight from './fixtures/drawers/DrawerFiltroRight.vue';

/**
 * @property {object[]} registros - Registros para consulta auxiliar.
 * @property {TCampoFiltroMapeado[]} camposDisponiveis - Campos disponíveis para filtro.
 * @property {string} contextoLocal - Contexto local do filtro.
 * @property {TFiltroConsultaSerializado[]} filtrosIniciais - Filtros serializáveis iniciais do contexto local.
 * @property {boolean} modoLocal - Modo local do filtro, usado quando não se deseja utilizar a store, como no helper para o rbac.
 */
type TProps = {
  registros?: object[];
  camposDisponiveis: TCampoFiltroMapeado[];
  contextoLocal?: string;
  filtrosIniciais?: TFiltroConsultaSerializado[];
  modoLocal?: boolean;
};
const props = withDefaults(defineProps<TProps>(), {
  contextoLocal: 'dialog-filtro-local',
  filtrosIniciais: () => [],
  modoLocal: false,
  registros: () => [],
});

type TEmits = {
  onAplicarFiltros: [filtros: TFiltroConsultaSerializado[]];
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
function limparFiltros(): void {
  genericFilterStore.clearAll();
  aplicarFiltros();
  toggleLeftDrawer.value = true;
}

function aplicarFiltros(): void {
  const filtros = genericFilterStore.filtersApplied.map((pFiltro) => ({ ...pFiltro }));

  if (props.modoLocal) {
    emits('onAplicarFiltros', filtros);
    exibirFiltros.value = false;

    return;
  }

  genericFilterStore.confirmarAplicacaoFiltros();
  emits('onAplicarFiltros', filtros);
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
watch(
  () => genericFilterStore.appliedCount,
  (pNewValue) => {
    toggleRightDrawer.value = pNewValue > 0;
  },
  { immediate: true },
);

watch(
  exibirFiltros,
  (pExibir) => {
    if (!props.modoLocal) {
      return;
    }

    if (pExibir) {
      genericFilterStore.ativarContextoTemporario(props.contextoLocal, props.camposDisponiveis, props.filtrosIniciais);
      return;
    }

    genericFilterStore.desativarContextoTemporario();
  },
  { immediate: true },
);
</script>

<style src="./DialogFiltro.scss" scoped lang="scss"></style>
