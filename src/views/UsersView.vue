<template>
  <v-container
    class="fill-height pb-0 overflow-hidden"
    fluid
  >
    <GridDataChart
      :hiddenChart="hiddenChart"
      @toggleChart="hiddenChart = !hiddenChart"
    >
      <template #dataTable="{ toggleChart }">
        <GenericView
          ref="genericViewRef"
          contextId="users-list"
          :serviceFetch="fetchUsersMock"
        >
          <template #list-header-actions>
            <v-tooltip
              :text="hiddenChart ? 'Ver Gráficos' : 'Esconder Gráficos'"
              location="bottom"
            >
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  :icon="hiddenChart ? 'mdi-chart-pie' : 'mdi-table'"
                  color="info"
                  variant="tonal"
                  size="x-small"
                  @click="toggleChart"
                />
              </template>
            </v-tooltip>
          </template>

          <template #default="{ items }">
            <GenericInfiniteListItem
              v-for="user in items as IUsuario[]"
              :key="user.id"
              :item="user"
              itemKey="id"
              contextId="users-list"
            >
              <v-list-item
                class="border rounded mb-2 pa-3"
                lines="two"
              >
                <template #prepend>
                  <v-avatar
                    color="primary"
                    class="text-white"
                  >
                    {{ user.nome.charAt(0).toUpperCase() }}
                  </v-avatar>
                </template>

                <v-list-item-title class="font-weight-bold text-primary">
                  {{ user.nome }}
                </v-list-item-title>
                <v-list-item-subtitle> {{ user.email }} • {{ user.papel }} </v-list-item-subtitle>

                <template #append>
                  <div class="d-flex align-center">
                    <v-chip
                      :color="user.ativo ? 'success' : 'error'"
                      size="small"
                      class="mr-4"
                    >
                      {{ user.ativo ? 'Ativo' : 'Inativo' }}
                    </v-chip>

                    <v-btn
                      icon="mdi-pencil"
                      variant="text"
                      color="info"
                      size="small"
                      class="mr-2"
                      @click.stop="
                        handleGerenciarRegistro({
                          modoEdicao: true,
                          item: user,
                        })
                      "
                    />
                    <v-btn
                      icon="mdi-delete"
                      variant="text"
                      color="error"
                      size="small"
                      @click.stop="deleteUser(user.id)"
                    />
                  </div>
                </template>
              </v-list-item>
            </GenericInfiniteListItem>
          </template>
        </GenericView>
      </template>

      <template #dataChart>
        <ChartPie
          v-model:selectedFilter="selectedChartFilter"
          :chartData="chartDataComputed"
          :filterOptions="headersParaGrafico"
          :activeConfig="activeHeaderConfig"
        />
      </template>
    </GridDataChart>

    <BaseDialog
      v-model:exibirDialog="showDialogUser"
      :maxWidth="800"
    >
      <template v-slot:title>
        <v-icon
          size="small"
          class="mr-2"
          :icon="modelFormUser.id ? 'mdi-account-edit' : 'mdi-account-plus'"
        />
        {{
          modelFormUser.id
            ? t('messages.forms.formUsers.editingUser') + ` ${modelFormUser.id}`
            : t('messages.forms.formUsers.createUser')
        }}
      </template>

      <template v-slot:content>
        <UserForm
          ref="refFormUser"
          v-model:usuario="modelFormUser"
          v-model:valido="isFormValid"
        />
      </template>

      <template v-slot:actions>
        <v-btn
          prepend-icon="mdi-refresh"
          v-tooltip="t('tooltips.forms.reset')"
          variant="text"
          color="amber"
          @click="resetFormUser"
          text="Limpar"
        />

        <v-spacer />

        <v-btn
          prepend-icon="mdi-content-save"
          v-tooltip="t('tooltips.forms.save')"
          variant="flat"
          color="success"
          :disabled="!isFormValid"
          text="Salvar"
          @click="saveUser"
        />
      </template>
    </BaseDialog>
  </v-container>
</template>

<script setup lang="ts">
// Ecossistema vue
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

// Stores
import { useGenericListStore } from '@/stores/genericList.store';

// Types e Interfaces
import type { IUsuario } from '@/models/model/usuario/lUsuario';
import type { IGenericListFetchPayload, TGenericListFetchResponse } from '@/models/components/IGenericListContext';

// Classes
import { ClassUsuarios } from '@/classes/ClassUsers';

// Composables
import { useChartHelpers } from '@/composables/useChartHelpers';

// Componentes
import GridDataChart from '@/components/layouts/GridDataChart.vue';
import ChartPie from '@/components/ChartPie.vue';
import BaseDialog from '@/components/dialogs/base/BaseDialog.vue';
import UserForm from '@/components/forms/UserForm.vue';
import GenericView from '@/components/layout/generic/GenericView.vue';
import GenericInfiniteListItem from '@/components/layout/generic/GenericInfiniteList/GenericInfiniteListItem.vue';

// Composables
const { t } = useI18n();
const listStore = useGenericListStore();

// Constantes e Dados Base
const headers = ClassUsuarios.getHeaders();
const headersParaGrafico = headers.filter((h) => h.key !== 'actions').map((h) => ({ title: h.title, value: h.key }));

// Reativas
const genericViewRef = ref<InstanceType<typeof GenericView> | null>(null);
const hiddenChart = ref(true);
const selectedChartFilter = ref(headersParaGrafico[0]?.value);

// Estados de Formulário
const showDialogUser = ref(false);
const modelFormUser = ref<IUsuario>(new ClassUsuarios().model);
const refFormUser = ref<InstanceType<typeof UserForm> | null>(null);
const isFormValid = ref(false);

// Funções
const mockData: IUsuario[] = [
  {
    id: 1,
    nome: 'BOILERPLATE',
    email: 'boilerplate@gmail.com',
    papel: 'ADMIN',
    telefone: '(32) 99999-9999',
    notificar: true,
    ativo: true,
  },
  {
    id: 2,
    nome: 'GERSON',
    email: 'gerson@gmail.com',
    papel: 'USER',
    telefone: '(32) 99999-9998',
    notificar: false,
    ativo: true,
  },
  {
    id: 3,
    nome: 'MARCOS',
    email: 'marcos@gmail.com',
    papel: 'USER',
    telefone: '(32) 99999-9997',
    notificar: true,
    ativo: false,
  },
];

function handleGerenciarRegistro(payload: { modoEdicao: boolean; item?: IUsuario }) {
  if (payload.modoEdicao && payload.item) {
    modelFormUser.value = { ...payload.item };
  } else {
    modelFormUser.value = new ClassUsuarios().model;
  }
  showDialogUser.value = true;
  resetFormUser();
}

function resetFormUser() {
  refFormUser.value?.reset();
}

async function fetchUsersMock(payload: IGenericListFetchPayload): Promise<TGenericListFetchResponse> {
  // Simula latência de rede
  await new Promise((resolve) => setTimeout(resolve, 800));

  const start = (payload.nextEntry as number) || 0;
  const limit = payload.limit || 10;
  const data = mockData.slice(start, start + limit);

  return {
    items: data,
    hasMore: start + data.length < mockData.length,
    nextEntry: start + data.length < mockData.length ? start + data.length : undefined,
  };
}

async function saveUser() {
  // Chamada simulada a service
  showDialogUser.value = false;
  await genericViewRef.value?.resetAndLoad();
}

async function deleteUser(pIdUsuario: number | undefined) {
  // Chamada simulada a service
  if (!pIdUsuario) return;

  await genericViewRef.value?.resetAndLoad();
}

// Computadas
const activeHeaderConfig = computed(() => {
  return headers.find((h) => h.key === selectedChartFilter.value);
});

const chartDataComputed = computed(() => {
  const items = (listStore.contexts['users-list']?.items as IUsuario[]) || [];
  const key = selectedChartFilter.value;
  const strategy = activeHeaderConfig.value?.chartAggregator || 'count';
  return useChartHelpers(items, key, strategy);
});

</script>
