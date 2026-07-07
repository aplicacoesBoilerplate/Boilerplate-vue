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
          :cargosDisponiveis="cargos"
          @salvar="salvarCargo"
        >
          <template #activator="{ props: DialogProps }">
            <v-btn
              v-bind="mergeProps(tooltipProps, DialogProps)"
              color="primary"
              icon="mdi-plus"
              size="x-small"
              variant="tonal"
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
              />
            </template>

            <template #append>
              <div class="d-flex align-center">
                <v-btn
                  icon="mdi-pencil"
                  variant="text"
                  color="info"
                  size="small"
                  class="mr-2"
                  @click.stop="gerenciarRegistro({ modoEdicao: true, item: cargo })"
                />
                <v-btn
                  icon="mdi-delete"
                  variant="text"
                  color="error"
                  size="small"
                  @click.stop="excluirCargo(cargo.id)"
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
import { mergeProps, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDisplay } from 'vuetify';

// Types e Interfaces
import {
  criarCargoRbacPadrao,
  type ICargoRbac,
} from '@/models/model/rbac/ICargoRbac';
import type { IUsuario, TPapel } from '@/models/model/usuario/lUsuario';
import type { IGenericListFetchPayload, TGenericListFetchResponse } from '@/models/components/IGenericListContext';

// Composables
import { useRequisicaoService } from '@/composables/useRequisicaoService';

// Services
import { CRbacService } from '@/services/CRbacService';
import { CUsuarioService } from '@/services/CUsuarioService';

// Componentes
import GenericView from '@/components/layout/generic/GenericView.vue';
import GenericInfiniteListItem from '@/components/layout/generic/GenericInfiniteList/GenericInfiniteListItem.vue';
import DialogFormCargoRbac from '@/components/dialogs/DialogFormCargoRbac.vue';
import DetalhesCargo from '@/components/rbac/DetalhesCargo.vue';

// Constantes
const CONTEXTO_LISTA_CARGOS = 'lista-cargos-rbac';

// Composables
const { mdAndDown } = useDisplay();
const requisicaoService = useRequisicaoService();
const { t } = useI18n();

// Reativas
const genericViewRef = ref<InstanceType<typeof GenericView> | null>(null);
const cargos = ref<ICargoRbac[]>([]);
const usuarios = ref<IUsuario[]>([]);
const exibirDialogCargo = ref(false);
const modoEdicaoCargo = ref(false);
const modelFormCargo = ref<ICargoRbac>(criarCargoRbacPadrao());
const papelCargoAntesEdicao = ref<TPapel | null>(null);
const papeisOriginaisUsuarios = ref(new Map<number, TPapel>());

// Funções
async function buscarCargos(pPayload: IGenericListFetchPayload): Promise<TGenericListFetchResponse<ICargoRbac>> {
  return CRbacService.consultar(pPayload);
}

async function gerenciarRegistro(pPayload: { modoEdicao: boolean; item?: ICargoRbac }): Promise<void> {
  await Promise.all([
    carregarCargos(),
    carregarUsuariosParaVinculo(),
  ]);

  modoEdicaoCargo.value = pPayload.modoEdicao;

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

async function salvarCargo(): Promise<void> {
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

  papelCargoAntesEdicao.value = null;
}

async function excluirCargo(pIdCargo: number | undefined): Promise<void> {
  if (!pIdCargo) {
    return;
  }

  const cargo = cargos.value.find((pCargo) => pCargo.id === pIdCargo) ?? await CRbacService.buscarPorId(pIdCargo);

  await carregarUsuariosParaVinculo();
  await reatribuirUsuariosDoCargoParaUsuarioPadrao(cargo.papel);

  await requisicaoService.executar({
    metodo: CRbacService.excluir,
    parametros: pIdCargo,
    sucesso: {
      mensagem: 'Cargo removido com sucesso.',
      tipo: 'success',
    },
  });

  genericViewRef.value?.removerItem<ICargoRbac>('id', pIdCargo);
  await Promise.all([
    carregarCargos(),
    carregarUsuariosParaVinculo(),
  ]);
}

function calcularPermissoesLiberadas(pCargo: ICargoRbac): number {
  return pCargo.permissoes.filter((pPermissao) => pPermissao.liberado).length;
}

function contarUsuariosCargo(pPapelCargo: TPapel): number {
  return usuarios.value.filter((pUsuario) => pUsuario.papel === pPapelCargo).length;
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

// Lifecycle Hooks
onMounted(() => {
  void Promise.all([
    carregarCargos(),
    carregarUsuariosParaVinculo(),
  ]);
});
</script>
