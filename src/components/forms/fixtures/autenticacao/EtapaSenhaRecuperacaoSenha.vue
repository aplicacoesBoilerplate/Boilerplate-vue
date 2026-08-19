<template>
  <div>
    <div class="text-body-1 text-medium-emphasis text-center mb-6">
      {{ t('forgotPassword.stepAlterPassword.instruction') }}
    </div>

    <BaseForm
      ref="baseFormRef"
      @onSubmit="emits('alterarSenha')"
      @update:isValid="formularioValido = $event"
    >
      <v-row density="compact">
        <v-col cols="12">
          <v-text-field
            v-model="senha"
            :disabled="carregando"
            :label="t('forgotPassword.stepAlterPassword.labelNewPassword')"
            :placeholder="t('forgotPassword.stepAlterPassword.placeholderNewPassword')"
            :rules="[rules.required(), rules.minLength(8), rules.maxLength(100)]"
            :type="visualizarSenha ? 'text' : 'password'"
            prependInnerIcon="mdi-lock-outline"
            variant="outlined"
            autocomplete="off"
            density="compact"
          >
            <template #append-inner>
              <v-btn
                :icon="visualizarSenha ? 'mdi-eye' : 'mdi-eye-off'"
                density="compact"
                variant="text"
                @click="visualizarSenha = !visualizarSenha"
              />
            </template>
          </v-text-field>
        </v-col>

        <v-col cols="12">
          <v-text-field
            v-model="confirmarSenha"
            :disabled="carregando"
            :label="t('forgotPassword.stepAlterPassword.labelConfirmPassword')"
            :placeholder="t('forgotPassword.stepAlterPassword.placeholderConfirmPassword')"
            :rules="[rules.required(), rulesPersonalizadas.equals(() => senha)]"
            :type="visualizarSenha ? 'text' : 'password'"
            prependInnerIcon="mdi-lock-outline"
            variant="outlined"
            autocomplete="off"
            density="compact"
          >
            <template #append-inner>
              <v-btn
                :icon="visualizarSenha ? 'mdi-eye' : 'mdi-eye-off'"
                density="compact"
                variant="text"
                @click="visualizarSenha = !visualizarSenha"
              />
            </template>
          </v-text-field>
        </v-col>
      </v-row>

      <div class="d-flex flex-wrap align-center ga-2 pt-2">
        <v-btn
          v-tooltip="tooltipResetar"
          :aria-label="t('common.actions.resetPasswords')"
          class="flex-shrink-0"
          color="amber"
          icon="mdi-refresh"
          variant="text"
          @click="emits('resetar')"
        />

        <v-btn
          :disabled="!formularioValido"
          :loading="carregando"
          :text="t('forgotPassword.stepAlterPassword.btnAlterPassword')"
          class="flex-grow-1 flex-sm-grow-0 ms-auto"
          color="success"
          prependIcon="mdi-content-save-outline"
          variant="flat"
          @click="submit"
        />
      </div>
    </BaseForm>
  </div>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { nextTick, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRules } from 'vuetify/labs/rules';

// Utils
import { rulesPersonalizadas } from '@/utils/rules';

// Componentes
import BaseForm from '@/components/forms/base/BaseForm.vue';
/**
 * @property {boolean} carregando - Define se a etapa está em carregamento.
 * @property {string} tooltipResetar - Tooltip exibido no botão de reset.
 */
type TProps = {
  carregando?: boolean;
  tooltipResetar: string;
};

withDefaults(defineProps<TProps>(), {
  carregando: false,
});

/**
 * @property {function} alterarSenha - Emitido quando as senhas são validadas e submetidas.
 * @property {function} resetar - Emitido quando o usuário solicita reset no campo das senhas.
 */
type TEmits = {
  alterarSenha: [];
  resetar: [];
};
const emits = defineEmits<TEmits>();

// Composables
const { t } = useI18n();
const rules = useRules();

// Reativas - Model
const senha = defineModel<string>('senha', { required: true });
const confirmarSenha = defineModel<string>('confirmarSenha', { required: true });
const formularioValido = defineModel<boolean>('valid', { default: false });

// Reativas - ref
const baseFormRef = ref<InstanceType<typeof BaseForm> | null>(null);
const visualizarSenha = ref(false);

// Funções
async function reset(): Promise<void> {
  if (!baseFormRef.value) return;
  await baseFormRef.value.refreshForm(() => ({}));
}

async function submit(): Promise<void> {
  await nextTick();
  await baseFormRef.value?.submit();
}

// Expose
defineExpose({
  reset,
  submit,
});
</script>
