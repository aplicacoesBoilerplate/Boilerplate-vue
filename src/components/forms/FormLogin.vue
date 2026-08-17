<template>
  <BaseForm
    ref="baseFormRef"
    @onSubmit="emits('onSubmit')"
    @update:isValid="formIsValid = $event"
  >
    <v-row density="compact">
      <v-col cols="12">
        <v-text-field
          v-model="loginForm.identificacaoAcesso"
          :rules="[rules.required(), rules.email()]"
          :label="t('forms.formLogin.inputEmail.label')"
          variant="outlined"
          density="compact"
          autocomplete="off"
          clearable
        />
      </v-col>

      <v-col cols="12">
        <v-text-field
          v-model="loginForm.senha"
          :rules="[rules.required()]"
          :type="mostrarSenha ? 'text' : 'password'"
          :label="t('forms.formLogin.inputPassword.label')"
          variant="outlined"
          density="compact"
          autocomplete="off"
          clearable
        >
          <template #append-inner>
            <v-btn
              :icon="mostrarSenha ? 'mdi-eye' : 'mdi-eye-off'"
              variant="text"
              density="compact"
              @click="mostrarSenha = !mostrarSenha"
            />
          </template>
        </v-text-field>
      </v-col>
    </v-row>

    <slot name="actions" />
  </BaseForm>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRules } from 'vuetify/labs/rules';

// Types e Interfaces
import { criarLoginPadrao, type TLogin } from '@/models/model/core/autenticacao.model';

// Componentes
import BaseForm from '@/components/forms/base/BaseForm.vue';

/**
 * @description Métodos expostos pelo formulário de login.
 * @property {() => Promise<void>} refreshForm - Restaura o estado original do formulário.
 * @property {() => void} submit - Dispara a validação e submit do formulário.
 */
export interface IFormLoginExpose {
  refreshForm: () => Promise<void>;
  submit: () => void;
}

type TEmits = {
  onSubmit: [];
};
const emits = defineEmits<TEmits>();

// Composables
const rules = useRules();
const { t } = useI18n();

// Reativas - Model
const loginForm = defineModel<TLogin>('login', { required: true });
const formIsValid = defineModel<boolean>('valid', { default: false });

// Reativas - ref
const baseFormRef = ref<InstanceType<typeof BaseForm> | null>(null);
const mostrarSenha = ref(false);

async function refreshForm(): Promise<void> {
  if (!baseFormRef.value) return;
  await baseFormRef.value.refreshForm(() => criarLoginPadrao());
}

// Expose
defineExpose({
  refreshForm,
  submit: () => baseFormRef.value?.submit(),
} satisfies IFormLoginExpose);
</script>
