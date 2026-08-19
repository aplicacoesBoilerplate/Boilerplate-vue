<template>
  <div class="d-flex align-center justify-center">
    <GoogleLogin
      v-if="googleConfigurado"
      :clientId="clientId"
      :callback="handleGoogleCallback"
      :buttonConfig="CONFIGURACAO_BOTAO_GOOGLE"
      class="login-google"
    />

    <v-btn
      v-else
      :loading="carregando"
      color="surface-variant"
      prependIcon="mdi-google"
      text="Google"
      variant="tonal"
      block
      @click="emits('autenticado')"
    />
  </div>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
// Componentes
import { GoogleLogin } from 'vue3-google-login';

/**
 * @property {boolean} - Define o estado de carregamento do fluxo visual.
 */
type TProps = {
  carregando?: boolean;
};
withDefaults(defineProps<TProps>(), {
  carregando: false,
});

/**
 * @property {function} autenticado - Emitido quando o Google retorna uma credencial ou quando o fallback local é acionado.
 * @property {function} erro - Emitido quando o Google não retorna a credencial esperada.
 */
type TEmits = {
  autenticado: [credential?: string];
  erro: [mensagem: string];
};
const emits = defineEmits<TEmits>();

type TRespostaCredencialGoogle = {
  credential?: string;
};

/**
 * @property {string} type - Tipo do botão.
 * @property {string} theme - Tema do botão.
 * @property {string} size - Tamanho do botão.
 * @property {string} text - Texto do botão.
 * @property {string} shape - Formato do botão.
 * @property {string} logo_alignment - Alinhamento da imagem da logo.
 * @property {string} width - Largura do botão.
 */
const CONFIGURACAO_BOTAO_GOOGLE = {
  type: 'standard',
  theme: 'outline',
  size: 'large',
  text: 'signin_with',
  shape: 'pill',
  logo_alignment: 'left',
  width: '220px',
} as const;

// Computadas
const clientId = computed(() => window.env?.VITE_GOOGLE_CLIENT_ID || import.meta.env.VITE_GOOGLE_CLIENT_ID || '');
const googleConfigurado = computed(() => !!clientId.value);
const { t } = useI18n();

// Funções

/**
 * @description Processa a credencial retornada pelo Google.
 * @param pResposta - Resposta do Google.
 * @property {string} credential - Credencial do Google.
 */
function handleGoogleCallback(pResposta: TRespostaCredencialGoogle): void {
  if (!pResposta.credential) {
    emits('erro', t('common.messages.googleCancelled'));
    return;
  }

  emits('autenticado', pResposta.credential);
}
</script>

<style scoped>
.login-google {
  border-radius: 9999px;
  line-height: 0;
  overflow: hidden;
}

.login-google :deep(iframe) {
  display: block;
}
</style>
