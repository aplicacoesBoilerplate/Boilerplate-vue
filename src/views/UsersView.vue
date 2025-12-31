<template>
  <v-container fluid class="fill-height">
    <grid-data-chart
      :hidden-chart="gridConfig.modelTable.model.hiddenChart"
      @toggle-chart="toggleChartState"
    >
      <template #dataTable>
        <DataTable
          v-model:dataTable="gridConfig.modelTable"
          @item-selecionado="handleSelection"
          @toggle-chart="toggleChartState"
          @gerenciar-registro="handleGerenciarRegistro"
        />
      </template>

      <template #dataChart>
        <ChartPie
          v-model:selectedFilter="selectedChartFilter"
          :chart-data="chartDataComputed"
          :filter-options="headersParaGrafico"
          :active-config="activeHeaderConfig"
          :key="String(gridConfig.modelTable.model.hiddenChart)"
        />
      </template>
    </grid-data-chart>
  </v-container>

  <BaseDialog
    v-model:atributos="classDialogUser.model"
    @toggle-dialog="toggleDialogUsers"
  >
    <template v-slot:titulo>
      <v-icon
        size="small"
        :icon="classDialogUser.model.formModoEdicao ? 'mdi-account-edit' : 'mdi-account-plus'"
      />
      {{ classDialogUser.model.formModoEdicao ? `Editar usuário ${classDialogUser.model.itemEdicao?.idUser || ''}` : 'Cadastrar usuário' }}
    </template>

    <template v-slot:default>
      <UserForm
        ref="refFormUser"
        v-model:user="modelFormUser.model"
        v-model:valid="isFormValid"
      />
    </template>

    <template #acoes>
      <v-icon-btn
        icon="mdi-refresh"
        v-tooltip="'Limpar'"
        variant="text"
        color="amber"
        @click="resetFormUser"
      />

      <v-spacer />

      <v-icon-btn
        icon="mdi-content-save"
        v-tooltip="'Salvar'"
        variant="text"
        color="success"
        :disabled="!isFormValid"
      />
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, watchEffect, computed } from 'vue'
import { useRoute } from 'vue-router'
import { ClassGridDataChart } from '@/classes/ClassGridDataChart'
import type { IHeadersDataTable } from '@/classes/models/modelComponents/ModelHeaderTable'
import { usersServices } from '@/services/usuariosService'
import { useInfiniteList } from '@/composables/useInfiniteList'
import { useChartHelpers } from '@/composables/useChartHelpers'
import GridDataChart from '@/components/layouts/GridDataChart.vue'
import DataTable from '@/components/DataTable.vue'
import ChartPie from '@/components/ChartPie.vue'
import BaseDialog from '@/components/dialog/BaseDialog.vue'
import { ClassBaseDialog } from '@/classes/ClassBaseDialog'
import type { IUser } from '@/classes/models/ModelUser'
import UserForm from '@/components/forms/UserForm.vue'
import { ClassUsers } from '@/classes/ClassUsers'

const route = useRoute()

const formatPrice = (value: string | number) =>
  `R$ ${value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

const formatKnots = (value: string | number) => `${value} kn`

const headers: IHeadersDataTable[] = [
  { title: 'Barco', align: 'start', key: 'name', chartAggregator: 'count', width: 200 },
  {
    title: 'Velocidade (knots)',
    align: 'end',
    key: 'speed',
    chartAggregator: 'count',
    chartFormatter: formatKnots,
  },
  { title: 'Tamanho (m)', align: 'end', key: 'length', chartAggregator: 'count' },
  {
    title: 'Preço (R$)',
    align: 'end',
    key: 'price',
    value: (item) => formatPrice(item.price),
    chartAggregator: 'sum',
    chartFormatter: formatPrice,
  },
  { title: 'Ano', align: 'end', key: 'year', chartAggregator: 'count' },
  { title: 'Ações', key: 'actions', sortable: false, align: 'center' },
]

const data = ref([
  { id: 1, name: 'Speedster', speed: 35, length: 22, price: 300000, year: 2021 },
  { id: 2, name: 'Ocean King', speed: 25, length: 35, price: 4500000, year: 2023 },
  { id: 3, name: 'Ocean King', speed: 35, length: 26, price: 4500600, year: 2024 },
])

const optionsChartFilter = ref(headers.map((h) => h.title).slice(0, -1))

const gridManager = new ClassGridDataChart<{
  id: number,
  name: string,
  speed: number,
  length: number,
  price: number,
  year: number,
}>({
  modelTable: {
    model: {
      hiddenChart: true,
      titleTable: 'Relatório de Usuários',
      headersTable: headers,
      itemsTable: [],
    },
  },
  modelChart: {
    optionsFilterSelectData: optionsChartFilter.value,
    model: [],
  },
})

const gridConfig = reactive(gridManager.getModelGridDataChart())

const { loading } = useInfiniteList(route.fullPath, usersServices.getAllUsers, 20)

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 2000)
})

watchEffect(() => {
  gridConfig.modelTable.model.itemsTable = data.value
  gridConfig.modelTable.model.loadingDataTable = loading.value
})

const itemSelecionado = ref()

function handleSelection(item: any[]) {
  itemSelecionado.value = item
  console.log('Selecionado:', item)
}

function toggleChartState() {
  gridConfig.modelTable.model.hiddenChart = !gridConfig.modelTable.model.hiddenChart
}

const headersParaGrafico = computed(() => {
  return headers.filter((h) => h.key !== 'actions').map((h) => ({ title: h.title, value: h.key }))
})

const selectedChartFilter = ref(
  headersParaGrafico.value.find((h) => h.value === 'year')?.value ||
    headersParaGrafico.value[0]?.value,
)

const activeHeaderConfig = computed(() => {
  return headers.find((h) => h.key === selectedChartFilter.value)
})

const chartDataComputed = computed(() => {
  const items = gridConfig.modelTable.model.itemsTable
  const key = selectedChartFilter.value
  const strategy = activeHeaderConfig.value?.chartAggregator || 'count'
  return useChartHelpers(items, key, strategy)
})

const modelFormUser = new ClassUsers();
const refFormUser = ref<InstanceType<typeof UserForm> | null>(null);
const isFormValid = ref(false);

const classDialogUser = new ClassBaseDialog<IUser>({
  visualizar: false,
  persistente: true,
  maxHeight: 400,
  maxWidth: 600,
})

function toggleDialogUsers() {
  classDialogUser.toggleDialog()
}

function handleGerenciarRegistro(payload: { modoEdicao: boolean, item?: any }) {
  if (payload.modoEdicao && payload.item) {
    modelFormUser.updateModel({ ...payload.item });
    classDialogUser.abrirEdicao(payload.item);
  } else {
    modelFormUser.reset();
    classDialogUser.abrirNovo();
  }
  resetFormUser()
}

function resetFormUser() {
  refFormUser.value?.reset()
}

</script>
