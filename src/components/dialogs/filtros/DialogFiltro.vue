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
          v-model:selectedField="selectedField"
          :camposDisponiveis="camposDisponiveis"
        />

        <DrawerFiltroRight
          v-model:toggleRightDrawer="toggleRightDrawer"
          v-model:selectedField="selectedField"
          :camposDisponiveis="camposDisponiveis"
        />

        <v-main class="ma-2">
          <FormFiltros
            :selectedField="selectedField"
            :registros="registros"
          />
        </v-main>
      </v-layout>
    </template>

    <template #actions="slotProps">
      <v-btn
        color="error"
        variant="tonal"
        text="CANCELAR"
        @click="slotProps.onCancelar"
      />

      <v-spacer />

      <v-btn
        color="red-darken-1"
        variant="outlined"
        text="LIMPAR FILTROS"
        :loading="loading"
        @click="handleOnLimparFiltros"
      />

      <v-btn
        color="indigo-darken-4"
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
import { mergeProps, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

// Stores
import { useGenericFilterStore } from '@/stores/genericFilter.store';

// Types e Interfaces
import type { ICampoFiltro } from '@/models/filters/ICampoFiltro';

// Componentes
import BaseDialog from '../BaseDialog.vue';
import DrawerFiltroLeft from './fixtures/drawers/DrawerFiltroLeft.vue';
import DrawerFiltroRight from './fixtures/drawers/DrawerFiltroRight.vue';
import FormFiltros from '../../forms/FormFiltros.vue';

type TProps = {
  registros?: any[];
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
const { t } = useI18n();

// Reativas - Model
const exibirFiltros = defineModel<boolean>('exibirFiltros', { required: false });

// Reativas - ref
const toggleLeftDrawer = ref<boolean>(true);
const toggleRightDrawer = ref<boolean>(false);
const loading = ref<boolean>(false);

const selectedField = ref<ICampoFiltro<any> | null>(null);

// Funções
function handleOnLimparFiltros() {
  genericFilterStore.clearAll();
  handleOnAplicarFiltros();
}

function handleOnAplicarFiltros() {
  emits('onAplicarFiltros');
  exibirFiltros.value = false;
}

// Observadores
watch(() => genericFilterStore.appliedCount, (newValue) => {
  toggleRightDrawer.value = newValue > 0;
}, { immediate: true });
</script>

<style scoped>
.small-badge :deep(.v-badge__badge) {
  font-size: 0.65rem;
  min-width: 16px;
  height: 16px;
  line-height: 16px;
  padding: 0 4px;
}
</style>
