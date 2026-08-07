<template>
  <BaseForm
    ref="baseFormRef"
    @onSubmit="emit('onSubmit')"
    @update:isValid="formIsValid = $event"
  >
    <v-row dense>
      <v-col :cols="$vuetify.display.mdAndUp ? 6 : 12">
        <v-text-field
          v-model="usuario.nome"
          :counter="30"
          :rules="[rules.required(), rules.maxLength(30)]"
          :label="t('forms.formUser.inputUsername.label')"
          :hint="t('forms.formUser.inputUsername.hint')"
          variant="outlined"
          density="compact"
          autocomplete="off"
        />
      </v-col>

      <v-col :cols="$vuetify.display.mdAndUp ? 6 : 12">
        <v-text-field
          v-model="usuario.email"
          :counter="150"
          :rules="[rules.required(), rules.email(), rules.maxLength(150)]"
          :label="t('forms.formUser.inputEmail.label')"
          :hint="t('forms.formUser.inputEmail.hint')"
          variant="outlined"
          density="compact"
          autocomplete="=off"
        />
      </v-col>

      <v-col :cols="$vuetify.display.mdAndUp ? 6 : 12">
        <SelectRole
          v-model="usuario.papel"
          :rules="[rules.required()]"
        />
      </v-col>

      <v-col :cols="$vuetify.display.mdAndUp ? 6 : 12">
        <v-mask-input
          v-model="usuario.telefone"
          :label="t('forms.formUser.inputPhoneNumber.label')"
          mask="(##) #####-####"
          placeholder="(##) #####-####"
          variant="outlined"
          density="compact"
          autocomplete="=off"
        />
      </v-col>

      <v-col :cols="$vuetify.display.mdAndUp ? 6 : 12">
        <v-checkbox
          v-model="usuario.notificar"
          :label="t('forms.formUser.inputReceiveNotifications.label')"
          color="success"
          hideDetails
        />
      </v-col>

      <v-col :cols="$vuetify.display.mdAndUp ? 6 : 12">
        <v-checkbox
          v-model="usuario.ativo"
          :label="t('forms.formUser.inputUserActive.label')"
          color="success"
          hideDetails
        />
      </v-col>
    </v-row>
  </BaseForm>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { ref, toRaw } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRules } from 'vuetify/labs/rules';

// Models
import { criarUsuarioPadrao, type IUsuario } from '@/models/model/core/usuario.model';

// Utils
import { deepClone } from '@/utils/deepClone';

// Componentes
import BaseForm from '@/components/forms/base/BaseForm.vue';
import SelectRole from '@/components/forms/fixtures/SelectRole.vue';

/**
 * @description Métodos expostos pelo formulário de usuário.
 * @property {() => Promise<void>} refreshForm - Restaura o estado original do formulário.
 * @property {() => void} submit - Dispara a validação e submit do formulário.
 */
export interface IFormUsuarioExpose {
  refreshForm: () => Promise<void>;
  submit: () => void;
}

type TEmits = {
  onSubmit: [];
};
const emit = defineEmits<TEmits>();

// Composables
const rules = useRules();
const { t } = useI18n();

// Reativas - Model
const formIsValid = defineModel<boolean>('valido', { default: false });
const usuario = defineModel<IUsuario>('usuario', { required: true });

// Reativas - Ref
const baseFormRef = ref<InstanceType<typeof BaseForm> | null>(null);
const usuarioOriginal = ref<IUsuario>(deepClone(toRaw(usuario.value)));

// Funções
async function refreshForm(): Promise<void> {
  if (!baseFormRef.value) return;
  await baseFormRef.value.refreshForm(() => {
    const lModoEdicao = usuarioOriginal.value.id !== undefined && usuarioOriginal.value.id > 0;
    return lModoEdicao ? criarUsuarioPadrao(usuarioOriginal.value) : criarUsuarioPadrao();
  });
}

// Expose
defineExpose({
  refreshForm,
  submit: () => baseFormRef.value?.submit(),
} satisfies IFormUsuarioExpose);
</script>
