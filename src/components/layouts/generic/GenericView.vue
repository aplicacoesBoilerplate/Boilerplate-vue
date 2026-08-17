<template>
  <v-card
    height="100%"
    width="100%"
    flat
  >
    <section class="d-flex flex-column fill-height overflow-hidden">
      <template v-if="$slots['default']">
        <v-card-title class="d-flex align-center pa-4 pb-0">
          <template v-if="titulo">
            <v-card-title class="pl-0">{{ titulo }}</v-card-title>
          </template>

          <v-spacer />

          <template
            v-if="
              $slots['list-header-actions'] ||
                exibirGraficos ||
                (exibirExportacao && serviceExportacao) ||
                (exibirNovoRegistro && $slots['activator-novo-registro'])
            "
          >
            <BtnActionDrawer
              top="28px"
              right="6px"
              width="160px"
              absolute
            >
              <div class="d-flex flex-row ga-2">
                <slot name="list-header-actions" />

                <v-tooltip
                  v-if="exibirGraficos"
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
                  <template #activator="{ props: propsTooltip }">
                    <slot
                      :acionarNovoRegistro="() => emitirNovoRegistro({ modoEdicao: false })"
                      :tooltipProps="propsTooltip"
                      name="activator-novo-registro"
                    >
                      <v-btn
                        v-bind="propsTooltip"
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
          </template>
        </v-card-title>
      </template>

      <GridDataChart
        :hiddenChart="!exibirGraficos || !exibirGraficosAtivos"
        @toggleChart="alternarGraficos"
      >
        <template #dataTable>
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
              <template #header="slotProps">
                <slot
                  name="list-header"
                  v-bind="slotProps"
                >
                  <div class="d-flex align-center px-4 pb-2">
                    <v-tooltip
                      :text="
                        slotProps.ordemAtual === 'asc'
                          ? t('components.genericView.ordenarDecrescente')
                          : t('components.genericView.ordenarCrescente')
                      "
                      location="bottom"
                    >
                      <template #activator="{ props: tooltipProps }">
                        <v-btn
                          v-bind="tooltipProps"
                          :aria-label="
                            slotProps.ordemAtual === 'asc'
                              ? t('components.genericView.ordenarDecrescente')
                              : t('components.genericView.ordenarCrescente')
                          "
                          :icon="slotProps.ordemAtual === 'asc' ? 'mdi-sort-ascending' : 'mdi-sort-descending'"
                          color="primary"
                          size="x-small"
                          variant="tonal"
                          @click="slotProps.alternarOrdenacao"
                        />
                      </template>
                    </v-tooltip>
                  </div>
                </slot>
              </template>

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
        </template>

        <template #dataChart>
          <slot name="data-chart">
            <BaseApexChart
              v-model:filtroSelecionado="filtroGraficoSelecionado"
              :altura="alturaGrafico"
              :configuracaoAtiva="configuracaoGraficoAtiva"
              :dados="dadosGrafico"
              :mapeamentoCores="mapeamentoCoresGrafico"
              :opcoesFiltro="opcoesFiltroGrafico"
            />
          </slot>
        </template>
      </GridDataChart>
    </section>
  </v-card>
</template>

<script setup lang="ts" generic="TInterfaceRegistro extends object">
// Ecossistema Vue
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

// Models
import type { IGenericInfiniteListExpose } from '@/models/components/exposes/IGenericInfiniteListExpose';
import type { IGenericViewExpose } from '@/models/components/exposes/IGenericViewExpose';
import type { TMetodoExportacaoDados } from '@/models/components/IExportacaoDados';
import type { IValorGrafico } from '@/models/components/IValorGrafico';
import type { IHeadersDataTable } from '@/models/components/lHeaderTable';
import type { TDadoGrafico } from '@/models/components/TDadoGrafico';
import type { IConsultaRegistros, IRespostaConsultaRegistros } from '@/models/consulta/IConsultaRegistros';
import type { TOrdem } from '@/models/consulta/IConsultaRegistros';
import type { ICampoAgrupamento } from '@/models/filters/ICampoFiltro';
import type { TManagerStorageLocation } from '@/utils/ManagerStorage';

import BaseApexChart from '@/components/common/charts/BaseApexChart.vue';
// Componentes
import BtnActionDrawer from '@/components/layouts/base/appbar/fixtures/BtnActionDrawer.vue';
import GridDataChart from '@/components/layouts/GridDataChart.vue';

import MenuExportacaoDados from './fixtures/MenuExportacaoDados.vue';
import GenericInfiniteList from './GenericInfiniteList/GenericInfiniteList.vue';

type TProps = {
  cacheTtlMs?: number;
  dadosGrafico?: IValorGrafico[] | TDadoGrafico[];
  alturaGrafico?: number;
  configuracaoGraficoAtiva?: IHeadersDataTable;
  contexto: string;
  textoVazio?: string;
  textoFinal?: string;
  textoError?: string;
  limite?: number;
  ordemInicial?: TOrdem;
  itemKey?: string;
  mapeamentoCoresGrafico?: Record<string, string>;
  opcoesFiltroGrafico?: ICampoAgrupamento[];
  opcoesLimite?: number[];
  serviceFetch: (pPayload: IConsultaRegistros<TInterfaceRegistro>) => Promise<IRespostaConsultaRegistros<TInterfaceRegistro>>;
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
withDefaults(defineProps<TProps>(), {
  cacheTtlMs: 15 * 60 * 1000,
  dadosGrafico: () => [],
  alturaGrafico: 320,
  configuracaoGraficoAtiva: undefined,
  textoVazio: undefined,
  textoFinal: undefined,
  textoError: undefined,
  limite: undefined,
  ordemInicial: undefined,
  itemKey: undefined,
  mapeamentoCoresGrafico: () => ({}),
  opcoesFiltroGrafico: () => [],
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

// Composables
const { t } = useI18n();

// Reativas
const infiniteListRef = ref<IGenericInfiniteListExpose | null>(null);
const exibirGraficosAtivos = ref(false);
const filtroGraficoSelecionado = ref('');

function emitirNovoRegistro(pParams: { modoEdicao: boolean }): void {
  emits('novoRegistro', pParams);
}

function alternarGraficos(): void {
  exibirGraficosAtivos.value = !exibirGraficosAtivos.value;
  emits('toggleChart');
}

async function carregarMaisRegistros(
  ...pArgs: Parameters<IGenericInfiniteListExpose['carregarMaisRegistros']>
): Promise<void> {
  await infiniteListRef.value?.carregarMaisRegistros(...pArgs);
}

async function resetarECarregar(): Promise<void> {
  await infiniteListRef.value?.resetarECarregar();
}

defineExpose({
  infiniteListRef,
  loadMore: async (...pArgs) => {
    await carregarMaisRegistros(...pArgs);
  },
  resetAndLoad: async () => {
    await resetarECarregar();
  },
  carregarMaisRegistros,
  resetarECarregar,
  inserirItem: (pItem: object) => infiniteListRef.value?.inserirItem(pItem),
  atualizarItem: <TItem extends object>(
    pIdField: keyof TItem,
    pIdValue: TItem[keyof TItem],
    pNewValues: Partial<TItem>,
  ) => infiniteListRef.value?.atualizarItem(pIdField, pIdValue, pNewValues),
  removerItem: <TItem extends object>(pIdField: keyof TItem, pIdValue: TItem[keyof TItem]) =>
    infiniteListRef.value?.removerItem(pIdField, pIdValue),
  exibirGraficosAtivos,
  alternarGraficos,
} satisfies IGenericViewExpose);
</script>
