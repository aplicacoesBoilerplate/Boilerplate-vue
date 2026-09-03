<template>
  <BaseDialog
    v-model:exibirDialog="exibirDialog"
    :maxWidth="800"
    :titulo="titulo"
    :iconePrependTitulo="icon"
    :loading="salvando"
    @fechar="concluirSalvo"
    @cancelar="concluirSalvo"
    @salvar="submeterFormUsuario"
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

    <template #content>
      <FormUsuario
        ref="refFormUser"
        v-model:usuario="usuario"
        v-model:valido="isFormValid"
        v-model:alterado="formAlterado"
        @onSubmit="salvarUsuario"
      />
    </template>

    <template #actions>
      <v-btn
        v-tooltip="t('tooltips.forms.reset')"
        :text="t('tooltips.forms.reset')"
        color="amber"
        variant="text"
        prependIcon="mdi-refresh"
        @click="resetarFormUsuario"
      />

      <v-spacer />

      <v-btn
        v-tooltip="t('tooltips.forms.save')"
        :disabled="!isFormValid || !formAlterado"
        :text="t('tooltips.forms.save')"
        :loading="salvando"
        color="success"
        variant="flat"
        prependIcon="mdi-content-save"
        @click="submeterFormUsuario"
      />
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed, nextTick, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

// Models
import { criarUsuarioPadrao, type IUsuario } from '@/models/model/core/usuario.model';
import type { IDialogFormExposeBase } from '@/models/components/exposes/IDialogFormExposeBase';

// Componentes
import BaseDialog from '@/components/dialogs/base/BaseDialog.vue';
import FormUsuario from '@/components/forms/core/FormUsuario.vue';

type TProps = {
  modoEdicao: boolean;
};
const props = defineProps<TProps>();

type TEmits = {
  salvar: [];
};
const emit = defineEmits<TEmits>();

// Composables
const { t } = useI18n();

// Reativas - Model
const exibirDialog = defineModel<boolean>('exibirDialog', { required: true });
const usuario = defineModel<IUsuario>('usuario', { required: false, default: {} });

// Reativas - ref
const refFormUser = ref<InstanceType<typeof FormUsuario> | null>(null);
const isFormValid = ref(false);
const formAlterado = ref(false);
const salvando = ref(false);

// Funções
function resetarFormUsuario(): void {
  refFormUser.value?.refreshForm();
}

/**
 * @description O método de submeterFormUsuario é acionado pelo botão de salvar do BaseDialog implementado,
 * ele apenas faz o submit do form, quem realmente realiza as regras de validação do objeto e dispara o emit 'salvar'.
 */
function submeterFormUsuario(): void {
  refFormUser.value?.submit();
}

/**
 * @description O método de salvarUsuario é sempre quem dispara o emit 'salvar', é ele quem manipula o objeto.
 */
function salvarUsuario(): void {
  salvando.value = true;
  emit('salvar');
}

function concluirSalvo(): void {
  salvando.value = false;
  exibirDialog.value = false;
}

function exibicaoDialog(pItem?: IUsuario): void {
  if (pItem) {
    usuario.value = { ...pItem };
  } else {
    usuario.value = criarUsuarioPadrao();
  }
  exibirDialog.value = true;
}

// Computadas
const titulo = computed(() =>
  props.modoEdicao
    ? t('messages.forms.formUsers.editingUserId', { id: usuario.value?.id })
    : t('messages.forms.formUsers.createUser'),
);

const icon = computed(() => (props.modoEdicao ? 'mdi-account-edit' : 'mdi-account-plus'));

// Observadores
watch(exibirDialog, async (pExibindo) => {
  if (pExibindo) {
    isFormValid.value = props.modoEdicao;
    formAlterado.value = false;
    await nextTick();
    refFormUser.value?.registrarModeloInicial();
    return;
  }

  salvando.value = false;
  usuario.value = criarUsuarioPadrao();
  isFormValid.value = false;
  formAlterado.value = false;
});

// Expose
defineExpose({
  exibicaoDialog,
  concluirSalvo,
} satisfies IDialogFormExposeBase<IUsuario>);
</script>
