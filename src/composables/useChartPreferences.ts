import { computed, type MaybeRefOrGetter,toValue, watch } from 'vue';

import { usePreferencesStore } from '@/stores/preferences.store';

import type { IChartPreferences } from '@/models/components/IPreferences';
import type { ICampoAgrupamento } from '@/models/filters/ICampoFiltro';

export function useChartPreferences(
  pContexto: string,
  pOpcoesAgrupamento: MaybeRefOrGetter<ICampoAgrupamento[]>,
  pPadrao: Partial<IChartPreferences> = {},
) {
  const preferencesStore = usePreferencesStore();

  const preferenciaPadrao = computed<IChartPreferences>(() => ({
    visible: false,
    grouping: toValue(pOpcoesAgrupamento)[0]?.valor ?? '',
    type: 'donut',
    showLegend: true,
    showLabels: true,
    ...pPadrao,
  }));

  const preferenciaAtual = computed(() =>
    preferencesStore.getChartPreferences(pContexto, preferenciaPadrao.value),
  );

  function criarModelo<TKey extends keyof IChartPreferences>(pChave: TKey) {
    return computed<IChartPreferences[TKey]>({
      get: () => preferenciaAtual.value[pChave],
      set: (pValor) => {
        preferencesStore.updateChartPreferences(pContexto, { [pChave]: pValor }, preferenciaPadrao.value);
      },
    });
  }

  const visible = criarModelo('visible');
  const grouping = criarModelo('grouping');
  const type = criarModelo('type');
  const showLegend = criarModelo('showLegend');
  const showLabels = criarModelo('showLabels');

  watch(
    () => toValue(pOpcoesAgrupamento).map((pOpcao) => pOpcao.valor),
    (pValoresDisponiveis) => {
      if (pValoresDisponiveis.length > 0 && !pValoresDisponiveis.includes(grouping.value)) {
        grouping.value = pValoresDisponiveis[0];
      }
    },
    { immediate: true },
  );

  return { visible, grouping, type, showLegend, showLabels };
}
