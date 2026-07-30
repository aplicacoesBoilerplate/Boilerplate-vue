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

    <template #content>
      <FormUsuario
        ref="refFormUser"
        v-model:usuario="usuario"
        v-model:valido="isFormValid"
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
        :disabled="!isFormValid"
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
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { criarUsuarioPadrao, type IUsuario } from '@/models/model/core/usuario.model';

import BaseDialog from '@/components/dialogs/base/BaseDialog.vue';
import FormUsuario from '@/components/forms/core/FormUsuario.vue';

export interface IDialogFormUsuarioExpose {
  exibicaoDialog: (pItem?: IUsuario) => void;
  concluirSalvo: () => void;
}

type TProps = {
  modoEdicao: boolean;
};

const props = defineProps<TProps>();

type TEmits = {
  salvar: [];
};

const emit = defineEmits<TEmits>();

const { t } = useI18n();

const exibirDialog = defineModel<boolean>('exibirDialog', { required: true });
const usuario = defineModel<IUsuario>('usuario', { required: false, default: {} });

const refFormUser = ref<InstanceType<typeof FormUsuario> | null>(null);
const isFormValid = ref(false);
const salvando = ref(false);

function resetarFormUsuario(): void {
  refFormUser.value?.refreshForm();
}

function submeterFormUsuario(): void {
  refFormUser.value?.submit();
}

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

watch(exibirDialog, (pExibindo) => {
  if (!pExibindo) {
    usuario.value = criarUsuarioPadrao();
    isFormValid.value = false;
  }
});

const titulo = computed(() =>
  props.modoEdicao
    ? t('messages.forms.formUsers.editingUserId', { id: usuario.value?.id })
    : t('messages.forms.formUsers.createUser'),
);

const icon = computed(() => (props.modoEdicao ? 'mdi-account-edit' : 'mdi-account-plus'));

defineExpose({
  exibicaoDialog,
  concluirSalvo,
} satisfies IDialogFormUsuarioExpose);
</script>
