<template>
  <v-card flat border rounded="lg">
    <v-card-title>
      <div class="d-flex align-center">
        <v-menu :close-on-content-click="false">
          <template v-slot:activator="{ props }">
            <v-icon-btn
              v-bind="props"
              icon="mdi-table-cog"
              v-tooltip="'Colunas da tabela'"
              variant="plain"
              color="primary"
            />
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

        <v-divider
          vertical
          class="mx-2 my-auto"
          style="height: 24px"
          :thickness="3"
        />

        <div class="text-h6 font-weight-bold text-high-emphasis text-truncate">
          {{ dataTable.model.titleTable || 'Resultados' }}
        </div>

        <v-spacer />

        <v-icon-btn
          icon="mdi-plus-circle-outline"
          v-tooltip="'Novo registro'"
        />

        <v-divider
          vertical
          class="mx-2 my-auto"
          style="height: 24px"
          :thickness="3"
        />

        <v-icon-btn
          icon="mdi-chart-donut-variant"
          v-tooltip="'Gráfico'"
          @click="toggleChart"
        />
      </div>
    </v-card-title>

    <v-divider :thickness="3" />

    <v-card-text class="pa-0">
      <v-data-table-virtual
        v-if="dataTable.model.itemsTable && dataTable.model.itemsTable.length > 0"
        :headers="filteredHeaders"
        :items="dataTable.model.itemsTable"
        :height="dataTable.model.heightTable || 'auto'"
        :max-height="dataTable.model.maxHeightTable || 500"
        :loading="dataTable.model.loadingDataTable"
        fixed-header
        density="compact"
        hover
        :row-props="propsDaLinha"
        @click:row="aoClicarNaLinha"
        :mobile-breakpoint="0"
      >
        <template v-slot:loading>
          <v-skeleton-loader type="table-row@6"></v-skeleton-loader>
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex justify-center gap-2">

            <v-icon-btn
              icon="mdi-pencil"
              variant="plain"
              color="primary"
              v-tooltip="'Editar'"
            />

            <v-icon-btn
              icon="mdi-delete"
              variant="plain"
              color="error"
              v-tooltip="'Excluir'"
            />
          </div>
        </template>
      </v-data-table-virtual>

      <div v-else class="d-flex flex-column align-center justify-center py-10 text-medium-emphasis">
        <v-icon icon="mdi-database-off" size="48" class="mb-2"></v-icon>
        <div class="text-body-1">Nenhum dado encontrado</div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { IModelValueDataTable } from "@/classes/models/modelComponents/ModelGridDataChart";
import { ref, computed, watchEffect } from "vue";

const dataTable = defineModel<IModelValueDataTable<any>>('dataTable', { required: true });

const emits = defineEmits<{
  (e: 'item-selecionado', item: any[]): void;
  (e: 'toggle-chart'): void;
}>();

const allHeaders = computed(() => {
  return dataTable.value.model.headersTable.map((header) => ({
    ...header,
    title: header.title,
    align: header.align || 'start',
    key: header.key,
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

function toggleChart() {
  emits('toggle-chart');
}

</script>
