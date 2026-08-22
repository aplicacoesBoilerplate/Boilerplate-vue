<template>
  <v-container
    :class="mdAndDown ? 'w-100' : 'w-50'"
    class="pb-0 overflow-hidden"
    fluid
  >
    <DialogFormCargoRbac
      ref="refDialogFormCargo"
      v-model:exibirDialog="exibirDialogCargo"
      v-model:cargo="modelFormCargo"
      v-model:usuarios="usuarios"
      :modoEdicao="modoEdicaoCargo"
      :modoVisualizacao="modoVisualizacaoCargo"
      :cargosDisponiveis="cargos"
      @salvar="salvarCargo"
      @editar="habilitarEdicaoCargo"
    >
      <template #activator>
        <span class="d-none" />
      </template>
    </DialogFormCargoRbac>

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
        <v-btn
          v-bind="tooltipProps"
          :disabled="!podeGerenciarRegistros"
          color="primary"
          icon="mdi-plus"
          size="x-small"
          variant="tonal"
          @click="acionarNovoRegistro"
        />
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
                  :disabled="!podeGerenciarRegistros"
                  icon="mdi-pencil"
                  variant="text"
                  color="info"
                  size="small"
                  class="mr-2"
                  @click.stop="gerenciarRegistro({ modoEdicao: true, item: cargo })"
                />
                <v-btn
                  :disabled="!podeRemoverCargo(cargo)"
                  icon="mdi-delete"
                  variant="text"
                  color="error"
                  size="small"
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
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDisplay } from 'vuetify';

// Stores
import { useAuthStore } from '@/stores/auth.store';

// Models
import { criarCargoRbacPadrao, type ICargoRbac } from '@/models/model/core/rbac/rbac.model';
import type { IGenericViewExpose } from '@/models/components/exposes/IGenericViewExpose';
import type { IConsultaRegistros, IRespostaConsultaRegistros } from '@/models/consulta/IConsultaRegistros';
import type { IUsuario, TPapel } from '@/models/model/core/usuario.model';

// Composables
import { usePermissoesRbac } from '@/composables/usePermissoesRbac';
import { useRequisicaoService } from '@/composables/useRequisicaoService';

// Services
import { cargoRbacService } from '@/services/core/CCargoRbacService';
import { usuarioService } from '@/services/core/CUsuarioService';

// Componentes
import DetalhesCargo from '@/components/core/rbac/DetalhesCargo.vue';
import DialogFormCargoRbac from '@/components/dialogs/core/DialogFormCargoRbac.vue';
import DialogAuditoriaRegistro from '@/components/dialogs/DialogAuditoriaRegistro.vue';
import GenericInfiniteListItem from '@/components/layouts/generic/GenericInfiniteList/GenericInfiniteListItem.vue';
import GenericView from '@/components/layouts/generic/GenericView.vue';

// Constantes
const CONTEXTO_LISTA_CARGOS = 'lista-cargos-rbac';

// Stores
const authStore = useAuthStore();

// Composables
const { mdAndDown } = useDisplay();
const requisicaoService = useRequisicaoService();
const { possuiPermissaoGeral, notificarPermissaoNegada } = usePermissoesRbac();
const { t } = useI18n();

// Reativas
const genericViewRef = ref<IGenericViewExpose | null>(null);
const refDialogFormCargo = ref<InstanceType<typeof DialogFormCargoRbac> | null>(null);
const cargos = ref<ICargoRbac[]>([]);
const usuarios = ref<IUsuario[]>([]);
const exibirDialogCargo = ref(false);
const modoEdicaoCargo = ref(false);
const modoVisualizacaoCargo = ref(false);
const modelFormCargo = ref<ICargoRbac>(criarCargoRbacPadrao());
const papelCargoAntesEdicao = ref<TPapel | null>(null);
const papeisOriginaisUsuarios = ref(new Map<number, TPapel>());

// Funções
async function buscarCargos(pPayload: IConsultaRegistros<ICargoRbac>): Promise<IRespostaConsultaRegistros<ICargoRbac>> {
  return cargoRbacService.consultar(pPayload);
}

async function gerenciarRegistro(pPayload: { modoEdicao: boolean; item?: ICargoRbac }): Promise<void> {
  if (!podeGerenciarRegistros.value) {
    notificarPermissaoNegada(t('common.messages.manageDenied'));
    return;
  }

  await Promise.all([carregarCargos(), carregarUsuariosParaVinculo()]);

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
  await Promise.all([carregarCargos(), carregarUsuariosParaVinculo()]);

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
    notificarPermissaoNegada(t('common.messages.manageDenied'));
    return;
  }

  modoVisualizacaoCargo.value = false;
  modoEdicaoCargo.value = true;
}

async function salvarCargo(): Promise<void> {
  if (!podeGerenciarRegistros.value) {
    notificarPermissaoNegada(t('common.messages.manageDenied'));
    return;
  }

  const cargoNormalizado = criarCargoRbacPadrao(modelFormCargo.value);
  const cargoSalvo = await requisicaoService.executar({
    metodo: modoEdicaoCargo.value && cargoNormalizado.id
      ? (pCargo: ICargoRbac) => cargoRbacService.editar(pCargo)
      : (pCargo: ICargoRbac) => cargoRbacService.cadastrar(pCargo),
    parametros: cargoNormalizado,
    sucesso: {
      mensagem: modoEdicaoCargo.value ? 'Cargo atualizado com sucesso.' : 'Cargo criado com sucesso.',
      tipo: 'success',
    },
  });

  await salvarUsuariosComCargoAlterado(cargoSalvo);
  await Promise.all([carregarCargos(), carregarUsuariosParaVinculo()]);
  await genericViewRef.value?.resetarECarregar();

  await authStore.fetchUser();
  refDialogFormCargo.value?.concluirSalvo();
  modoVisualizacaoCargo.value = false;
  papelCargoAntesEdicao.value = null;
}

async function excluirCargo(pCargo: ICargoRbac): Promise<void> {
  if (!pCargo.id) {
    return;
  }

  if (!podeGerenciarRegistros.value) {
    notificarPermissaoNegada(t('common.messages.manageDenied'));
    return;
  }

  if (cargoEhPadrao(pCargo)) {
    notificarPermissaoNegada(t('common.messages.defaultRoleRemoval'));
    return;
  }

  await carregarUsuariosParaVinculo();
  await reatribuirUsuariosDoCargoParaUsuarioPadrao(pCargo.papel);

  await requisicaoService.executar({
    metodo: (pIdCargo: number) => cargoRbacService.excluir(pIdCargo),
    parametros: pCargo.id,
    sucesso: {
      mensagem: t('common.messages.roleRemoved'),
      tipo: 'success',
    },
  });

  genericViewRef.value?.removerItem<ICargoRbac>('id', pCargo.id);
  await Promise.all([carregarCargos(), carregarUsuariosParaVinculo()]);
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
  const resposta = await cargoRbacService.consultarTodosRegistros();
  cargos.value = resposta.registros;
}

async function carregarUsuariosParaVinculo(): Promise<void> {
  const resposta = await usuarioService.consultarTodosRegistros({ ordenacao: 'asc' });
  const registros = resposta.registros;

  usuarios.value = registros;
  papeisOriginaisUsuarios.value = new Map(
    registros.filter((pUsuario) => pUsuario.id).map((pUsuario) => [pUsuario.id as number, pUsuario.papel]),
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

  await Promise.all(atualizacoes.map((pAtualizacao) => usuarioService.editar(pAtualizacao.usuario)));
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
      usuarioService.editar({
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
  void Promise.all([carregarCargos(), carregarUsuariosParaVinculo()]);
});
</script>
