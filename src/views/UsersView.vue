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

  <BaseDialog v-model:attributes="classDialogUser.model">
    <template v-slot:title>
      <v-icon
        size="small"
        :icon="classDialogUser.model.formEditingMode ? 'mdi-account-edit' : 'mdi-account-plus'"
      />
      {{ classDialogUser.model.formEditingMode
          ? t('messages.forms.formUsers.editingUser') + ` ${classDialogUser.model.itemEdition?.idUser || ''}`
          : t('messages.forms.formUsers.createUser')
      }}
    </template>

    <template v-slot:default>
      <UserForm
        ref="refFormUser"
        v-model:user="modelFormUser.model"
        v-model:valid="isFormValid"
      />
    </template>

    <template v-slot:actions>
      <v-icon-btn
        icon="mdi-refresh"
        v-tooltip="t('tooltips.forms.reset')"
        variant="text"
        color="amber"
        @click="resetFormUser"
      />

      <v-spacer />

      <v-icon-btn
        icon="mdi-content-save"
        v-tooltip="t('tooltips.forms.save')"
        variant="text"
        color="success"
        :disabled="!isFormValid"
      />
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import { ClassGridDataChart } from '@/classes/ClassGridDataChart'
import { ClassBaseDialog } from '@/classes/ClassBaseDialog'
import type { IUser } from '@/classes/models/ModelUser'
import { ClassUsers } from '@/classes/ClassUsers'
import { usersServices } from '@/services/usersService'
import { useInfiniteList } from '@/composables/useInfiniteList'
import { useChartHelpers } from '@/composables/useChartHelpers'
import GridDataChart from '@/components/layouts/GridDataChart.vue'
import DataTable from '@/components/DataTable.vue'
import ChartPie from '@/components/ChartPie.vue'
import BaseDialog from '@/components/dialog/BaseDialog.vue'
import UserForm from '@/components/forms/UserForm.vue'
import { reactive, ref, onMounted, watchEffect, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const { t } = useI18n()

const headers = computed(() => ClassUsers.getHeaders());

const data = ref<IUser[]>([
  {
    idUser: 1,
    username: 'BOILERPLATE',
    email: 'boilerplate@gmail.com',
    role: 'ADMIN' as const,
    phoneNumber: '(32) 99999-9999',
    receiveNotifications: true,
    active: true
  }
])

const optionsChartFilter = computed(() =>
  headers.value.map((h) => h.title).slice(0, -1)
)

const gridManager = new ClassGridDataChart<IUser>({
  modelTable: {
    model: {
      hiddenChart: true,
      titleTable: t('dataTable.users.title'),
      headersTable: headers.value,
      itemsTable: [],
    },
  },
  modelChart: {
    optionsFilterSelectData: optionsChartFilter.value,
    model: [],
  },
})

const gridConfig = reactive(gridManager.model)

const { loading } = useInfiniteList(route.fullPath, usersServices.getAllUsers, 20)

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 2000)
})

watchEffect(() => {
  gridConfig.modelTable.model.itemsTable = data.value
  gridConfig.modelTable.model.loadingDataTable = loading.value
  gridConfig.modelTable.model.headersTable = headers.value
  gridConfig.modelChart.optionsFilterSelectData = optionsChartFilter.value
  gridConfig.modelTable.model.titleTable = t('dataTable.users.title')
})

const itemSelecionado = ref()

function handleSelection(item: any[]) {
  itemSelecionado.value = item
}

function toggleChartState() {
  gridConfig.modelTable.model.hiddenChart = !gridConfig.modelTable.model.hiddenChart
}

const headersParaGrafico = computed(() => {
  return headers.value.filter((h) => h.key !== 'actions').map((h) => ({ title: h.title, value: h.key }))
})

const selectedChartFilter = ref(
  headersParaGrafico.value[0]?.value,
)

const activeHeaderConfig = computed(() => {
  return headers.value.find((h) => h.key === selectedChartFilter.value)
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
  view: false,
  persistent: true,
  maxHeight: 400,
  maxWidth: 800,
})

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
