<template>
  <v-row
    class="prevent-jump-desktop align-stretch ma-0 w-100"
    density="compact"
  >
    <v-col
      :md="hiddenChart ? 12 : 6"
      cols="12"
      class="col-transition overflow-hidden d-flex"
    >
      <div class="w-100 h-100">
        <slot
          :toggleChart="() => emit('toggle-chart')"
          name="dataTable"
        />
      </div>
    </v-col>

    <Transition name="expand-charts">
      <v-col
        v-show="!hiddenChart"
        cols="12"
        md="6"
        class="scroll-offset overflow-hidden d-flex"
        ref="refCharts"
        tabindex="-1"
      >
        <div
          v-if="!hiddenChart"
          class="fill-height w-100 d-flex"
        >
          <slot name="dataChart" />
        </div>
      </v-col>
    </Transition>
  </v-row>
  <div class="w-100 mt-5">
    <slot name="moreInfo" />
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';

import type { ComponentPublicInstance } from 'vue';

const props = defineProps<{
  hiddenChart: boolean;
}>();

const emit = defineEmits<{
  (e: 'toggle-chart'): void;
}>();

defineSlots<{
  dataTable(pProps: { toggleChart: () => void }): unknown;
  dataChart(): unknown;
  moreInfo(): unknown;
}>();

const refCharts = ref<HTMLElement | ComponentPublicInstance | null>(null);

watch(
  () => props.hiddenChart,
  (pIsHidden) => {
    if (!pIsHidden) {
      nextTick(() => {
        const chartRef = refCharts.value;
        const el = chartRef instanceof HTMLElement ? chartRef : chartRef?.$el;
        if (el) {
          el.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'nearest',
          });
        }
      });
    }
  },
);
</script>

<style scoped>
.bg-primary-lighten-4 {
  background-color: rgba(var(--v-theme-primary), 0.1) !important;
}

.col-transition {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  min-width: 0;
  max-width: 100%;
  transition:
    flex-basis 300ms cubic-bezier(0.4, 0, 0.2, 1),
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
