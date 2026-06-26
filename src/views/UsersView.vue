<template>
  <v-container
    fluid
    class="fill-height pb-0 overflow-hidden"
  >
    <GridDataChart
      :hidden-chart="hiddenChart"
      @toggle-chart="hiddenChart = !hiddenChart"
    >
      <template #dataTable="{ toggleChart }">
        <GenericView
          ref="genericViewRef"
          title="Usuários"
          contextId="users-list"
          :serviceFetch="fetchUsersMock"
          :limitOptions="[10, 25, 50]"
        >
          <template #list-header>
            <div class="d-flex align-center justify-space-between mb-4 w-100">
              <v-btn
                color="primary"
                prepend-icon="mdi-plus"
                text="Novo Usuário"
                @click="handleGerenciarRegistro({ modoEdicao: false })"
              />
              <v-btn
                variant="tonal"
                color="info"
                :prepend-icon="hiddenChart ? 'mdi-chart-pie' : 'mdi-table'"
                :text="hiddenChart ? 'Ver Gráficos' : 'Esconder Gráficos'"
                @click="toggleChart"
              />
            </div>
          </template>

          <template #default="{ items }">
            <GenericInfiniteListItem
              v-for="user in items as IUser[]"
              :key="user.idUser"
              :item="user"
              itemKey="idUser"
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
                    {{ user.username.charAt(0).toUpperCase() }}
                  </v-avatar>
                </template>

                <v-list-item-title class="font-weight-bold text-primary">
                  {{ user.username }}
                </v-list-item-title>
                <v-list-item-subtitle> {{ user.email }} • {{ user.role }} </v-list-item-subtitle>

                <template #append>
                  <div class="d-flex align-center">
                    <v-chip
                      :color="user.active ? 'success' : 'error'"
                      size="small"
                      class="mr-4"
                    >
                      {{ user.active ? 'Ativo' : 'Inativo' }}
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
                      @click.stop="deleteUser(user.idUser)"
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
          :chart-data="chartDataComputed"
          :filter-options="headersParaGrafico"
          :active-config="activeHeaderConfig"
        />
      </template>
    </GridDataChart>

    <BaseDialog
      v-model:showDialog="showDialogUser"
      :maxWidth="800"
    >
      <template v-slot:title>
        <v-icon
          size="small"
          class="mr-2"
          :icon="modelFormUser.idUser ? 'mdi-account-edit' : 'mdi-account-plus'"
        />
        {{
          modelFormUser.idUser
            ? t('messages.forms.formUsers.editingUser') + ` ${modelFormUser.idUser}`
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
import type { IUser } from '@/models/model/lUser';
import type { IGenericListFetchPayload, TGenericListFetchResponse } from '@/models/components/IGenericListContext';

// Classes
import { ClassUsuarios } from '@/classes/ClassUsers';

// Composables
import { useChartHelpers } from '@/composables/useChartHelpers';

// Componentes
import GridDataChart from '@/components/layouts/GridDataChart.vue';
import ChartPie from '@/components/ChartPie.vue';
import BaseDialog from '@/components/dialogs/BaseDialog.vue';
import UserForm from '@/components/forms/UserForm.vue';
import GenericView from '@/components/layout/generic/GenericView.vue';
import GenericInfiniteListItem from '@/components/layout/generic/GenericInfiniteList/GenericInfiniteListItem.vue';

// Composables
const { t } = useI18n();
const listStore = useGenericListStore();

// Constantes e Dados Base
const headers = ClassUsuarios.getHeaders();
const headersParaGrafico = headers.filter((h) => h.key !== 'actions').map((h) => ({ title: h.title, value: h.key }));

// Reativas - Model/ref
const genericViewRef = ref<InstanceType<typeof GenericView> | null>(null);
const hiddenChart = ref(true);
const selectedChartFilter = ref(headersParaGrafico[0]?.value);

// Estados de Formulário
const showDialogUser = ref(false);
const modelFormUser = ref<IUser>(new ClassUsuarios().model);
const refFormUser = ref<InstanceType<typeof UserForm> | null>(null);
const isFormValid = ref(false);

// Funções Síncronas (Mock de API)
const mockData: IUser[] = [
  {
    idUser: 1,
    username: 'BOILERPLATE',
    email: 'boilerplate@gmail.com',
    role: 'ADMIN',
    phoneNumber: '(32) 99999-9999',
    receiveNotifications: true,
    active: true,
  },
  {
    idUser: 2,
    username: 'GERSON',
    email: 'gerson@gmail.com',
    role: 'USER',
    phoneNumber: '(32) 99999-9998',
    receiveNotifications: false,
    active: true,
  },
  {
    idUser: 3,
    username: 'MARCOS',
    email: 'marcos@gmail.com',
    role: 'USER',
    phoneNumber: '(32) 99999-9997',
    receiveNotifications: true,
    active: false,
  },
];

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

function handleGerenciarRegistro(payload: { modoEdicao: boolean; item?: IUser }) {
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

// Funções Assíncronas
async function saveUser() {
  // Chamada simulada a service
  showDialogUser.value = false;
  await genericViewRef.value?.resetAndLoad();
}

async function deleteUser(idUser: number | undefined) {
  // Chamada simulada a service
  if (!idUser) return;

  await genericViewRef.value?.resetAndLoad();
}

// Computadas
const activeHeaderConfig = computed(() => {
  return headers.find((h) => h.key === selectedChartFilter.value);
});

const chartDataComputed = computed(() => {
  const items = (listStore.contexts['users-list']?.items as IUser[]) || [];
  const key = selectedChartFilter.value;
  const strategy = activeHeaderConfig.value?.chartAggregator || 'count';
  return useChartHelpers(items, key, strategy);
});
</script>
