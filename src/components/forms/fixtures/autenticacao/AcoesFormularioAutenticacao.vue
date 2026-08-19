<template>
  <div class="d-flex flex-wrap align-center ga-2 pt-2">
    <v-btn
      v-tooltip="tooltipResetar"
      :aria-label="t('common.actions.resetForm')"
      class="flex-shrink-0"
      color="amber"
      icon="mdi-refresh"
      variant="text"
      @click="emits('resetar')"
    />

    <v-btn
      v-if="mostrarRecuperarSenha"
      :text="textoRecuperarSenhaExibido"
      class="flex-grow-1 flex-sm-grow-0"
      color="primary"
      prependIcon="mdi-lock-reset"
      variant="text"
      @click="emits('recuperarSenha')"
    />

    <div
      v-if="mostrarGoogle"
      class="d-flex flex-grow-1 flex-sm-grow-0 ms-sm-auto pa-0"
    >
      <LoginGoogle
        :carregando="carregandoGoogle"
        @autenticado="(pCredential) => emits('autenticarGoogle', pCredential)"
        @erro="(pMensagem) => emits('erroGoogle', pMensagem)"
      />
    </div>

    <v-btn
      :class="{ 'ms-sm-auto': !mostrarGoogle }"
      :color="corSubmit"
      :disabled="submitDesabilitado"
      :loading="carregandoSubmit"
      :prependIcon="iconeSubmit"
      :text="textoSubmit"
      class="flex-grow-1 flex-sm-grow-0"
      variant="flat"
      @click="emits('submit')"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import LoginGoogle from '@/components/forms/fixtures/LoginGoogle.vue';

const { t } = useI18n();

/**
 * @property {boolean} carregandoSubmit - Define se o botão principal está em carregamento.
 * @property {boolean} carregandoGoogle - Define se o botão do Google está em carregamento.
 * @property {string} corSubmit - Cor aplicada ao botão principal.
 * @property {string} iconeSubmit - Ícone exibido antes do texto do botão principal.
 * @property {boolean} mostrarGoogle - Define se o botão de Google será exibido.
 * @property {boolean} mostrarRecuperarSenha - Define se o botão de recuperar senha será exibido.
 * @property {boolean} submitDesabilitado - Define se o botão principal está desabilitado.
 * @property {string} textoRecuperarSenha - Texto do botão de recuperar senha.
 * @property {string} textoSubmit - Texto do botão principal.
 * @property {string} tooltipResetar - Tooltip do botão de reset.
 */
type TProps = {
  carregandoSubmit?: boolean;
  carregandoGoogle?: boolean;
  corSubmit?: string;
  iconeSubmit: string;
  mostrarGoogle?: boolean;
  mostrarRecuperarSenha?: boolean;
  submitDesabilitado?: boolean;
  textoRecuperarSenha?: string;
  textoSubmit: string;
  tooltipResetar: string;
};
const props = withDefaults(defineProps<TProps>(), {
  carregandoGoogle: false,
  carregandoSubmit: false,
  corSubmit: 'success',
  mostrarGoogle: false,
  mostrarRecuperarSenha: false,
  submitDesabilitado: false,
  textoRecuperarSenha: undefined,
});

const textoRecuperarSenhaExibido = computed(
  () => props.textoRecuperarSenha ?? t('tooltips.forms.forgotPassword'),
);

/**
 * @property {[credential?: string]} autenticarGoogle - Emitido quando o usuário aciona o login com Google.
 * @property {[mensagem: string]} erroGoogle - Emitido quando o Google não retorna uma credencial válida.
 * @property {[]} recuperarSenha - Emitido quando o usuário solicita recuperação de senha.
 * @property {[]} resetar - Emitido quando o usuário solicita reset do formulário.
 * @property {[]} submit - Emitido quando o usuário aciona o submit principal.
 */
type TEmits = {
  autenticarGoogle: [credential?: string];
  erroGoogle: [mensagem: string];
  recuperarSenha: [];
  resetar: [];
  submit: [];
};
const emits = defineEmits<TEmits>();
</script>
