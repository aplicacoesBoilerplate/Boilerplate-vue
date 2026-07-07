<template>
  <v-container
    :class="mdAndDown ? 'w-100' : 'w-50'"
    class="pb-0 overflow-hidden"
    fluid
  >
    <GenericView
      ref="genericViewRef"
      :contexto="CONTEXTO_LISTA_CARGOS"
      :serviceFetch="buscarCargosMock"
      :exibirExportacao="false"
      :textoVazio="t('components.rbacView.textoVazioCargos')"
      :textoFinal="t('components.rbacView.textoFinalCargos')"
      @novoRegistro="gerenciarRegistro"
    >
      <template #activator-novo-registro="{ acionarNovoRegistro, tooltipProps }">
        <DialogFormCargoRbac
          v-model:exibirDialog="exibirDialogCargo"
          v-model:cargo="modelFormCargo"
          v-model:usuarios="usuariosMock"
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
import { mergeProps, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useDisplay } from 'vuetify';

// Types e Interfaces
import {
  criarCargoRbacPadrao,
  type ICargoRbac,
} from '@/models/model/rbac/ICargoRbac';
import type { IUsuario, TPapel } from '@/models/model/usuario/lUsuario';
import type { IGenericListFetchPayload, TGenericListFetchResponse } from '@/models/components/IGenericListContext';

// Services
import { CRbacMockService } from '@/services/CRbacMockService';

// Componentes
import GenericView from '@/components/layout/generic/GenericView.vue';
import GenericInfiniteListItem from '@/components/layout/generic/GenericInfiniteList/GenericInfiniteListItem.vue';
import DialogFormCargoRbac from '@/components/dialogs/DialogFormCargoRbac.vue';
import DetalhesCargo from '@/components/rbac/DetalhesCargo.vue';

// Constantes
const CONTEXTO_LISTA_CARGOS = 'lista-cargos-rbac';

// Composables
const router = useRouter();
const { mdAndDown } = useDisplay();
const { t } = useI18n();

// Reativas
const genericViewRef = ref<InstanceType<typeof GenericView> | null>(null);
const cargos = ref<ICargoRbac[]>(CRbacMockService.listarCargos());
const usuariosMock = ref<IUsuario[]>(CRbacMockService.listarUsuarios());
const exibirDialogCargo = ref(false);
const modoEdicaoCargo = ref(false);
const modelFormCargo = ref<ICargoRbac>(criarCargoRbacPadrao());
const papelCargoAntesEdicao = ref<TPapel | null>(null);

// Funções
async function buscarCargosMock(pPayload: IGenericListFetchPayload): Promise<TGenericListFetchResponse<ICargoRbac>> {
  return CRbacMockService.buscarCargos(pPayload);
}

function gerenciarRegistro(pPayload: { modoEdicao: boolean; item?: ICargoRbac }): void {
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
  const cargoSalvo = CRbacMockService.salvarCargo(
    modelFormCargo.value,
    usuariosMock.value,
    router.options.routes,
    papelCargoAntesEdicao.value,
  );

  cargos.value = CRbacMockService.listarCargos();
  usuariosMock.value = CRbacMockService.listarUsuarios();

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

  usuariosMock.value = CRbacMockService.excluirCargo(pIdCargo);
  cargos.value = CRbacMockService.listarCargos();

  genericViewRef.value?.removerItem<ICargoRbac>('id', pIdCargo);
}

function calcularPermissoesLiberadas(pCargo: ICargoRbac): number {
  return CRbacMockService.calcularResumoCargo(pCargo, router.options.routes).quantidadePermissoesLiberadas;
}

function contarUsuariosCargo(pPapelCargo: TPapel): number {
  const cargo = cargos.value.find((pCargo) => pCargo.papel === pPapelCargo);

  if (!cargo) {
    return 0;
  }

  return CRbacMockService.calcularResumoCargo(cargo, router.options.routes).quantidadeUsuariosVinculados;
}
</script>
