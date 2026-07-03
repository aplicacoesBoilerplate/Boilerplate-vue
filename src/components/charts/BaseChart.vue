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

      <v-select
        v-model="filtroSelecionado"
        :items="opcoesFiltro"
        itemTitle="descricao"
        itemValue="valor"
        label="Agrupar por"
        maxWidth="220"
        variant="solo-filled"
        density="compact"
        rounded="te-xl"
        flat
        hideDetails
        singleLine
      >
        <template #selection="{ item }">
          <div class="d-flex align-center ga-2 text-truncate">
            <v-icon
              :icon="item.raw.icone"
              size="small"
            />
            <span class="text-truncate">{{ item.raw.descricao }}</span>
          </div>
        </template>

        <template #item="{ props: itemProps, item }">
          <v-list-item
            v-bind="itemProps"
            :prependIcon="item.raw.icone"
            color="primary"
            rounded="ts-xl be-xl"
          />
        </template>
      </v-select>

      <v-menu
        v-model="exibirMenuConfiguracao"
        :closeOnContentClick="false"
        location="bottom end"
      >
        <template #activator="{ props: menuProps }">
          <v-tooltip
            text="Configurar gráfico"
            location="bottom"
          >
            <template #activator="{ props: tooltipProps }">
              <v-btn
                v-bind="mergeProps(menuProps, tooltipProps)"
                icon="mdi-tune"
                variant="text"
                density="comfortable"
              />
            </template>
          </v-tooltip>
        </template>

        <v-card
          min-width="260"
          rounded="lg"
          class="py-1"
        >
          <v-list
            density="compact"
            nav
          >
            <v-list-subheader>Visualização</v-list-subheader>

            <v-list-item
              v-for="opcao in TIPOS_GRAFICO"
              :key="opcao.valor"
              :active="tipoGrafico === opcao.valor"
              :prepend-icon="opcao.icone"
              :title="opcao.label"
              color="primary"
              rounded="lg"
              @click="tipoGrafico = opcao.valor"
            />

            <v-divider class="my-2" />

            <v-list-subheader>Controles</v-list-subheader>

            <v-list-item title="Legenda">
              <template #prepend>
                <v-icon icon="mdi-format-list-bulleted-square" />
              </template>
              <template #append>
                <v-switch
                  v-model="exibirLegenda"
                  color="primary"
                  density="compact"
                  hideDetails
                />
              </template>
            </v-list-item>

            <v-list-item title="Rótulos">
              <template #prepend>
                <v-icon icon="mdi-label-percent-outline" />
              </template>
              <template #append>
                <v-switch
                  v-model="exibirRotulos"
                  color="primary"
                  density="compact"
                  hide-details
                />
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
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
        <span class="text-caption">Sem dados para exibir</span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed, defineAsyncComponent, mergeProps, ref } from 'vue';
import { useTheme } from 'vuetify';

// ApexCharts
import type { ApexOptions } from 'apexcharts';

// Types e Interfaces
import type { IHeadersDataTable } from '@/models/components/lHeaderTable';
import type { IValorGrafico } from '@/models/components/IValorGrafico';
import type { ICampoFiltro } from '@/models/filters/ICampoFiltro';

type TTipoGrafico = 'donut' | 'pie' | 'bar' | 'barHorizontal';

type TTipoGraficoApex = 'donut' | 'pie' | 'bar';

type TMapeamentoCoresGrafico = Record<string, string>;

/**
 * Componente genérico para renderizar gráficos categóricos (pizza, donut e barras).
 * @property {IValorGrafico[]} dados - dados usados no gráfico.
 * @property {ICampoFiltro<unknown>[]} opcoesFiltro - opcoes usadas no filtro.
 * @property {IHeadersDataTable} configuracaoAtiva - configuracao ativa do campo selecionado.
 * @property {number} altura - altura do gráfico.
 * @property {TTipoGrafico} tipoInicial - tipo inicial do gráfico.
 * @property {TMapeamentoCoresGrafico} mapeamentoCores - mapeamento opcional de valores para cores fixas.
 */
type TProps = {
  dados: IValorGrafico[];
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

// Constantes
const TIPOS_GRAFICO: { label: string; valor: TTipoGrafico; icone: string }[] = [
  { label: 'Donut', valor: 'donut', icone: 'mdi-chart-donut' },
  { label: 'Pizza', valor: 'pie', icone: 'mdi-chart-pie' },
  { label: 'Colunas', valor: 'bar', icone: 'mdi-chart-bar' },
  { label: 'Barras', valor: 'barHorizontal', icone: 'mdi-chart-bar-stacked' },
];

// Composables
const theme = useTheme();

// Componentes
const VueApexCharts = defineAsyncComponent(() => import('vue3-apexcharts'));

// Reativas - Model
const filtroSelecionado = defineModel<string>('filtroSelecionado', { required: true });

// Reativas - ref
const tipoGrafico = ref<TTipoGrafico>(props.tipoInicial);
const exibirLegenda = ref(true);
const exibirRotulos = ref(true);
const exibirMenuConfiguracao = ref(false);

// Computadas
const possuiDados = computed(() => props.dados.length > 0);
const graficoBarrasHorizontais = computed(() => tipoGrafico.value === 'barHorizontal');
const tipoGraficoApex = computed<TTipoGraficoApex>(() => resolverTipoGraficoApex(tipoGrafico.value));
const totalValor = computed(() => props.dados.reduce((pTotal, pItem) => pTotal + pItem.valor, 0));

const labelCentro = computed(() => {
  return props.configuracaoAtiva?.chartAggregator === 'sum' ? 'Total acumulado' : 'Registros totais';
});

const tituloAgrupamento = computed(() => {
  return `Agrupamento por ${props.configuracaoAtiva?.title.toLocaleLowerCase() || 'categoria'}`;
});

const labelsGrafico = computed(() => props.dados.map((pItem) => formatarAgrupador(pItem)));
const coresGrafico = computed(() => props.dados.map((pItem) => resolverCorItem(pItem)));
const chaveRenderizacao = computed(() => `${tipoGrafico.value}-${filtroSelecionado.value}`);

const seriesGrafico = computed<number[] | { name: string; data: number[] }[]>(() => {
  if (tipoGrafico.value === 'bar' || graficoBarrasHorizontais.value) {
    return [
      {
        name: props.configuracaoAtiva?.title ?? 'Valor',
        data: props.dados.map((pItem) => pItem.valor),
      },
    ];
  }

  return props.dados.map((pItem) => pItem.valor);
});

const opcoesGrafico = computed<ApexOptions>(() => {
  const textoBase = theme.current.value.dark ? '#FFFFFF' : '#263238';

  return {
    chart: {
      toolbar: {
        show: false,
      },
      foreColor: textoBase,
      animations: {
        enabled: true,
        speed: 300,
      },
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
      marker: {
        show: true,
      },
      y: {
        formatter: (pValor: number) => `${formatarNumero(pValor)} (${calcularPorcentagem(pValor)}%)`,
      },
    },
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
      bar: {
        borderRadius: 4,
        columnWidth: '56%',
        barHeight: '56%',
        distributed: true,
        horizontal: graficoBarrasHorizontais.value,
      },
    },
    xaxis: {
      categories: labelsGrafico.value,
      labels: {
        rotate: graficoBarrasHorizontais.value ? 0 : -20,
        trim: true,
        formatter: (pValor: string) => (graficoBarrasHorizontais.value ? formatarNumero(Number(pValor)) : pValor),
      },
    },
    yaxis: {
      labels: {
        formatter: (pValor: number | string) => {
          return graficoBarrasHorizontais.value ? String(pValor) : formatarNumero(Number(pValor));
        },
      },
    },
    grid: {
      borderColor: theme.current.value.dark ? '#3A3A3A' : '#E0E0E0',
    },
    noData: {
      text: 'Sem dados para exibir',
    },
  };
});

// Funções
function resolverTipoGraficoApex(pTipoGrafico: TTipoGrafico): TTipoGraficoApex {
  if (pTipoGrafico === 'barHorizontal') {
    return 'bar';
  }

  return pTipoGrafico;
}

function formatarAgrupador(pItem: IValorGrafico): string {
  const valorAgrupador = pItem.valorOriginal ?? pItem.titulo;

  if (props.configuracaoAtiva?.chartFormatter) {
    return props.configuracaoAtiva.chartFormatter(valorAgrupador);
  }

  return formatarNumeroOuTexto(valorAgrupador);
}

function formatarNumero(pValor: number): string {
  return pValor.toLocaleString();
}

function formatarNumeroOuTexto(pValor: unknown): string {
  if (typeof pValor === 'boolean') {
    return pValor ? 'Sim' : 'Não';
  }

  if (typeof pValor === 'number') {
    return pValor.toLocaleString();
  }

  return String(pValor);
}

function formatarRotuloDados(pValor: number): string {
  if (tipoGrafico.value === 'donut' || tipoGrafico.value === 'pie') {
    return `${Number(pValor).toFixed(1)}%`;
  }

  return formatarNumero(pValor);
}

function calcularPorcentagem(pValor: number): string {
  if (!totalValor.value) {
    return '0';
  }

  return ((pValor / totalValor.value) * 100).toFixed(1);
}

function resolverCorItem(pItem: IValorGrafico): string {
  const corMapeada = resolverCorMapeada(pItem);

  if (corMapeada) {
    return corMapeada;
  }

  if (pItem.cor && !['#000000', '#000', 'black'].includes(pItem.cor.toLowerCase())) {
    return pItem.cor;
  }

  return gerarCorGrafico(pItem.valorOriginal ?? pItem.titulo);
}

function resolverCorMapeada(pItem: IValorGrafico): string | undefined {
  const chaves = [
    String(pItem.valorOriginal),
    pItem.titulo,
    formatarAgrupador(pItem),
  ];

  const cor = chaves.map((pChave) => props.mapeamentoCores[pChave]).find(Boolean);

  if (!cor) {
    return undefined;
  }

  return resolverCorTema(cor);
}

function resolverCorTema(pCor: string): string {
  return theme.current.value.colors[pCor] ?? pCor;
}

function gerarCorGrafico(pValor: unknown): string {
  const texto = String(pValor);
  let hash = 0;

  for (let i = 0; i < texto.length; i += 1) {
    hash = texto.charCodeAt(i) + ((hash << 5) - hash);
  }

  const matiz = Math.abs(hash) % 360;
  const saturacao = theme.current.value.dark ? 62 : 68;
  const luminosidade = theme.current.value.dark ? 58 : 43;

  return converterHslParaHex(matiz, saturacao, luminosidade);
}

function converterHslParaHex(pMatiz: number, pSaturacao: number, pLuminosidade: number): string {
  const saturacao = pSaturacao / 100;
  const luminosidade = pLuminosidade / 100;
  const croma = (1 - Math.abs(2 * luminosidade - 1)) * saturacao;
  const x = croma * (1 - Math.abs(((pMatiz / 60) % 2) - 1));
  const ajuste = luminosidade - croma / 2;

  let vermelho = 0;
  let verde = 0;
  let azul = 0;

  if (pMatiz < 60) {
    vermelho = croma;
    verde = x;
  } else if (pMatiz < 120) {
    vermelho = x;
    verde = croma;
  } else if (pMatiz < 180) {
    verde = croma;
    azul = x;
  } else if (pMatiz < 240) {
    verde = x;
    azul = croma;
  } else if (pMatiz < 300) {
    vermelho = x;
    azul = croma;
  } else {
    vermelho = croma;
    azul = x;
  }

  return `#${[vermelho, verde, azul]
    .map((pCanal) => Math.round((pCanal + ajuste) * 255).toString(16).padStart(2, '0'))
    .join('')}`;
}
</script>
