<template>
  <div
    class="d-flex justify-center align-center h-100"
    style="min-height: 90vh"
  >
    <v-card
      class="mx-auto"
      width="600"
      elevation="8"
      rounded="lg"
    >
      <v-card-title class="d-flex justify-center pt-5 pb-5">
        {{ t('routes.login.title') }}
      </v-card-title>

      <BaseForm
        ref="baseFormRef"
        @onSubmit="emit('onSubmit')"
        @update:isValid="formIsValid = $event"
      >
        <v-row
          dense
          class="d-flex justify-center"
        >
          <v-col cols="11">
            <v-text-field
              v-model="loginForm.email"
              :rules="[rules.required(), rules.email()]"
              :label="t('forms.formLogin.inputEmail.label')"
              density="compact"
              variant="outlined"
              clearable
            />
          </v-col>

          <v-col cols="11">
            <v-text-field
              v-model="loginForm.password"
              :rules="[rules.required()]"
              :type="mostrarSenha ? 'text' : 'password'"
              :label="t('forms.formLogin.inputPassword.label')"
              density="compact"
              variant="outlined"
              clearable
            >
              <template #append-inner>
                <v-icon-btn
                  :icon="mostrarSenha ? 'mdi-eye' : 'mdi-eye-off'"
                  density="compact"
                  variant="text"
                  @click="mostrarSenha = !mostrarSenha"
                />
              </template>
            </v-text-field>
          </v-col>
        </v-row>

        <slot name="actions" />
      </BaseForm>
    </v-card>
  </div>
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
const emit = defineEmits<TEmits>();

// Composables
const rules = useRules();
const { t } = useI18n();

// Reativas - Model
const loginForm = defineModel<ILogin>('login', { required: true });
const formIsValid = defineModel<boolean>('valid', { default: false });

// Reativas - Ref
const baseFormRef = ref<InstanceType<typeof BaseForm> | null>(null);
const mostrarSenha = ref(false);

// Expose
defineExpose({
  reset: () => baseFormRef.value?.resetValidation(),
  submit: () => baseFormRef.value?.submit(),
});
</script>
