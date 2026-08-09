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
          :serviceExportacao="exportarUsuarios"
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
                  :disabled="!podeVisualizarGraficos"
                  color="info"
                  variant="tonal"
                  size="x-small"
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
                  :disabled="!podeGerenciarRegistros"
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

                    <DialogAuditoriaRegistro
                      :auditoria="usuario.auditoria"
                      class="mr-2"
                    />

                    <v-btn
                      :disabled="!podeGerenciarRegistros"
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
                      :disabled="!podeRemoverUsuario(usuario)"
                      icon="mdi-delete"
                      variant="text"
                      color="error"
                      size="small"
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
        />
      </template>
    </GridDataChart>
  </v-container>
</template>

<script setup lang="ts">
// Ecossistema vue
import { computed, mergeProps, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { useAuthStore } from '@/stores/auth.store';
import { useGenericFilterStore } from '@/stores/genericFilter.store';
// Stores
import { useGenericListStore } from '@/stores/genericList.store';

// Types e Interfaces
import { CABECALHOS_TABELA_USUARIO, criarUsuarioPadrao, type IUsuario } from '@/models/model/core/usuario.model';
import type { IGenericViewExpose } from '@/models/components/exposes/IGenericViewExpose';
// Mapeamentos
import type { IConsultaRegistros, IRespostaConsultaRegistros } from '@/models/consulta/IConsultaRegistros';

// Composables
import { useChartHelpers } from '@/composables/useChartHelpers';
import { usePermissoesRbac } from '@/composables/usePermissoesRbac';
import { useRequisicaoService } from '@/composables/useRequisicaoService';

// Services
import { usuarioService } from '@/services/core/CUsuarioService';

import BaseChart from '@/components/common/charts/BaseApexChart.vue';
import DialogFormUsuario from '@/components/dialogs/core/DialogFormUsuario.vue';
import DialogAuditoriaRegistro from '@/components/dialogs/DialogAuditoriaRegistro.vue';
import GenericInfiniteListItem from '@/components/layouts/generic/GenericInfiniteList/GenericInfiniteListItem.vue';
import GenericView from '@/components/layouts/generic/GenericView.vue';
// Componentes
import GridDataChart from '@/components/layouts/GridDataChart.vue';

// Composables
const listStore = useGenericListStore();
const genericFilterStore = useGenericFilterStore();
const authStore = useAuthStore();
const requisicaoService = useRequisicaoService();
const { possuiPermissaoGeral, notificarPermissaoNegada } = usePermissoesRbac();
const { t } = useI18n();

// Constantes e Dados Base
const CONTEXTO_LISTA_USUARIOS = 'lista-usuarios';
const headers = CABECALHOS_TABELA_USUARIO;
const headersExportacao = headers;
const camposAgrupamento = computed(() => genericFilterStore.camposAgrupadoresDisponiveis);

// Reativas
const genericViewRef = ref<IGenericViewExpose | null>(null);
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

async function buscarUsuarios(pPayload: IConsultaRegistros<IUsuario>): Promise<IRespostaConsultaRegistros<IUsuario>> {
  return usuarioService.consultar(pPayload);
}

async function exportarUsuarios(): Promise<IUsuario[]> {
  const resposta = await usuarioService.consultarTodosRegistros();

  return resposta.registros;
}

async function salvarUsuario(): Promise<void> {
  if (!podeGerenciarRegistros.value) {
    notificarPermissaoNegada('Você não tem permissão para gerenciar registros.');
    return;
  }

  const usuarioNormalizado = criarUsuarioPadrao(modelFormUsuario.value);

  if (modoEdicaoUsuario.value && usuarioNormalizado.id) {
    const usuarioAtualizado = await requisicaoService.executar({
      metodo: (pUsuario: IUsuario) => usuarioService.editar(pUsuario),
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
      metodo: (pUsuario: IUsuario) => usuarioService.cadastrar(pUsuario),
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
    metodo: (pIdUsuario: number) => usuarioService.excluir(pIdUsuario),
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
    podeGerenciarRegistros.value && pUsuario.id && pUsuario.id !== 1 && pUsuario.id !== usuarioAutenticadoId.value,
  );
}

// Computadas
const podeGerenciarRegistros = computed(() => possuiPermissaoGeral('gerenciarRegistros'));
const podeVisualizarGraficos = computed(() => possuiPermissaoGeral('visualizarGraficos'));
const usuarioAutenticadoId = computed(() => authStore.user?.id);
const activeHeaderConfig = computed(() => {
  return headers.find((pHeader) => pHeader.key === selectedChartFilter.value);
});

const chartDataComputed = computed(() => {
  const items = (listStore.contexts[CONTEXTO_LISTA_USUARIOS]?.registros as IUsuario[]) || [];
  const key = selectedChartFilter.value;
  const strategy = activeHeaderConfig.value?.chartAggregator || 'count';
  return useChartHelpers(items, key, strategy);
});
</script>
