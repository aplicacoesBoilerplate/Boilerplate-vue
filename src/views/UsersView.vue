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
          :contexto="CONTEXTO_LISTA_USUARIOS"
          :serviceFetch="buscarUsuariosMock"
          :colunasExportacao="headersExportacao"
          nomeArquivoExportacao="usuarios"
          @novoRegistro="gerenciarRegistro"
        >
          <template #list-header-actions>
            <v-tooltip
              :text="hiddenChart ? t('components.usersView.verGraficos') : t('components.usersView.esconderGraficos')"
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

          <template #activator-novo-registro="{ acionarNovoRegistro, tooltipProps }">
            <DialogFormUsuario
              v-model:exibirDialog="exibirDialogUsuario"
              v-model:usuario="modelFormUsuario"
              :modoEdicao="modoEdicaoUsuario"
              @salvar="salvarUsuario"
            >
              <template #activator="{ props }">
                <v-btn
                  v-bind="mergeProps(props, tooltipProps)"
                  color="primary"
                  variant="tonal"
                  size="x-small"
                  icon="mdi-plus"
                  @click="acionarNovoRegistro"
                />
              </template>
            </DialogFormUsuario>
          </template>

          <template #default="{ items }">
            <GenericInfiniteListItem
              v-for="usuario in items as IUsuario[]"
              :key="usuario.id"
              :item="usuario"
              itemKey="id"
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
                    {{ usuario.nome.charAt(0).toUpperCase() }}
                  </v-avatar>
                </template>

                <v-list-item-title class="font-weight-bold text-primary">
                  {{ usuario.nome }}
                </v-list-item-title>
                <v-list-item-subtitle> {{ usuario.email }} • {{ usuario.papel }} </v-list-item-subtitle>

                <template #append>
                  <div class="d-flex align-center">
                    <v-chip
                      :color="usuario.ativo ? 'success' : 'error'"
                      size="small"
                      class="mr-4"
                    >
                      {{ usuario.ativo ? t('messages.active') : t('messages.inactive') }}
                    </v-chip>

                    <v-btn
                      icon="mdi-pencil"
                      variant="text"
                      color="info"
                      size="small"
                      class="mr-2"
                      @click.stop="
                          gerenciarRegistro({
                          modoEdicao: true,
                          item: usuario,
                        })
                      "
                    />
                    <v-btn
                      icon="mdi-delete"
                      variant="text"
                      color="error"
                      size="small"
                      @click.stop="excluirUsuario(usuario.id)"
                    />
                  </div>
                </template>
              </v-list-item>
            </GenericInfiniteListItem>
          </template>
        </GenericView>
      </template>

      <template #dataChart>
        <BaseChart
          v-model:filtroSelecionado="selectedChartFilter"
          :dados="chartDataComputed"
          :opcoesFiltro="camposAgrupamento"
          :configuracaoAtiva="activeHeaderConfig"
          :mapeamentoCores="mapeamentoCoresAgrupamento"
        />
      </template>
    </GridDataChart>
  </v-container>
</template>

<script setup lang="ts">
// Ecossistema vue
import { computed, mergeProps, ref } from 'vue';
import { useI18n } from 'vue-i18n';

// Stores
import { useGenericListStore } from '@/stores/genericList.store';
import { useGenericFilterStore } from '@/stores/genericFilter.store';

// Types e Interfaces
import { criarUsuarioPadrao, type IUsuario } from '@/models/model/usuario/lUsuario';
import type { IGenericListFetchPayload, TGenericListFetchResponse } from '@/models/components/IGenericListContext';

// Composables
import { useChartHelpers } from '@/composables/useChartHelpers';

// Mapeamentos
import { MAPEAMENTO_TABELA_USUARIO, MAPEAMENTO_CORES_AGRUPAMENTO_USUARIO } from '@/models/model/usuario/MapeamentoTabelaUsuario';

// Componentes
import GridDataChart from '@/components/layouts/GridDataChart.vue';
import BaseChart from '@/components/charts/BaseChart.vue';
import GenericView from '@/components/layout/generic/GenericView.vue';
import GenericInfiniteListItem from '@/components/layout/generic/GenericInfiniteList/GenericInfiniteListItem.vue';
import DialogFormUsuario from '@/components/dialogs/DialogFormUsuario.vue';

// Composables
const listStore = useGenericListStore();
const genericFilterStore = useGenericFilterStore();
const { t } = useI18n();

// Constantes e Dados Base
const CONTEXTO_LISTA_USUARIOS = 'lista-usuarios';
const headers = MAPEAMENTO_TABELA_USUARIO;
const headersExportacao = headers.filter((pHeader) => pHeader.key !== 'actions');
const camposAgrupamento = computed(() => genericFilterStore.camposAgrupadoresDisponiveis);

// Reativas
const genericViewRef = ref<InstanceType<typeof GenericView> | null>(null);
const hiddenChart = ref(true);
const selectedChartFilter = ref<string>(camposAgrupamento.value.length > 0 ? camposAgrupamento.value[0].valor : '');

// Estados de Formulário
const exibirDialogUsuario = ref(false);
const modoEdicaoUsuario = ref(false);
const modelFormUsuario = ref<IUsuario>(criarUsuarioPadrao());

// Funções
const mockData = ref<IUsuario[]>([
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
]);

function gerenciarRegistro(pPayload: { modoEdicao: boolean; item?: IUsuario }): void {
  modoEdicaoUsuario.value = pPayload.modoEdicao;

  if (pPayload.modoEdicao && pPayload.item) {
    modelFormUsuario.value = { ...pPayload.item };
  } else {
    modelFormUsuario.value = criarUsuarioPadrao();
  }

  exibirDialogUsuario.value = true;
}

async function buscarUsuariosMock(pPayload: IGenericListFetchPayload): Promise<TGenericListFetchResponse> {
  // Simula latência de rede
  await new Promise((pResolver) => setTimeout(pResolver, 800));

  const inicio = (pPayload.proximaEntrada as number) || 0;
  const limite = pPayload.limite || 10;
  const usuariosOrdenados = ordenarUsuarios(mockData.value, pPayload.ordem);
  const dados = usuariosOrdenados.slice(inicio, inicio + limite);

  return {
    items: dados,
    temMaisRegistros: inicio + dados.length < usuariosOrdenados.length,
    proximaEntrada: inicio + dados.length < usuariosOrdenados.length ? inicio + dados.length : undefined,
  };
}

async function salvarUsuario(): Promise<void> {
  // Chamada simulada a service
  const usuarioNormalizado = criarUsuarioPadrao(modelFormUsuario.value);

  if (modoEdicaoUsuario.value && usuarioNormalizado.id) {
    mockData.value = mockData.value.map((pUsuario) =>
      pUsuario.id === usuarioNormalizado.id ? usuarioNormalizado : pUsuario,
    );
    genericViewRef.value?.atualizarItem<IUsuario>('id', usuarioNormalizado.id, usuarioNormalizado);
  } else {
    const usuarioCriado = {
      ...usuarioNormalizado,
      id: obterProximoIdUsuario(),
    };

    mockData.value = [usuarioCriado, ...mockData.value];
    genericViewRef.value?.inserirItem(usuarioCriado);
  }

  exibirDialogUsuario.value = false;
}

async function excluirUsuario(pIdUsuario: number | undefined): Promise<void> {
  // Chamada simulada a service
  if (!pIdUsuario) return;

  mockData.value = mockData.value.filter((pUsuario) => pUsuario.id !== pIdUsuario);
  genericViewRef.value?.removerItem<IUsuario>('id', pIdUsuario);
}

function obterProximoIdUsuario(): number {
  return Math.max(0, ...mockData.value.map((pUsuario) => pUsuario.id ?? 0)) + 1;
}

function ordenarUsuarios(pUsuarios: IUsuario[], pOrdem: IGenericListFetchPayload['ordem']): IUsuario[] {
  return [...pUsuarios].sort((pUsuarioAtual, pProximoUsuario) => {
    const idUsuarioAtual = pUsuarioAtual.id ?? 0;
    const idProximoUsuario = pProximoUsuario.id ?? 0;

    return pOrdem === 'asc'
      ? idUsuarioAtual - idProximoUsuario
      : idProximoUsuario - idUsuarioAtual;
  });
}

// Computadas
const activeHeaderConfig = computed(() => {
  return headers.find((h) => h.key === selectedChartFilter.value);
});

const mapeamentoCoresAgrupamento = computed(() => {
  return MAPEAMENTO_CORES_AGRUPAMENTO_USUARIO[selectedChartFilter.value as keyof IUsuario] ?? {};
});

const chartDataComputed = computed(() => {
  const items = (listStore.contexts[CONTEXTO_LISTA_USUARIOS]?.items as IUsuario[]) || [];
  const key = selectedChartFilter.value;
  const strategy = activeHeaderConfig.value?.chartAggregator || 'count';
  return useChartHelpers(items, key, strategy);
});

</script>
