<template>
  <div class="d-flex justify-center">
    <v-card class="pa-6" elevation="6" rounded="xl" width="100%" >

      <v-card-title class="d-flex align-center justify-space-between">
        <div class="text-truncate mr-6 text-subtitle-1 font-weight-bold">
          Distribuições
        </div>
        <v-select
          v-model="filtroSelecionado"
          :items="filterOptions"
          item-title="title"
          item-value="value"
          density="compact"
          label="Agrupar por"
          max-width="200"
          variant="solo-filled"
          flat
          hide-details
          single-line
        />
      </v-card-title>

      <div v-if="chartData.length > 0">
        <v-pie
          :items="chartData"
          :legend="{ position: 'right' }"
          :tooltip="{ subtitleFormat: '<b>[value]</b> registros' }"
          class="pa-3 mt-3 justify-center"
          gap="2"
          inner-cut="60"
          item-key="key"
          rounded="4"
          size="280"
          animation
          reveal
        >
          <template v-slot:center>
            <div class="text-center">
              <div class="text-h4 font-weight-bold">{{ totalValue }}</div>
              <div class="text-caption text-medium-emphasis">Registros</div>
            </div>
          </template>

          <template v-slot:legend="{ items, toggle, isActive }">
            <v-list class="py-0 mt-4 bg-transparent" density="compact">
              <v-list-item
                v-for="item in items"
                :key="item.key"
                :class="['mb-1', { 'opacity-40': !isActive(item) }]"
                rounded="lg"
                link
                @click="toggle(item)"
              >
                <template v-slot:prepend>
                  <v-avatar :color="item.color" size="12" class="mr-2" />
                </template>

                <v-list-item-title class="text-caption font-weight-medium">
                  {{ item.title }}
                </v-list-item-title>

                <template v-slot:append>
                  <span class="text-caption font-weight-bold ms-2">{{ item.value }}</span>
                </template>
              </v-list-item>
            </v-list>
          </template>
        </v-pie>
      </div>

      <div v-else class="d-flex flex-column align-center justify-center py-10 opacity-60">
        <v-icon icon="mdi-chart-pie-off" size="40" class="mb-2" />
        <span class="text-caption">Sem dados para exibir</span>
      </div>

    </v-card>
  </div>
</template>

<script setup lang="ts">
import type { ValueDataChart } from '@/classes/models/modelComponents/ModelGridDataChart';
import { computed } from 'vue';

const props = defineProps<{
  chartData: ValueDataChart[];
  filterOptions: { title: string; value: string }[];
}>();

const filtroSelecionado = defineModel<string>('selectedFilter', { required: true });

const totalValue = computed(() => {
  return props.chartData.reduce((acc, curr) => acc + curr.value, 0);
});
</script>
