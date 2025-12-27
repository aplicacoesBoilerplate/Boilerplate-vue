<template>
  <v-row class="prevent-jump-desktop">
    <v-col
      cols="12"
      :md="hiddenChart ? 12 : 6"
      class="col-transition overflow-hidden"
    >
      <v-card flat border rounded="lg">
        <v-card-title>
          <div class="d-flex align-center">

            <v-menu :close-on-content-click="false">
              <template v-slot:activator="{ props }">
                <v-icon-btn v-bind="props" variant="plain" color="primary" icon="mdi-table-cog" size="small" />
              </template>

              <v-card min-width="250" max-height="400" class="overflow-y-auto">
                <v-card-title class="text-subtitle-2 pb-0">Exibir/Ocultar colunas</v-card-title>
                <v-divider class="my-2" />
                <v-list density="compact" select-strategy="classic" v-model:selected="selectedHeadersKeys">
                  <v-list-item v-for="header in allHeaders" :key="header.key" :value="header.key">
                    <template v-slot:prepend="{ isActive }">
                      <v-list-item-action>
                        <v-checkbox-btn :model-value="isActive" density="compact" hide-details />
                      </v-list-item-action>
                    </template>
                    <v-list-item-title class="text-caption">
                      {{ header.title }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>

            <v-divider vertical class="mx-2 my-auto" style="height: 24px" :thickness="3" />

            <div class="text-h6 font-weight-bold text-high-emphasis text-truncate">
              {{ title || 'Resultados' }}
            </div>

            <v-spacer />

            <v-icon-btn icon="mdi-chart-donut-variant" @click="toggleChart" />
          </div>
        </v-card-title>

        <v-divider :thickness="3" />

        <v-card-text class="pa-0">
          <div v-if="loading" class="pa-4">
            <v-skeleton-loader type="table-heading, table-row-divider@6" />
          </div>

          <v-data-table-virtual
            v-else-if="items && items.length > 0"
            :headers="filteredHeaders"
            :items="items"
            :height="height || 'auto'"
            :max-height="maxHeight || 500"
            fixed-header
            density="compact"
            hover
            :row-props="propsDaLinha"
            @click:row="aoClicarNaLinha"
            :mobile-breakpoint="0"
          >
          </v-data-table-virtual>

          <div v-else class="d-flex flex-column align-center justify-center py-10 text-medium-emphasis">
            <v-icon icon="mdi-database-off" size="48" class="mb-2"></v-icon>
            <div class="text-body-1">Nenhum dado encontrado</div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>

    <Transition name="expand-charts">
      <v-col
        v-if="!hiddenChart"
        cols="12"
        md="6"
        class="overflow-hidden scroll-offset"
        ref="refCharts"
        tabindex="-1"
      >
        <v-window
          v-model="onboarding"
          show-arrows="hover"
        >
          <v-window-item
            v-for="n in length"
            :key="`card-${n}`"
            class="w-100"
          >
            <v-card
              class="d-flex align-center justify-center ma-2 w-100"
              elevation="2"
              height="200"
            >
              <h1 class="text-h2">Slide {{ n }}</h1>
            </v-card>
          </v-window-item>
        </v-window>
      </v-col>
    </Transition>
  </v-row>
</template>

<script setup lang="ts">
import type { IHeadersDataTable } from "@/classes/models/modelComponents/ModelHeaderTable";
import { ref, computed, watchEffect, nextTick } from "vue";

const props = defineProps<{
  title?: string;
  height?: string | number;
  maxHeight?: string | number;
  color?: string;
  density?: 'comfortable' | 'compact' | 'default';
  headers: IHeadersDataTable[];
  items: any[];
  loading?: boolean;
}>();

const emits = defineEmits<{
  (e: 'item-selecionado', item: any[]): void;
}>();

const allHeaders = computed(() => {
  return props.headers.map((header) => ({
    ...header,
    title: header.title,
    align: header.align || 'start',
    key: header.key,
    minWidth: header.minWidth || 150,
    sortable: header.sortable ?? true
  }));
});

const selectedHeadersKeys = ref<string[]>([]);

watchEffect(() => {
  if (allHeaders.value.length > 0 && selectedHeadersKeys.value.length === 0) {
    selectedHeadersKeys.value = allHeaders.value.map(h => h.key);
  }
});

const filteredHeaders = computed(() => {
  return allHeaders.value.filter(h => selectedHeadersKeys.value.includes(h.key));
});

const itemSelecionadoId = ref<any>(null);

const aoClicarNaLinha = (_event: Event, { item }: any) => {
  const id = item.id || item;

  itemSelecionadoId.value = id;
  emits('item-selecionado', item);
}

const propsDaLinha = ({ item }: any) => {
  const id = item.id || item;
  if (id && id === itemSelecionadoId.value) {
    return { class: 'bg-primary-lighten-4 cursor-pointer font-weight-medium' };
  }
  return { class: 'cursor-pointer' };
};

const length = ref(3)
const onboarding = ref(0)

const hiddenChart = ref(true);
const refCharts = ref<any>(null);

function toggleChart() {
  hiddenChart.value = !hiddenChart.value;

  if (!hiddenChart.value) {
    nextTick(() => {
      const el = refCharts.value?.$el;

      if (el) {
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest'
        });

        el.focus({ preventScroll: true });
      }
    });
  }
}

</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.bg-primary-lighten-4 {
  background-color: rgba(var(--v-theme-primary), 0.1) !important;
}

.col-transition {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  min-width: 0;
  transition: flex-basis 300ms cubic-bezier(0.4, 0, 0.2, 1),
    max-width 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.expand-charts-enter-active,
.expand-charts-leave-active {
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.expand-charts-leave-from {
  opacity: 1;
  max-width: 50%;
  flex: 0 0 50%;
}

.expand-charts-enter-from,
.expand-charts-leave-to {
  opacity: 0;
  max-width: 0 !important;
  flex: 0 0 0 !important;
  min-width: 0 !important;
  padding: 0 !important;
  margin: 0 !important;
}

.scroll-offset {
  scroll-margin-top: 90px;
  outline: none;
}

@media (min-width: 960px) {
  .prevent-jump-desktop {
    flex-wrap: nowrap !important;
  }
}
</style>
