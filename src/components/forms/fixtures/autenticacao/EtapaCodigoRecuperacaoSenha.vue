<template>
  <div>
    <div class="text-body-2 text-center mb-6">
      {{ t('forgotPassword.stepVerify.instruction') }}<br />
      <strong>{{ email }}</strong>
    </div>

    <v-sheet
      color="transparent"
      class="mb-6"
    >
      <v-otp-input
        v-model="codigo"
        :disabled="carregando"
        color="primary"
        length="6"
        type="number"
        variant="outlined"
        @finish="emits('verificarCodigo')"
      />
    </v-sheet>

    <div class="text-center text-caption mb-6">
      <div v-if="tempoRestante > 0">
        {{ t('forgotPassword.stepVerify.expiresIn') }}
        <span class="font-weight-bold text-error">{{ tempoFormatado }}</span>
      </div>

      <div
        v-else
        class="d-flex flex-column align-center ga-2"
      >
        <span class="text-grey">{{ t('forgotPassword.stepVerify.expired') }}</span>

        <v-btn
          :loading="carregando"
          color="secondary"
          size="small"
          variant="text"
          @click="emits('reenviarCodigo')"
        >
          {{ t('forgotPassword.stepVerify.btnResend') }}
        </v-btn>
      </div>
    </div>

    <div class="d-flex flex-wrap align-center ga-2">
      <v-btn
        :disabled="carregando"
        :text="t('forgotPassword.stepVerify.btnChangeEmail')"
        class="flex-grow-1 flex-sm-grow-0"
        color="amber"
        prependIcon="mdi-arrow-left"
        variant="text"
        @click="emits('alterarEmail')"
      />

      <v-btn
        :disabled="codigo.length < 6"
        :loading="carregando"
        :text="t('forgotPassword.stepVerify.btnVerify')"
        class="flex-grow-1 flex-sm-grow-0 ms-sm-auto"
        color="primary"
        prependIcon="mdi-shield-check-outline"
        variant="flat"
        @click="emits('verificarCodigo')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { useI18n } from 'vue-i18n';

/**
 * @property {boolean} carregando - Define se a etapa está em carregamento.
 * @property {string} email - E-mail para o qual o código foi enviado.
 * @property {string} tempoFormatado - Tempo restante já formatado para exibição.
 * @property {number} tempoRestante - Tempo restante em segundos.
 */
type TProps = {
  carregando?: boolean;
  email: string;
  tempoFormatado: string;
  tempoRestante: number;
};
const props = withDefaults(defineProps<TProps>(), {
  carregando: false,
});

/**
 * @property {function} alterarEmail - Emitido quando o usuário quer voltar para a etapa de e-mail.
 * @property {function} reenviarCodigo - Emitido quando o usuário solicita reenvio do código.
 * @property {function} verificarCodigo - Emitido quando o usuário solicita validação do código.
 */
type TEmits = {
  alterarEmail: [];
  reenviarCodigo: [];
  verificarCodigo: [];
};
const emits = defineEmits<TEmits>();

// Composables
const { t } = useI18n();

// Reativas - Model
const codigo = defineModel<string>('codigo', { required: true });
</script>
