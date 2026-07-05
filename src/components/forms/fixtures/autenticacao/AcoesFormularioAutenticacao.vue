<template>
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
      v-if="mostrarRecuperarSenha"
      :text="textoRecuperarSenha"
      class="flex-grow-1 flex-sm-grow-0"
      color="primary"
      prependIcon="mdi-lock-reset"
      variant="text"
      @click="emits('recuperarSenha')"
    />

    <div
      v-if="mostrarGoogle"
      class="d-flex flex-grow-1 flex-sm-grow-0 ms-sm-auto"
    >
      <LoginGoogle
        class="w-100"
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
// Componentes
import LoginGoogle from '@/components/forms/fixtures/LoginGoogle.vue';

type TProps = {
  /**
   * Define se o botão principal está em carregamento.
   */
  carregandoSubmit?: boolean;

  /**
   * Define se o botão do Google está em carregamento.
   */
  carregandoGoogle?: boolean;

  /**
   * Cor aplicada ao botão principal.
   */
  corSubmit?: string;

  /**
   * Ícone exibido antes do texto do botão principal.
   */
  iconeSubmit: string;

  /**
   * Define se o botão de Google será exibido.
   */
  mostrarGoogle?: boolean;

  /**
   * Define se o botão de recuperar senha será exibido.
   */
  mostrarRecuperarSenha?: boolean;

  /**
   * Define se o botão principal está desabilitado.
   */
  submitDesabilitado?: boolean;

  /**
   * Texto do botão de recuperar senha.
   */
  textoRecuperarSenha?: string;

  /**
   * Texto do botão principal.
   */
  textoSubmit: string;

  /**
   * Tooltip do botão de reset.
   */
  tooltipResetar: string;
};

const props = withDefaults(defineProps<TProps>(), {
  carregandoGoogle: false,
  carregandoSubmit: false,
  corSubmit: 'success',
  mostrarGoogle: false,
  mostrarRecuperarSenha: false,
  submitDesabilitado: false,
  textoRecuperarSenha: 'Esqueci minha senha',
});

type TEmits = {
  /**
   * Emitido quando o usuário aciona o login com Google.
   */
  autenticarGoogle: [credential?: string];

  /**
   * Emitido quando o Google não retorna uma credencial válida.
   */
  erroGoogle: [mensagem: string];

  /**
   * Emitido quando o usuário solicita recuperação de senha.
   */
  recuperarSenha: [];

  /**
   * Emitido quando o usuário solicita reset do formulário.
   */
  resetar: [];

  /**
   * Emitido quando o usuário aciona o submit principal.
   */
  submit: [];
};
const emits = defineEmits<TEmits>();
</script>
