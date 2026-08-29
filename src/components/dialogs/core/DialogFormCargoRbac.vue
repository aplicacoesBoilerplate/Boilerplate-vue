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
    <template #activator="{ props: dialogProps }">
      <slot
        :props="dialogProps"
        name="activator"
      >
        <v-btn
          v-bind="dialogProps"
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
        v-model:alterado="formAlterado"
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
          :disabled="!formValido || !formAlterado"
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
// Ecossistema Vue
import { computed, nextTick, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

// Model
import { criarCargoRbacPadrao, type ICargoRbac } from '@/models/model/core/rbac/rbac.model';
import type { IDialogFormExposeBase } from '@/models/components/exposes/IDialogFormExposeBase';
import type { IUsuario } from '@/models/model/core/usuario.model';

// Componentes
import BaseDialog from '@/components/dialogs/base/BaseDialog.vue';
import TabsExtensionToolbar, { type TAbas } from '@/components/forms/core/fixtures/rbac/TabsExtensionToolbar.vue';
import FormCargoRbac from '@/components/forms/core/FormCargoRbac.vue';

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

// Composables
const { t } = useI18n();

// Reativas - Model
const exibirDialog = defineModel<boolean>('exibirDialog', { required: true });
const cargo = defineModel<ICargoRbac>('cargo', { required: false, default: {} });
const usuarios = defineModel<IUsuario[]>('usuarios', { required: true });

// Reativas - ref
const refFormCargo = ref<InstanceType<typeof FormCargoRbac> | null>(null);
const formValido = ref(false);
const formAlterado = ref(false);
const salvando = ref(false);
const aba = ref<TAbas>('dados');

// Funções
function resetarFormCargo(): void {
  refFormCargo.value?.refreshForm();
}

/**
 * @description O método de submeterFormCargo é acionado pelo botão de salvar do BaseDialog implementado,
 * ele apenas faz o submit do form, quem realmente realiza as regras de validação do objeto e dispara o emit 'salvar'.
 */
function submeterFormCargo(): void {
  refFormCargo.value?.submit();
}

/**
 * @description O método de salvarCargo é sempre quem dispara o emit 'salvar', é ele quem manipula o objeto.
 */
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

// Computadas
const titulo = computed(() =>
  props.modoVisualizacao
    ? `Visualizar ${cargo.value.nome}`
    : props.modoEdicao
      ? t('dialogs.cargoRbac.editar', { nome: cargo.value.nome })
      : t('dialogs.cargoRbac.criar'),
);

const icone = computed(() => {
  if (props.modoVisualizacao) return 'mdi-shield-search';
  return props.modoEdicao ? 'mdi-shield-edit-outline' : 'mdi-shield-plus-outline';
});

// Observadores
watch(exibirDialog, async (pExibindo) => {
  if (pExibindo) {
    formValido.value = props.modoEdicao;
    formAlterado.value = false;
    await nextTick();
    refFormCargo.value?.registrarModeloInicial();
    return;
  }

  cargo.value = criarCargoRbacPadrao();
  formValido.value = false;
  formAlterado.value = false;
});

watch(
  () => props.modoEdicao,
  (pModoEdicao) => {
    if (exibirDialog.value && pModoEdicao) {
      formValido.value = true;
    }
  },
);

defineExpose({
  exibicaoDialog,
  concluirSalvo,
} satisfies IDialogFormExposeBase<ICargoRbac>);
</script>
