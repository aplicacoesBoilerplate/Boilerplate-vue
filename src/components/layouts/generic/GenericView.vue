<template>
  <v-card
    flat
    height="100%"
    width="100%"
  >
    <section class="d-flex flex-column fill-height overflow-hidden">
      <template v-if="$slots['default']">
        <v-card-title class="d-flex align-center pa-4 pb-0">
          <template v-if="titulo">
            <v-card-title class="pl-0">{{ titulo }}</v-card-title>
          </template>

          <v-spacer />

          <slot name="list-header-actions">
            <template v-if="$slots['list-header-actions']" />
          </slot>

          <template v-if="$slots['activator-novo-registro'] || exibirGraficos">
            <div v-if="exibirGraficos">
              <v-tooltip
                :text="t('components.genericView.toggleChart')"
                location="bottom"
              >
                <template #activator="{ props: tooltipProps }">
                  <v-btn
                    v-bind="tooltipProps"
                    :icon="exibirGraficosAtivos ? 'mdi-chart-bar' : 'mdi-chart-bar-off'"
                    color="primary"
                    size="x-small"
                    variant="tonal"
                    @click="alternarGraficos"
                  />
                </template>
              </v-tooltip>
            </div>

            <BtnActionDrawer
              top="28px"
              right="6px"
              width="160px"
              absolute
            >
              <div class="d-flex flex-row ga-2">
                <slot name="list-header-actions" />

                <MenuExportacaoDados
                  v-if="exibirExportacao && serviceExportacao"
                  :contexto="contexto"
                  :metodo="serviceExportacao"
                  :parametros="parametrosExportacao"
                  :colunas="colunasExportacao"
                  :nomeArquivo="nomeArquivoExportacao || contexto"
                />

                <v-tooltip
                  v-if="exibirNovoRegistro"
                  :text="t('tooltips.forms.create')"
                  location="bottom"
                >
                  <template #activator="{ props }">
                    <slot
                      :acionarNovoRegistro="() => emitirNovoRegistro({ modoEdicao: false })"
                      :tooltipProps="props"
                      name="activator-novo-registro"
                    >
                      <v-btn
                        v-bind="props"
                        color="primary"
                        icon="mdi-plus"
                        size="x-small"
                        @click="emitirNovoRegistro({ modoEdicao: false })"
                      />
                    </slot>
                  </template>
                </v-tooltip>
              </div>
            </BtnActionDrawer>
          </div>
        </v-card-title>


      </template>

      <section class="fill-height d-flex flex-column overflow-y-auto">
        <GenericInfiniteList
          ref="infiniteListRef"
          :cacheTtlMs="cacheTtlMs"
          :contexto="contexto"
          :itemKey="itemKey"
          :limite="limite"
          :opcoesLimite="opcoesLimite"
          :ordemInicial="ordemInicial"
          :serviceFetch="serviceFetch"
          :storage="storage"
          :textoError="textoError"
          :textoFinal="textoFinal"
          :textoVazio="textoVazio"
          :usarFiltrosGlobais="usarFiltrosGlobais"
          @novoRegistro="emitirNovoRegistro({ modoEdicao: false })"
        >
          <template #default="slotProps">
            <slot
              :items="slotProps.items"
              name="default"
            />
          </template>
          <template #error>
            <slot name="error" />
          </template>
        </GenericInfiniteList>
      </section>
    </section>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import type { IConsultaRegistros, IResultadoConsultaRegistros } from '@/models/consulta/IConsultaRegistros';
import type { TMetodoExportacaoDados } from '@/models/components/IExportacaoDados';
import type { IHeadersDataTable } from '@/models/components/lHeaderTable';
import type { TOrdem } from '@/models/filters/IConsultaRegistrosFiltro';
import type { TManagerStorageLocation } from '@/utils/ManagerStorage';

import BtnActionDrawer from '@/components/layouts/base/appbar/fixtures/BtnActionDrawer.vue';
import GridDataChart from '@/components/layouts/GridDataChart.vue';

import MenuExportacaoDados from './fixtures/MenuExportacaoDados.vue';
import GenericInfiniteList from './GenericInfiniteList/GenericInfiniteList.vue';

type TProps = {
  cacheTtlMs?: number;
  contexto: string;
  textoVazio?: string;
  textoFinal?: string;
  textoError?: string;
  limite?: number;
  ordemInicial?: TOrdem;
  itemKey?: string;
  opcoesLimite?: number[];
  serviceFetch: (payload: IConsultaRegistros) => Promise<IResultadoConsultaRegistros>;
  serviceExportacao?: TMetodoExportacaoDados;
  parametrosExportacao?: Record<string, unknown>;
  colunasExportacao?: IHeadersDataTable[];
  nomeArquivoExportacao?: string;
  exibirExportacao?: boolean;
  exibirNovoRegistro?: boolean;
  exibirGraficos?: boolean;
  storage?: TManagerStorageLocation;
  titulo?: string;
  usarFiltrosGlobais?: boolean;
};

const props = withDefaults(defineProps<TProps>(), {
  cacheTtlMs: 15 * 60 * 1000,
  textoVazio: undefined,
  textoFinal: undefined,
  textoError: undefined,
  limite: undefined,
  ordemInicial: undefined,
  itemKey: undefined,
  opcoesLimite: () => [10, 25, 50, 100],
  serviceExportacao: undefined,
  parametrosExportacao: () => ({}),
  colunasExportacao: () => [],
  nomeArquivoExportacao: '',
  exibirExportacao: true,
  exibirNovoRegistro: true,
  exibirGraficos: false,
  storage: 'session',
  titulo: '',
  usarFiltrosGlobais: true,
});

type TEmits = {
  novoRegistro: [{ modoEdicao: boolean }];
  toggleChart: [];
};

const emits = defineEmits<TEmits>();

const { t } = useI18n();

const infiniteListRef = ref<InstanceType<typeof GenericInfiniteList> | null>(null);
const exibirGraficosAtivos = ref(false);

function emitirNovoRegistro(pParams: { modoEdicao: boolean }): void {
  emits('novoRegistro', pParams);
}

function alternarGraficos(): void {
  exibirGraficosAtivos.value = !exibirGraficosAtivos.value;
  emits('toggleChart');
}

const textoVazioPadrao = computed(() => props.textoVazio ?? t('components.genericInfiniteList.textoVazio'));
const textoFinalPadrao = computed(() => props.textoFinal ?? t('components.genericInfiniteList.textoFinal'));
const textoErrorPadrao = computed(() => props.textoError ?? t('components.genericInfiniteList.textoErro'));

defineExpose({
  infiniteListRef,
  loadMore: (...pArgs: Parameters<InstanceType<typeof GenericInfiniteList>['loadMore']>) =>
    infiniteListRef.value?.loadMore(...pArgs),
  resetAndLoad: () => infiniteListRef.value?.resetAndLoad(),
  carregarMaisRegistros: (...pArgs: Parameters<InstanceType<typeof GenericInfiniteList>['carregarMaisRegistros']>) =>
    infiniteListRef.value?.carregarMaisRegistros(...pArgs),
  resetarECarregar: () => infiniteListRef.value?.resetarECarregar(),
  inserirItem: (pItem: unknown) => infiniteListRef.value?.inserirItem(pItem),
  atualizarItem: <TItem extends object>(
    pIdField: keyof TItem,
    pIdValue: TItem[keyof TItem],
    pNewValues: Partial<TItem>,
  ) => infiniteListRef.value?.atualizarItem(pIdField, pIdValue, pNewValues),
  removerItem: <TItem extends object>(pIdField: keyof TItem, pIdValue: TItem[keyof TItem]) =>
    infiniteListRef.value?.removerItem(pIdField, pIdValue),
  exibirGraficosAtivos,
  alternarGraficos,
});
</script>
