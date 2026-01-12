<template>
  <div class="d-flex justify-center align-center h-100" style="min-height: 90vh">
    <v-card class="mx-auto" width="600" elevation="8" rounded="lg">
      <v-card-title class="d-flex justify-center pt-5 pb-5">
        {{ t('routes.login.title') }}
      </v-card-title>
      <v-form ref="formRef" v-model="formIsValid">
        <v-row dense class="d-flex justify-center">
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
              :type="showPassword ? 'text' : 'password'"
              :label="t('forms.formLogin.inputPassword.label')"
              density="compact"
              variant="outlined"
              clearable
            >
              <template v-slot:append-inner>
                <v-icon-btn
                  :icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click="showPassword = !showPassword"
                  density="compact"
                  variant="text"
                />
              </template>
            </v-text-field>
          </v-col>
        </v-row>
        <slot name="actions" />
      </v-form>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import type { ILogin } from '@/classes/models/ModelLogin'
import { useRules } from 'vuetify/labs/rules';
import { useI18n } from 'vue-i18n';
import { ref } from 'vue'

const showPassword = ref(false);
const rules = useRules();
const { t } = useI18n();

const formRef = ref<any>(null);
const loginForm = defineModel<ILogin>('login', { required: true });
const formIsValid = defineModel<boolean>('valid', { default: false });

defineExpose({
  reset: () => formRef.value?.resetValidation(),
  validate: async () => {
    const { valid } = await formRef.value?.validate();
    return valid;
  }
});

</script>
