<template>
  <BaseDialog
    v-model:exibirDialog="exibirDialog"
    :maxWidth="980"
    :titulo="titulo"
    :iconePrependTitulo="icone"
    :loading="salvando"
    @fechar="concluirSalvo"
    @cancelar="concluirSalvo"
    @salvar="submeterFormCargo"
  >
    <template #activator="{ props }">
      <slot
        :props="props"
        name="activator"
      >
        <v-btn
          v-bind="props"
          color="primary"
          icon="mdi-plus"
          size="x-small"
        />
      </slot>
    </template>

    <template #extension>
      <TabsExtensionToolbar v-model:abaAtual="aba" />
    </template>

    <template #content>
      <FormCargoRbac
        ref="refFormCargo"
        v-model:cargo="cargo"
        v-model:usuarios="usuarios"
        v-model:valido="formValido"
        v-model:abaAtual="aba"
        :cargosDisponiveis="cargosDisponiveis"
        :somenteLeitura="modoVisualizacao"
        @onSubmit="salvarCargo"
      />
    </template>

    <template #actions>
      <template v-if="modoVisualizacao">
        <v-spacer />

        <v-btn
          :text="t('tooltips.forms.edit')"
          color="primary"
          variant="flat"
          prependIcon="mdi-pencil"
          @click="habilitarEdicao"
        />
      </template>

      <template v-else>
        <v-btn
          v-tooltip="t('tooltips.forms.reset')"
          :text="t('tooltips.forms.reset')"
          color="amber"
          variant="text"
          prependIcon="mdi-refresh"
          @click="resetarFormCargo"
        />

        <v-spacer />

        <v-btn
          v-tooltip="t('tooltips.forms.save')"
          :disabled="!formValido"
          :text="t('tooltips.forms.save')"
          :loading="salvando"
          color="success"
          variant="flat"
          prependIcon="mdi-content-save"
          @click="submeterFormCargo"
        />
      </template>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { criarCargoRbacPadrao, type ICargoRbac } from '@/models/model/core/rbac/rbac.model';
import type { IUsuario } from '@/models/model/core/usuario.model';

import BaseDialog from '@/components/dialogs/base/BaseDialog.vue';
import TabsExtensionToolbar, { type TAbas } from '@/components/forms/core/fixtures/rbac/TabsExtensionToolbar.vue';
import FormCargoRbac from '@/components/forms/core/FormCargoRbac.vue';

export interface IDialogFormCargoRbacExpose {
  exibicaoDialog: (pItem?: ICargoRbac) => void;
  concluirSalvo: () => void;
}

type TProps = {
  modoEdicao: boolean;
  modoVisualizacao?: boolean;
  cargosDisponiveis: ICargoRbac[];
};

const props = withDefaults(defineProps<TProps>(), {
  modoVisualizacao: false,
});

type TEmits = {
  salvar: [];
  editar: [];
};

const emits = defineEmits<TEmits>();

const { t } = useI18n();

const exibirDialog = defineModel<boolean>('exibirDialog', { required: true });
const cargo = defineModel<ICargoRbac>('cargo', { required: false, default: {} });
const usuarios = defineModel<IUsuario[]>('usuarios', { required: true });

const refFormCargo = ref<InstanceType<typeof FormCargoRbac> | null>(null);
const formValido = ref(false);
const salvando = ref(false);
const aba = ref<TAbas>('dados');

function resetarFormCargo(): void {
  refFormCargo.value?.refreshForm();
}

function submeterFormCargo(): void {
  refFormCargo.value?.submit();
}

function salvarCargo(): void {
  salvando.value = true;
  emits('salvar');
}

function concluirSalvo(): void {
  salvando.value = false;
  exibirDialog.value = false;
}

function exibicaoDialog(pItem?: ICargoRbac): void {
  if (pItem) {
    cargo.value = criarCargoRbacPadrao({
      ...pItem,
      permissoes: [...pItem.permissoes],
    });
  } else {
    cargo.value = criarCargoRbacPadrao();
  }
  exibirDialog.value = true;
}

function habilitarEdicao(): void {
  emits('editar');
}

watch(exibirDialog, (pExibindo) => {
  if (!pExibindo) {
    cargo.value = criarCargoRbacPadrao();
    formValido.value = false;
  }
});

const titulo = computed(() =>
  props.modoVisualizacao
    ? `Visualizar ${cargo.value.nome}`
    : props.modoEdicao
      ? t('dialogs.cargoRbac.editar', { nome: cargo.value.nome })
      : t('dialogs.cargoRbac.criar'),
);

const icone = computed(() => {
  if (props.modoVisualizacao) return 'mdi-shield-eye-outline';
  return props.modoEdicao ? 'mdi-shield-edit-outline' : 'mdi-shield-plus-outline';
});

defineExpose({
  exibicaoDialog,
  concluirSalvo,
} satisfies IDialogFormCargoRbacExpose);
</script>
