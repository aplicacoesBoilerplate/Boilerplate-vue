<template>
  <v-container
    class="fill-height pb-0 overflow-hidden"
    fluid
  >
    <GridDataChart
      :hiddenChart="hiddenChart"
      @toggleChart="alternarExibicaoGrafico(alternarGraficoLocal)"
    >
      <template #dataTable="{ toggleChart }">
        <GenericView
          ref="genericViewRef"
          :contexto="CONTEXTO_LISTA_USUARIOS"
          :serviceFetch="buscarUsuarios"
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
                  :disabled="!podeVisualizarGraficos"
                  @click="alternarExibicaoGrafico(toggleChart)"
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
                  :disabled="!podeGerenciarRegistros"
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

                    <DialogAuditoriaRegistro
                      :auditoria="usuario.auditoria"
                      class="mr-2"
                    />

                    <v-btn
                      icon="mdi-pencil"
                      variant="text"
                      color="info"
                      size="small"
                      class="mr-2"
                      :disabled="!podeGerenciarRegistros"
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
                      :disabled="!podeRemoverUsuario(usuario)"
                      @click.stop="excluirUsuario(usuario)"
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
import { useAuthStore } from '@/stores/auth.store';

// Types e Interfaces
import { criarUsuarioPadrao, type IUsuario } from '@/models/model/usuario/lUsuario';
import type { IGenericListFetchPayload, TGenericListFetchResponse } from '@/models/components/IGenericListContext';

// Composables
import { useChartHelpers } from '@/composables/useChartHelpers';
import { useRequisicaoService } from '@/composables/useRequisicaoService';
import { usePermissoesRbac } from '@/composables/usePermissoesRbac';

// Services
import { CUsuarioService } from '@/services/CUsuarioService';

// Mapeamentos
import { MAPEAMENTO_TABELA_USUARIO, MAPEAMENTO_CORES_AGRUPAMENTO_USUARIO } from '@/models/model/usuario/MapeamentoTabelaUsuario';

// Componentes
import GridDataChart from '@/components/layouts/GridDataChart.vue';
import BaseChart from '@/components/charts/BaseChart.vue';
import GenericView from '@/components/layout/generic/GenericView.vue';
import GenericInfiniteListItem from '@/components/layout/generic/GenericInfiniteList/GenericInfiniteListItem.vue';
import DialogFormUsuario from '@/components/dialogs/DialogFormUsuario.vue';
import DialogAuditoriaRegistro from '@/components/dialogs/DialogAuditoriaRegistro.vue';

// Composables
const listStore = useGenericListStore();
const genericFilterStore = useGenericFilterStore();
const authStore = useAuthStore();
const requisicaoService = useRequisicaoService();
const { possuiPermissaoGeral, notificarPermissaoNegada } = usePermissoesRbac();
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
function alternarExibicaoGrafico(pToggleChart: () => void): void {
  if (!podeVisualizarGraficos.value) {
    notificarPermissaoNegada('Você não tem permissão para visualizar gráficos.');
    return;
  }

  pToggleChart();
}

function alternarGraficoLocal(): void {
  hiddenChart.value = !hiddenChart.value;
}

function gerenciarRegistro(pPayload: { modoEdicao: boolean; item?: IUsuario }): void {
  if (!podeGerenciarRegistros.value) {
    notificarPermissaoNegada('Você não tem permissão para gerenciar registros.');
    return;
  }

  modoEdicaoUsuario.value = pPayload.modoEdicao;

  if (pPayload.modoEdicao && pPayload.item) {
    modelFormUsuario.value = { ...pPayload.item };
  } else {
    modelFormUsuario.value = criarUsuarioPadrao();
  }

  exibirDialogUsuario.value = true;
}

async function buscarUsuarios(pPayload: IGenericListFetchPayload): Promise<TGenericListFetchResponse<IUsuario>> {
  return CUsuarioService.buscarTodos(pPayload);
}

async function salvarUsuario(): Promise<void> {
  if (!podeGerenciarRegistros.value) {
    notificarPermissaoNegada('Você não tem permissão para gerenciar registros.');
    return;
  }

  const usuarioNormalizado = criarUsuarioPadrao(modelFormUsuario.value);

  if (modoEdicaoUsuario.value && usuarioNormalizado.id) {
    const usuarioAtualizado = await requisicaoService.executar({
      metodo: CUsuarioService.atualizar,
      parametros: usuarioNormalizado,
      sucesso: {
        mensagem: 'Usuário atualizado com sucesso.',
        tipo: 'success',
      },
    });

    genericViewRef.value?.atualizarItem<IUsuario>('id', usuarioAtualizado.id, usuarioAtualizado);
    if (usuarioAtualizado.id === usuarioAutenticadoId.value) {
      await authStore.fetchUser();
    }
  } else {
    const usuarioCriado = await requisicaoService.executar({
      metodo: CUsuarioService.criar,
      parametros: usuarioNormalizado,
      sucesso: {
        mensagem: 'Usuário criado com sucesso.',
        tipo: 'success',
      },
    });

    genericViewRef.value?.inserirItem(usuarioCriado);
  }

  exibirDialogUsuario.value = false;
}

async function excluirUsuario(pUsuario: IUsuario): Promise<void> {
  if (!pUsuario.id) return;

  if (!podeGerenciarRegistros.value) {
    notificarPermissaoNegada('Você não tem permissão para gerenciar registros.');
    return;
  }

  if (pUsuario.id === 1) {
    notificarPermissaoNegada('O usuário raiz da aplicação não pode ser removido.');
    return;
  }

  if (pUsuario.id === usuarioAutenticadoId.value) {
    notificarPermissaoNegada('Você não pode remover a própria conta.');
    return;
  }

  await requisicaoService.executar({
    metodo: CUsuarioService.excluir,
    parametros: pUsuario.id,
    sucesso: {
      mensagem: 'Usuário removido com sucesso.',
      tipo: 'success',
    },
  });

  genericViewRef.value?.removerItem<IUsuario>('id', pUsuario.id);
}

function podeRemoverUsuario(pUsuario: IUsuario): boolean {
  return Boolean(
    podeGerenciarRegistros.value &&
    pUsuario.id &&
    pUsuario.id !== 1 &&
    pUsuario.id !== usuarioAutenticadoId.value,
  );
}

// Computadas
const podeGerenciarRegistros = computed(() => possuiPermissaoGeral('gerenciarRegistros'));
const podeVisualizarGraficos = computed(() => possuiPermissaoGeral('visualizarGraficos'));
const usuarioAutenticadoId = computed(() => authStore.user?.id);
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
