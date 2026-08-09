<template>
  <div class="d-flex align-center ga-2 flex-wrap">
    <v-select
      v-model="filtroSelecionado"
      :items="opcoesFiltro"
      :label="t('components.baseChart.inputAgrupamento.label')"
      itemTitle="descricao"
      itemValue="valor"
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
          :text="t('components.baseChart.tooltipConfiguracao')"
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
        minWidth="260"
        rounded="lg"
        class="py-1"
      >
        <v-list
          density="compact"
          nav
        >
          <v-list-subheader>{{ t('components.baseChart.secoes.visualizacao') }}</v-list-subheader>

          <v-list-item
            v-for="opcao in tiposGrafico"
            :key="opcao.valor"
            :active="modelValue === opcao.valor"
            :prependIcon="opcao.icone"
            :title="opcao.label"
            color="primary"
            rounded="lg"
            @click="$emit('update:modelValue', opcao.valor)"
          />

          <v-divider class="my-2" />

          <v-list-subheader>{{ t('components.baseChart.secoes.controles') }}</v-list-subheader>

          <v-list-item :title="t('components.baseChart.controles.legenda')">
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

          <v-list-item :title="t('components.baseChart.controles.rotulos')">
            <template #prepend>
              <v-icon icon="mdi-label-percent-outline" />
            </template>
            <template #append>
              <v-switch
                v-model="exibirRotulos"
                color="primary"
                density="compact"
                hideDetails
              />
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>

<script setup lang="ts">
import { computed, mergeProps, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import type { ICampoAgrupamento } from '@/models/filters/ICampoFiltro';

type TTipoGrafico = 'donut' | 'pie' | 'bar' | 'barHorizontal' | 'line' | 'radialBar';

type TProps = {
  opcoesFiltro: ICampoAgrupamento[];
  modelValue: TTipoGrafico;
};

type TEmits = {
  'update:modelValue': [tipo: TTipoGrafico];
  'update:exibirLegenda': [exibir: boolean];
  'update:exibirRotulos': [exibir: boolean];
};

defineProps<TProps>();
defineEmits<TEmits>();

const filtroSelecionado = defineModel<string>('filtroSelecionado', { required: true });

const exibirLegenda = defineModel<boolean>('exibirLegenda', { default: true });
const exibirRotulos = defineModel<boolean>('exibirRotulos', { default: true });

const exibirMenuConfiguracao = ref(false);

const { t } = useI18n();

const tiposGrafico = computed(() => [
  { label: t('components.baseChart.tipos.donut'), valor: 'donut' as const, icone: 'mdi-chart-donut' },
  { label: t('components.baseChart.tipos.pizza'), valor: 'pie' as const, icone: 'mdi-chart-pie' },
  { label: t('components.baseChart.tipos.colunas'), valor: 'bar' as const, icone: 'mdi-chart-bar' },
  { label: t('components.baseChart.tipos.barras'), valor: 'barHorizontal' as const, icone: 'mdi-chart-bar-stacked' },
  { label: t('components.baseChart.tipos.linha'), valor: 'line' as const, icone: 'mdi-chart-line' },
  { label: t('components.baseChart.tipos.radial'), valor: 'radialBar' as const, icone: 'mdi-chart-arc' },
]);
</script>
