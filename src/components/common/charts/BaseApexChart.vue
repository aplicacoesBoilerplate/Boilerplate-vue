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

    <v-card-text class="chart-content pa-0 flex-grow-1 d-flex flex-column justify-center">
      <div
        v-if="possuiDados"
        class="chart-container w-100"
      >
        <componenteVueApexCharts
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
// Ecossistema Vue
import { computed, defineAsyncComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTheme } from 'vuetify';

// Models
import type { IValorGrafico } from '@/models/components/IValorGrafico';
import type { IHeadersDataTable } from '@/models/components/lHeaderTable';
import type { TChartType } from '@/models/components/TChartType';
import type { TDadoGrafico } from '@/models/components/TDadoGrafico';
import type { ICampoAgrupamento } from '@/models/filters/ICampoFiltro';
import type { ApexOptions } from 'apexcharts';

// Utils
import { gerarCores } from '@/utils/gerarCores.ts';

// Componentes
import ChartControls from './ChartControls.vue';

type TTipoGraficoApex = 'donut' | 'pie' | 'bar' | 'line' | 'radialBar';
type TMapeamentoCoresGrafico = Record<string, string>;

type TProps = {
  dados: IValorGrafico[] | TDadoGrafico[];
  opcoesFiltro: ICampoAgrupamento[];
  configuracaoAtiva?: IHeadersDataTable;
  altura?: number;
  tipoInicial?: TChartType;
  mapeamentoCores?: TMapeamentoCoresGrafico;
};
const props = withDefaults(defineProps<TProps>(), {
  configuracaoAtiva: undefined,
  altura: 320,
  tipoInicial: 'donut',
  mapeamentoCores: () => ({}),
});

// Composables
const theme = useTheme();
const { t } = useI18n();

// Importação dinâmica do componente vue3-apexcharts
const componenteVueApexCharts = defineAsyncComponent(() => import('vue3-apexcharts'));

// Reativas - Model
const filtroSelecionado = defineModel<string>('filtroSelecionado', { required: true });
const tipoGraficoModel = defineModel<TChartType>('tipoGrafico');
const exibirLegenda = defineModel<boolean>('exibirLegenda', { default: true });
const exibirRotulos = defineModel<boolean>('exibirRotulos', { default: true });
const tipoGrafico = computed<TChartType>({
  get: () => tipoGraficoModel.value ?? props.tipoInicial,
  set: (pTipo) => {
    tipoGraficoModel.value = pTipo;
  },
});

// Funções
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

// Computadas
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
const valoresBrutos = computed(() => props.dados.map((pItem) => (pItem as IValorGrafico).valor));
const coresGrafico = computed(() => gerarCores(props.dados.length));
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
    if (!totalValor.value) return valoresBrutos.value.map(() => 0);
    return valoresBrutos.value.map((pValor) => (pValor / totalValor.value) * 100);
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
    labels: labelsGrafico.value,
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
        formatter: (pValor: number, pContexto) => {
          const valorBruto = ehTipoRadial.value
            ? valoresBrutos.value[pContexto?.seriesIndex ?? 0] ?? 0
            : pValor;
          const porcentagem = ehTipoRadial.value ? pValor.toFixed(1) : calcularPorcentagem(pValor);
          return `${formatarNumero(valorBruto)} (${porcentagem}%)`;
        },
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
            value: {
              show: true,
              fontSize: '18px',
              formatter: (pValor: number) => `${Number(pValor).toFixed(1)}%`,
            },
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
</script>

<style scoped>
.chart-content,
.chart-container {
  overflow: visible;
  position: relative;
}

.chart-container {
  z-index: 1;
}

:deep(.apexcharts-tooltip) {
  z-index: 20 !important;
}
</style>
