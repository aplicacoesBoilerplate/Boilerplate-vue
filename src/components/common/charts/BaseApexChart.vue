<template>
  <v-card
    class="pa-3 bg-surface border d-flex flex-column w-100 h-100"
    elevation="4"
    rounded="bs-xl te-xl"
  >
    <v-card-title class="d-flex align-center ga-2 px-0 pt-0 flex-wrap">
      <div class="text-subtitle-1 font-weight-bold text-truncate flex-grow-1">
        {{ tituloAgrupamento }}
      </div>

      <v-spacer />

      <ChartControls
        v-model="tipoGrafico"
        v-model:filtroSelecionado="filtroSelecionado"
        v-model:exibirLegenda="exibirLegenda"
        v-model:exibirRotulos="exibirRotulos"
        :opcoesFiltro="opcoesFiltro"
      />
    </v-card-title>

    <v-card-text class="pa-0 flex-grow-1 d-flex flex-column justify-center overflow-hidden">
      <div
        v-if="possuiDados"
        class="w-100"
      >
        <VueApexCharts
          :key="chaveRenderizacao"
          :type="tipoGraficoApex"
          :height="altura"
          :options="opcoesGrafico"
          :series="seriesGrafico"
        />
      </div>

      <div
        v-else
        class="d-flex flex-column align-center justify-center py-10 text-medium-emphasis"
      >
        <v-icon
          icon="mdi-chart-pie-off"
          size="40"
          class="mb-2"
        />
        <span class="text-caption">{{ t('components.baseChart.semDados') }}</span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTheme } from 'vuetify';

import type { IValorGrafico } from '@/models/components/IValorGrafico';
import type { IHeadersDataTable } from '@/models/components/lHeaderTable';
import type { TDadoGrafico } from '@/models/components/TDadoGrafico';
import type { ICampoFiltro } from '@/models/filters/ICampoFiltro';
import type { ApexOptions } from 'apexcharts';

import { gerarCores } from '@/utils/generateColors';

import ChartControls from './ChartControls.vue';

type TTipoGrafico = 'donut' | 'pie' | 'bar' | 'barHorizontal' | 'line' | 'radialBar';
type TTipoGraficoApex = 'donut' | 'pie' | 'bar' | 'line' | 'radialBar';

type TMapeamentoCoresGrafico = Record<string, string>;

type TProps = {
  dados: IValorGrafico[] | TDadoGrafico[];
  opcoesFiltro: ICampoFiltro<unknown>[];
  configuracaoAtiva?: IHeadersDataTable;
  altura?: number;
  tipoInicial?: TTipoGrafico;
  mapeamentoCores?: TMapeamentoCoresGrafico;
};

const props = withDefaults(defineProps<TProps>(), {
  configuracaoAtiva: undefined,
  altura: 320,
  tipoInicial: 'donut',
  mapeamentoCores: () => ({}),
});

const theme = useTheme();
const { t } = useI18n();

// eslint-disable-next-line @typescript-eslint/naming-convention
const VueApexCharts = defineAsyncComponent(() => import('vue3-apexcharts'));

const filtroSelecionado = defineModel<string>('filtroSelecionado', { required: true });

const tipoGrafico = ref<TTipoGrafico>(props.tipoInicial);
const exibirLegenda = ref(true);
const exibirRotulos = ref(true);

const possuiDados = computed(() => props.dados.length > 0);
const ehBarraHorizontal = computed(() => tipoGrafico.value === 'barHorizontal');
const ehTipoCircular = computed(() => tipoGrafico.value === 'donut' || tipoGrafico.value === 'pie');
const ehTipoRadial = computed(() => tipoGrafico.value === 'radialBar');
const ehTipoLinha = computed(() => tipoGrafico.value === 'line');

const tipoGraficoApex = computed<TTipoGraficoApex>(() => {
  if (tipoGrafico.value === 'barHorizontal') return 'bar';
  return tipoGrafico.value;
});

const totalValor = computed(() => props.dados.reduce((pTotal, pItem) => pTotal + (pItem as IValorGrafico).valor, 0));

const labelCentro = computed(() => {
  return props.configuracaoAtiva?.chartAggregator === 'sum'
    ? t('components.baseChart.totalAcumulado')
    : t('components.baseChart.registrosTotais');
});

const tituloAgrupamento = computed(() => {
  const campo = props.configuracaoAtiva?.title.toLocaleLowerCase() ?? t('components.baseChart.categoria');
  return t('components.baseChart.tituloAgrupamento', { campo });
});

const labelsGrafico = computed(() => props.dados.map((pItem) => extrairRotulo(pItem)));
const coresGrafico = computed(() => props.dados.map((pItem) => resolverCor(pItem)));
const chaveRenderizacao = computed(() => `${tipoGrafico.value}-${filtroSelecionado.value}`);

const seriesGrafico = computed<number[] | { name: string; data: number[] }[]>(() => {
  if (ehTipoLinha.value) {
    return [
      {
        name: props.configuracaoAtiva?.title ?? t('messages.value'),
        data: props.dados.map((pItem) => (pItem as IValorGrafico).valor),
      },
    ];
  }

  if (ehTipoRadial.value) {
    return props.dados.map((pItem) => (pItem as IValorGrafico).valor);
  }

  if (tipoGrafico.value === 'bar' || ehBarraHorizontal.value) {
    return [
      {
        name: props.configuracaoAtiva?.title ?? t('messages.value'),
        data: props.dados.map((pItem) => (pItem as IValorGrafico).valor),
      },
    ];
  }

  return props.dados.map((pItem) => (pItem as IValorGrafico).valor);
});

const opcoesGrafico = computed<ApexOptions>(() => {
  const textoBase = theme.current.value.dark ? '#FFFFFF' : '#263238';

  const base: ApexOptions = {
    chart: {
      toolbar: { show: false },
      foreColor: textoBase,
      animations: { enabled: true, speed: 300 },
    },
    colors: coresGrafico.value,
    labels: ehTipoRadial.value ? undefined : labelsGrafico.value,
    legend: {
      show: exibirLegenda.value,
      position: 'bottom',
      fontSize: '13px',
    },
    dataLabels: {
      enabled: exibirRotulos.value,
      formatter: (pValor: number) => formatarRotuloDados(pValor),
    },
    tooltip: {
      theme: theme.current.value.dark ? 'dark' : 'light',
      fillSeriesColor: false,
      marker: { show: true },
      y: {
        formatter: (pValor: number) => `${formatarNumero(pValor)} (${calcularPorcentagem(pValor)}%)`,
      },
    },
    noData: { text: t('components.baseChart.semDados') },
  };

  if (ehTipoLinha.value) {
    return {
      ...base,
      stroke: { curve: 'smooth', width: 2 },
      markers: { size: 4 },
      xaxis: {
        categories: labelsGrafico.value,
        labels: { trim: true },
      },
      yaxis: {
        labels: {
          formatter: (pValor: number | string) => formatarNumero(Number(pValor)),
        },
      },
      grid: {
        borderColor: theme.current.value.dark ? '#3A3A3A' : '#E0E0E0',
      },
    };
  }

  if (ehTipoRadial.value) {
    return {
      ...base,
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 135,
          track: { background: theme.current.value.dark ? '#2a2a2a' : '#e0e0e0' },
          dataLabels: {
            name: { show: true, fontSize: '14px' },
            value: { show: true, fontSize: '18px', formatter: (pValor: number) => `${pValor}%` },
            total: {
              show: true,
              label: labelCentro.value,
              formatter: () => formatarNumero(totalValor.value),
            },
          },
        },
      },
    };
  }

  if (ehTipoCircular.value) {
    return {
      ...base,
      plotOptions: {
        pie: {
          donut: {
            size: '68%',
            labels: {
              show: tipoGrafico.value === 'donut',
              total: {
                show: true,
                label: labelCentro.value,
                formatter: () => formatarNumero(totalValor.value),
              },
            },
          },
        },
      },
    };
  }

  return {
    ...base,
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '56%',
        barHeight: '56%',
        distributed: true,
        horizontal: ehBarraHorizontal.value,
      },
    },
    xaxis: {
      categories: labelsGrafico.value,
      labels: {
        rotate: ehBarraHorizontal.value ? 0 : -20,
        trim: true,
        formatter: (pValor: string) => (ehBarraHorizontal.value ? formatarNumero(Number(pValor)) : pValor),
      },
    },
    yaxis: {
      labels: {
        formatter: (pValor: number | string) => {
          return ehBarraHorizontal.value ? String(pValor) : formatarNumero(Number(pValor));
        },
      },
    },
    grid: {
      borderColor: theme.current.value.dark ? '#3A3A3A' : '#E0E0E0',
    },
  };
});

function extrairRotulo(pItem: IValorGrafico | TDadoGrafico): string {
  if ('titulo' in pItem) {
    const valorOriginal = pItem.valorOriginal ?? pItem.titulo;
    if (props.configuracaoAtiva?.chartFormatter) {
      return props.configuracaoAtiva.chartFormatter(valorOriginal);
    }
    return formatarNumeroOuTexto(valorOriginal);
  }
  return pItem.rotulo;
}

function formatarNumero(pValor: number): string {
  return pValor.toLocaleString();
}

function formatarNumeroOuTexto(pValor: unknown): string {
  if (typeof pValor === 'boolean') return pValor ? t('messages.yes') : t('messages.no');
  if (typeof pValor === 'number') return pValor.toLocaleString();
  return String(pValor);
}

function formatarRotuloDados(pValor: number): string {
  if (ehTipoCircular.value) return `${Number(pValor).toFixed(1)}%`;
  return formatarNumero(pValor);
}

function calcularPorcentagem(pValor: number): string {
  if (!totalValor.value) return '0';
  return ((pValor / totalValor.value) * 100).toFixed(1);
}

function resolverCor(pItem: IValorGrafico | TDadoGrafico): string {
  const rotulo = 'titulo' in pItem ? String(pItem.valorOriginal ?? pItem.titulo) : pItem.rotulo;

  if (props.mapeamentoCores[rotulo]) {
    return theme.current.value.colors[props.mapeamentoCores[rotulo]] ?? props.mapeamentoCores[rotulo];
  }

  if ('cor' in pItem && pItem.cor && !['#000000', '#000', 'black'].includes(pItem.cor.toLowerCase())) {
    return temaCor(pItem.cor);
  }

  return gerarCores(rotulo);
}

function temaCor(pCor: string): string {
  return theme.current.value.colors[pCor] ?? pCor;
}
</script>
