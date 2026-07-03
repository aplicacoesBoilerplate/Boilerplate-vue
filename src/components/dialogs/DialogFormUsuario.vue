<template>
  <BaseDialog
    v-model:exibirDialog="exibirDialog"
    :maxWidth="800"
    :titulo="titulo"
    :iconePrependTitulo="icon"
  >
    <template #activator="{ props }">
      <slot
        name="activator"
        :props="props"
      >
        <v-btn
          v-bind="props"
          color="primary"
          icon="mdi-plus"
          size="x-small"
        />
      </slot>
    </template>

    <template v-slot:content>
      <FormUsuario
        ref="refFormUser"
        v-model:usuario="usuario"
        v-model:valido="isFormValid"
      />
    </template>

    <template v-slot:actions>
      <v-btn
        prepend-icon="mdi-refresh"
        v-tooltip="t('tooltips.forms.reset')"
        variant="text"
        color="amber"
        @click="resetFormUser"
        text="Limpar"
      />

      <v-spacer />

      <v-btn
        prepend-icon="mdi-content-save"
        v-tooltip="t('tooltips.forms.save')"
        variant="flat"
        color="success"
        :disabled="!isFormValid"
        text="Salvar"
        @click="saveUser"
      />
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

// Types e Interfaces
import type { IUsuario } from '@/models/model/usuario/lUsuario';

// Componentes
import BaseDialog from './base/BaseDialog.vue';
import FormUsuario from '../forms/FormUsuario.vue';

type TProps = {
  modoEdicao: boolean
}
const props = defineProps<TProps>();

type TEmits = {
  salvar: [];
};
const emit = defineEmits<TEmits>();

// Composables
const { t } = useI18n();

// Reativas - Model
const exibirDialog = defineModel<boolean>('exibirDialog', { required: true });
const usuario = defineModel<IUsuario>('usuario', { required: false, default: {}});

// Reativas - Ref
const refFormUser = ref<InstanceType<typeof FormUsuario> | null>(null);
const isFormValid = ref(false);

// Computadas
const titulo = computed(() => (props.modoEdicao ? `Editar usuário #${usuario.value?.id}` : 'Criar novo usuário'));
const icon = computed(() => (props.modoEdicao ? `mdi-account-edit` : 'mdi-account-plus'));

// Funções
function resetFormUser(): void {
  refFormUser.value?.reset();
}

function saveUser(): void {
  emit('salvar');
  exibirDialog.value = false;
}
</script>
