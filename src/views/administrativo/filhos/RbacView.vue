<template>
  <v-container
    :class="mdAndDown ? 'w-100' : 'w-50'"
    class="pb-0 overflow-hidden"
    fluid
  >
    <GenericView
      ref="genericViewRef"
      :contexto="CONTEXTO_LISTA_CARGOS"
      :serviceFetch="buscarCargos"
      :exibirExportacao="false"
      :textoVazio="t('components.rbacView.textoVazioCargos')"
      :textoFinal="t('components.rbacView.textoFinalCargos')"
      @novoRegistro="gerenciarRegistro"
    >
      <template #activator-novo-registro="{ acionarNovoRegistro, tooltipProps }">
        <DialogFormCargoRbac
          v-model:exibirDialog="exibirDialogCargo"
          v-model:cargo="modelFormCargo"
          v-model:usuarios="usuarios"
          :modoEdicao="modoEdicaoCargo"
          :modoVisualizacao="modoVisualizacaoCargo"
          :cargosDisponiveis="cargos"
          @salvar="salvarCargo"
          @editar="habilitarEdicaoCargo"
        >
          <template #activator="{ props: DialogProps }">
            <v-btn
              v-bind="mergeProps(tooltipProps, DialogProps)"
              color="primary"
              icon="mdi-plus"
              size="x-small"
              variant="tonal"
              :disabled="!podeGerenciarRegistros"
              @click="acionarNovoRegistro"
            />
          </template>
        </DialogFormCargoRbac>

      </template>

      <template #default="{ items }">
        <GenericInfiniteListItem
          v-for="cargo in (items as ICargoRbac[])"
          :key="cargo.id"
          :item="cargo"
          itemKey="id"
        >
          <v-list-item
            class="border rounded mb-1 pa-1"
            lines="one"
          >
            <template #prepend>
              <DetalhesCargo
                :cargo="cargo"
                :quantidadePermissoesLiberadas="calcularPermissoesLiberadas(cargo)"
                :quantidadeUsuariosVinculados="contarUsuariosCargo(cargo.papel)"
                @visualizar="visualizarCargo"
              />
            </template>

            <template #append>
              <div class="d-flex align-center">
                <DialogAuditoriaRegistro
                  :auditoria="cargo.auditoria"
                  class="mr-2"
                />

                <v-btn
                  icon="mdi-pencil"
                  variant="text"
                  color="info"
                  size="small"
                  class="mr-2"
                  :disabled="!podeGerenciarRegistros"
                  @click.stop="gerenciarRegistro({ modoEdicao: true, item: cargo })"
                />
                <v-btn
                  icon="mdi-delete"
                  variant="text"
                  color="error"
                  size="small"
                  :disabled="!podeRemoverCargo(cargo)"
                  @click.stop="excluirCargo(cargo)"
                />
              </div>
            </template>
          </v-list-item>
        </GenericInfiniteListItem>
      </template>
    </GenericView>
  </v-container>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed, mergeProps, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDisplay } from 'vuetify';

// Stores
import { useAuthStore } from '@/stores/auth.store';

// Types e Interfaces
import {
  criarCargoRbacPadrao,
  type ICargoRbac,
} from '@/models/model/rbac/ICargoRbac';
import type { IUsuario, TPapel } from '@/models/model/usuario/lUsuario';
import type { IGenericListFetchPayload, TGenericListFetchResponse } from '@/models/components/IGenericListContext';

// Composables
import { useRequisicaoService } from '@/composables/useRequisicaoService';
import { usePermissoesRbac } from '@/composables/usePermissoesRbac';

// Services
import { CRbacService } from '@/services/CRbacService';
import { CUsuarioService } from '@/services/CUsuarioService';

// Componentes
import GenericView from '@/components/layout/generic/GenericView.vue';
import GenericInfiniteListItem from '@/components/layout/generic/GenericInfiniteList/GenericInfiniteListItem.vue';
import DialogFormCargoRbac from '@/components/dialogs/DialogFormCargoRbac.vue';
import DetalhesCargo from '@/components/rbac/DetalhesCargo.vue';
import DialogAuditoriaRegistro from '@/components/dialogs/DialogAuditoriaRegistro.vue';

// Constantes
const CONTEXTO_LISTA_CARGOS = 'lista-cargos-rbac';

// Composables
const { mdAndDown } = useDisplay();
const requisicaoService = useRequisicaoService();
const authStore = useAuthStore();
const { possuiPermissaoGeral, notificarPermissaoNegada } = usePermissoesRbac();
const { t } = useI18n();

// Reativas
const genericViewRef = ref<InstanceType<typeof GenericView> | null>(null);
const cargos = ref<ICargoRbac[]>([]);
const usuarios = ref<IUsuario[]>([]);
const exibirDialogCargo = ref(false);
const modoEdicaoCargo = ref(false);
const modoVisualizacaoCargo = ref(false);
const modelFormCargo = ref<ICargoRbac>(criarCargoRbacPadrao());
const papelCargoAntesEdicao = ref<TPapel | null>(null);
const papeisOriginaisUsuarios = ref(new Map<number, TPapel>());

// Funções
async function buscarCargos(pPayload: IGenericListFetchPayload): Promise<TGenericListFetchResponse<ICargoRbac>> {
  return CRbacService.consultar(pPayload);
}

async function gerenciarRegistro(pPayload: { modoEdicao: boolean; item?: ICargoRbac }): Promise<void> {
  if (!podeGerenciarRegistros.value) {
    notificarPermissaoNegada('Você não tem permissão para gerenciar registros.');
    return;
  }

  await Promise.all([
    carregarCargos(),
    carregarUsuariosParaVinculo(),
  ]);

  modoEdicaoCargo.value = pPayload.modoEdicao;
  modoVisualizacaoCargo.value = false;

  if (pPayload.modoEdicao && pPayload.item) {
    papelCargoAntesEdicao.value = pPayload.item.papel;
    modelFormCargo.value = criarCargoRbacPadrao({
      ...pPayload.item,
      permissoes: [...pPayload.item.permissoes],
    });
  } else {
    papelCargoAntesEdicao.value = null;
    modelFormCargo.value = criarCargoRbacPadrao();
  }

  exibirDialogCargo.value = true;
}

async function visualizarCargo(pCargo: ICargoRbac): Promise<void> {
  await Promise.all([
    carregarCargos(),
    carregarUsuariosParaVinculo(),
  ]);

  modoEdicaoCargo.value = false;
  modoVisualizacaoCargo.value = true;
  papelCargoAntesEdicao.value = pCargo.papel;
  modelFormCargo.value = criarCargoRbacPadrao({
    ...pCargo,
    permissoes: [...pCargo.permissoes],
  });
  exibirDialogCargo.value = true;
}

function habilitarEdicaoCargo(): void {
  if (!podeGerenciarRegistros.value) {
    notificarPermissaoNegada('Você não tem permissão para gerenciar registros.');
    return;
  }

  modoVisualizacaoCargo.value = false;
  modoEdicaoCargo.value = true;
}

async function salvarCargo(): Promise<void> {
  if (!podeGerenciarRegistros.value) {
    notificarPermissaoNegada('Você não tem permissão para gerenciar registros.');
    return;
  }

  const cargoNormalizado = criarCargoRbacPadrao(modelFormCargo.value);
  const cargoSalvo = await requisicaoService.executar({
    metodo: modoEdicaoCargo.value && cargoNormalizado.id ? CRbacService.atualizar : CRbacService.salvar,
    parametros: cargoNormalizado,
    sucesso: {
      mensagem: modoEdicaoCargo.value ? 'Cargo atualizado com sucesso.' : 'Cargo criado com sucesso.',
      tipo: 'success',
    },
  });

  await salvarUsuariosComCargoAlterado(cargoSalvo);
  await Promise.all([
    carregarCargos(),
    carregarUsuariosParaVinculo(),
  ]);

  if (modoEdicaoCargo.value && cargoSalvo.id) {
    genericViewRef.value?.atualizarItem<ICargoRbac>('id', cargoSalvo.id, cargoSalvo);
  } else {
    genericViewRef.value?.inserirItem(cargoSalvo);
  }

  await authStore.fetchUser();
  modoVisualizacaoCargo.value = false;
  papelCargoAntesEdicao.value = null;
}

async function excluirCargo(pCargo: ICargoRbac): Promise<void> {
  if (!pCargo.id) {
    return;
  }

  if (!podeGerenciarRegistros.value) {
    notificarPermissaoNegada('Você não tem permissão para gerenciar registros.');
    return;
  }

  if (cargoEhPadrao(pCargo)) {
    notificarPermissaoNegada('Os cargos padrão ADMIN e USER não podem ser removidos.');
    return;
  }

  await carregarUsuariosParaVinculo();
  await reatribuirUsuariosDoCargoParaUsuarioPadrao(pCargo.papel);

  await requisicaoService.executar({
    metodo: CRbacService.excluir,
    parametros: pCargo.id,
    sucesso: {
      mensagem: 'Cargo removido com sucesso.',
      tipo: 'success',
    },
  });

  genericViewRef.value?.removerItem<ICargoRbac>('id', pCargo.id);
  await Promise.all([
    carregarCargos(),
    carregarUsuariosParaVinculo(),
  ]);
  await authStore.fetchUser();
}

function calcularPermissoesLiberadas(pCargo: ICargoRbac): number {
  return pCargo.permissoes.filter((pPermissao) => pPermissao.liberado).length;
}

function contarUsuariosCargo(pPapelCargo: TPapel): number {
  return usuarios.value.filter((pUsuario) => pUsuario.papel === pPapelCargo).length;
}

function cargoEhPadrao(pCargo: Pick<ICargoRbac, 'papel'>): boolean {
  return ['ADMIN', 'USER'].includes(pCargo.papel);
}

function podeRemoverCargo(pCargo: ICargoRbac): boolean {
  return Boolean(podeGerenciarRegistros.value && pCargo.id && !cargoEhPadrao(pCargo));
}

async function carregarCargos(): Promise<void> {
  cargos.value = await CRbacService.listarTodos();
}

async function carregarUsuariosParaVinculo(): Promise<void> {
  const registros: IUsuario[] = [];
  let proximaEntrada: unknown = undefined;
  let temMaisRegistros = true;

  while (temMaisRegistros) {
    const pagina = await CUsuarioService.buscarTodos({
      limite: 100,
      ordem: 'asc',
      proximaEntrada,
      filtros: [],
    });

    registros.push(...pagina.items);
    proximaEntrada = pagina.proximaEntrada;
    temMaisRegistros = pagina.temMaisRegistros && pagina.items.length > 0;
  }

  usuarios.value = registros;
  papeisOriginaisUsuarios.value = new Map(
    registros
      .filter((pUsuario) => pUsuario.id)
      .map((pUsuario) => [pUsuario.id as number, pUsuario.papel]),
  );
}

async function salvarUsuariosComCargoAlterado(pCargoSalvo: ICargoRbac): Promise<void> {
  const atualizacoes = usuarios.value
    .filter((pUsuario) => pUsuario.id)
    .map((pUsuario) => {
      const papelOriginal = papeisOriginaisUsuarios.value.get(pUsuario.id as number);
      const papelAtualizado = resolverPapelUsuarioAposSalvarCargo(pUsuario, papelOriginal, pCargoSalvo);

      return {
        usuario: {
          ...pUsuario,
          papel: papelAtualizado,
        },
        papelOriginal,
      };
    })
    .filter((pAtualizacao) => pAtualizacao.papelOriginal && pAtualizacao.usuario.papel !== pAtualizacao.papelOriginal);

  await Promise.all(atualizacoes.map((pAtualizacao) => CUsuarioService.atualizar(pAtualizacao.usuario)));
}

function resolverPapelUsuarioAposSalvarCargo(
  pUsuario: IUsuario,
  pPapelOriginal: TPapel | undefined,
  pCargoSalvo: ICargoRbac,
): TPapel {
  if (papelCargoAntesEdicao.value && pPapelOriginal === papelCargoAntesEdicao.value) {
    return pCargoSalvo.papel;
  }

  return pUsuario.papel;
}

async function reatribuirUsuariosDoCargoParaUsuarioPadrao(pPapelCargo: TPapel): Promise<void> {
  const usuariosDoCargo = usuarios.value.filter((pUsuario) => pUsuario.papel === pPapelCargo);

  await Promise.all(
    usuariosDoCargo.map((pUsuario) =>
      CUsuarioService.atualizar({
        ...pUsuario,
        papel: 'USER',
      }),
    ),
  );
}

// Computadas
const podeGerenciarRegistros = computed(() => possuiPermissaoGeral('gerenciarRegistros'));

// Lifecycle Hooks
onMounted(() => {
  void Promise.all([
    carregarCargos(),
    carregarUsuariosParaVinculo(),
  ]);
});
</script>
