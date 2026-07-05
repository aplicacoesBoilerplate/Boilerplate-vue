<template>
  <v-container
    class="d-flex align-center justify-center py-8"
    fluid
    style="min-height: 90vh"
  >
    <v-card
      class="w-100"
      maxWidth="520"
      elevation="8"
      rounded="lg"
    >
      <v-card-title class="d-flex align-center justify-center ga-2 pt-6">
        <v-icon
          icon="mdi-lock-reset"
          color="primary"
        />
        <span>{{ tituloAtual }}</span>
      </v-card-title>

      <v-card-text>
        <v-window v-model="etapaAtual">
          <v-window-item :value="1">
            <EtapaEmailRecuperacaoSenha
              ref="etapaEmailRef"
              v-model:email="formulario.email"
              v-model:valid="emailValido"
              :carregando="carregando"
              :tooltipResetar="t('tooltips.forms.reset')"
              @enviarCodigo="enviarCodigo"
              @resetar="resetarFormulario"
            />
          </v-window-item>

          <v-window-item :value="2">
            <EtapaCodigoRecuperacaoSenha
              v-model:codigo="codigoOtp"
              :carregando="carregando"
              :email="formulario.email"
              :tempoFormatado="tempoFormatado"
              :tempoRestante="tempoRestante"
              @alterarEmail="alterarEmail"
              @reenviarCodigo="reenviarCodigo"
              @verificarCodigo="verificarCodigo"
            />
          </v-window-item>

          <v-window-item :value="3">
            <EtapaSenhaRecuperacaoSenha
              ref="etapaSenhaRef"
              v-model:confirmarSenha="formulario.confirmarSenha"
              v-model:senha="formulario.senha"
              v-model:valid="senhaValida"
              :carregando="carregando"
              :tooltipResetar="t('tooltips.forms.reset')"
              @alterarSenha="alterarSenha"
              @resetar="resetarSenhas"
            />
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed, nextTick, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

// Composables
import { useSnackbar } from '@/composables/useSnackbar';

// Componentes
import EtapaCodigoRecuperacaoSenha from '@/components/forms/fixtures/autenticacao/EtapaCodigoRecuperacaoSenha.vue';
import EtapaEmailRecuperacaoSenha from '@/components/forms/fixtures/autenticacao/EtapaEmailRecuperacaoSenha.vue';
import EtapaSenhaRecuperacaoSenha from '@/components/forms/fixtures/autenticacao/EtapaSenhaRecuperacaoSenha.vue';

type TFormularioRecuperacaoSenha = {
  /**
   * E-mail usado para solicitar o código de verificação.
   */
  email: string;

  /**
   * Nova senha escolhida pelo usuário.
   */
  senha: string;

  /**
   * Confirmação da nova senha escolhida pelo usuário.
   */
  confirmarSenha: string;
};

const DURACAO_TIMER_SEGUNDOS = 120;

// Composables
const { t } = useI18n();
const router = useRouter();
const { notify } = useSnackbar();

// Reativas
const etapaEmailRef = ref<InstanceType<typeof EtapaEmailRecuperacaoSenha> | null>(null);
const etapaSenhaRef = ref<InstanceType<typeof EtapaSenhaRecuperacaoSenha> | null>(null);
const etapaAtual = ref(1);
const carregando = ref(false);
const formulario = ref<TFormularioRecuperacaoSenha>(criarFormularioPadrao());
const codigoOtp = ref('');
const tempoRestante = ref(0);
const emailValido = ref(false);
const senhaValida = ref(false);
const intervaloTimer = ref<ReturnType<typeof setInterval> | null>(null);

// Computadas
const tempoFormatado = computed(() => {
  const minutos = Math.floor(tempoRestante.value / 60);
  const segundos = tempoRestante.value % 60;

  return `${minutos}:${segundos.toString().padStart(2, '0')}`;
});

const tituloAtual = computed(() => {
  if (etapaAtual.value === 1) {
    return t('forgotPassword.title');
  }

  if (etapaAtual.value === 2) {
    return t('forgotPassword.titleVerify');
  }

  return t('forgotPassword.titleAlterPassword');
});

// Funções
function alterarEmail(): void {
  pararTimer();
  etapaAtual.value = 1;
  codigoOtp.value = '';
}

function criarFormularioPadrao(): TFormularioRecuperacaoSenha {
  return {
    email: '',
    senha: '',
    confirmarSenha: '',
  };
}

function iniciarTimer(): void {
  pararTimer();
  tempoRestante.value = DURACAO_TIMER_SEGUNDOS;

  intervaloTimer.value = setInterval(() => {
    if (tempoRestante.value > 0) {
      tempoRestante.value -= 1;
      return;
    }

    pararTimer();
  }, 1000);
}

function pararTimer(): void {
  if (!intervaloTimer.value) {
    return;
  }

  clearInterval(intervaloTimer.value);
  intervaloTimer.value = null;
}

async function alterarSenha(): Promise<void> {
  carregando.value = true;

  try {
    await simularRequisicao();
    notify(t('forgotPassword.feedback.alterSuccess'), 'success');
    await router.push({ name: 'Login' });
  } finally {
    carregando.value = false;
  }
}

async function enviarCodigo(): Promise<void> {
  carregando.value = true;

  try {
    await simularRequisicao();
    etapaAtual.value = 2;
    iniciarTimer();
    notify(t('forgotPassword.feedback.sentSuccess'), 'success');
  } finally {
    carregando.value = false;
  }
}

async function reenviarCodigo(): Promise<void> {
  carregando.value = true;

  try {
    await simularRequisicao(600);
    codigoOtp.value = '';
    iniciarTimer();
    notify(t('forgotPassword.feedback.resendInfo'), 'info');
  } finally {
    carregando.value = false;
  }
}

async function resetarFormulario(): Promise<void> {
  formulario.value = criarFormularioPadrao();
  codigoOtp.value = '';
  etapaAtual.value = 1;
  pararTimer();
  await nextTick();
  await etapaEmailRef.value?.reset();
}

async function resetarSenhas(): Promise<void> {
  formulario.value.senha = '';
  formulario.value.confirmarSenha = '';
  await nextTick();
  await etapaSenhaRef.value?.reset();
}

async function simularRequisicao(pDelay = 900): Promise<void> {
  await new Promise((pResolve) => setTimeout(pResolve, pDelay));
}

async function verificarCodigo(): Promise<void> {
  if (codigoOtp.value.length < 6) {
    return;
  }

  carregando.value = true;

  try {
    await simularRequisicao();
    etapaAtual.value = 3;
    notify(t('forgotPassword.feedback.verifySuccess'), 'success');
  } finally {
    carregando.value = false;
  }
}

// Lifecycle Hooks
onUnmounted(() => {
  pararTimer();
});
</script>
