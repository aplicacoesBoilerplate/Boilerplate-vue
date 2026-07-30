<template>
  <div>
    <div class="text-body-1 text-medium-emphasis text-center mb-6">
      {{ t('forgotPassword.stepEmail.instruction') }}
    </div>

    <BaseForm
      ref="baseFormRef"
      @onSubmit="emits('enviarCodigo')"
      @update:isValid="formularioValido = $event"
    >
      <v-text-field
        v-model="email"
        :disabled="carregando"
        :label="t('forgotPassword.stepEmail.labelEmail')"
        :placeholder="t('forgotPassword.stepEmail.placeholderEmail')"
        :rules="[rules.required(), rules.email()]"
        autocomplete="off"
        density="compact"
        prependInnerIcon="mdi-email-outline"
        variant="outlined"
      />

      <div class="d-flex flex-wrap align-center ga-2 pt-2">
        <v-btn
          v-tooltip="tooltipResetar"
          aria-label="Resetar formulário"
          class="flex-shrink-0"
          color="amber"
          icon="mdi-refresh"
          variant="text"
          @click="emits('resetar')"
        />

        <v-btn
          :disabled="!formularioValido"
          :loading="carregando"
          :text="t('forgotPassword.stepEmail.btnSend')"
          class="flex-grow-1 flex-sm-grow-0 ms-auto"
          color="primary"
          prependIcon="mdi-send-outline"
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

// Componentes
import BaseForm from '@/components/forms/base/BaseForm.vue';

type TProps = {
  /**
   * Define se a etapa está em carregamento.
   */
  carregando?: boolean;

  /**
   * Tooltip exibido no botão de reset.
   */
  tooltipResetar: string;
};

const props = withDefaults(defineProps<TProps>(), {
  carregando: false,
});

type TEmits = {
  /**
   * Emitido quando o e-mail é validado e submetido.
   */
  enviarCodigo: [];

  /**
   * Emitido quando o usuário solicita reset da etapa.
   */
  resetar: [];
};
const emits = defineEmits<TEmits>();

// Composables
const { t } = useI18n();
const rules = useRules();

// Reativas - Model
const email = defineModel<string>('email', { required: true });
const formularioValido = defineModel<boolean>('valid', { default: false });

// Reativas - Ref
const baseFormRef = ref<InstanceType<typeof BaseForm> | null>(null);

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
