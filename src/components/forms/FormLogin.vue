<template>
  <BaseForm
    ref="baseFormRef"
    @onSubmit="emits('onSubmit')"
    @update:isValid="formIsValid = $event"
  >
    <v-row dense>
      <v-col cols="12">
        <v-text-field
          v-model="loginForm.email"
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
          v-model="loginForm.password"
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
import type { ILogin } from '@/models/model/autenticacao/autenticacao.models';

// Componentes
import BaseForm from '@/components/forms/base/BaseForm.vue';

type TEmits = {
  onSubmit: [];
};
const emits = defineEmits<TEmits>();

// Composables
const rules = useRules();
const { t } = useI18n();

// Reativas - Model
const loginForm = defineModel<ILogin>('login', { required: true });
const formIsValid = defineModel<boolean>('valid', { default: false });

// Reativas - ref
const baseFormRef = ref<InstanceType<typeof BaseForm> | null>(null);
const mostrarSenha = ref(false);

// Expose
defineExpose({
  reset: () => baseFormRef.value?.resetValidation(),
  submit: () => baseFormRef.value?.submit(),
});
</script>
