<template>
  <v-container
    class="d-flex align-center justify-center py-8"
    style="min-height: 90vh"
    fluid
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
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

// Stores
import { useAuthStore } from '@/stores/auth.store';

// Utils
import { ClassManagerStorage } from '@/utils/ManagerStorage';

// Componentes
import EtapaCodigoRecuperacaoSenha from '@/components/forms/fixtures/autenticacao/EtapaCodigoRecuperacaoSenha.vue';
import EtapaEmailRecuperacaoSenha from '@/components/forms/fixtures/autenticacao/EtapaEmailRecuperacaoSenha.vue';
import EtapaSenhaRecuperacaoSenha from '@/components/forms/fixtures/autenticacao/EtapaSenhaRecuperacaoSenha.vue';

/**
 * @property {string} email - E-mail usado para solicitar o código de verificação.
 * @property {string} senha - Nova senha escolhida pelo usuário.
 * @property {string} confirmarSenha - Confirmação da nova senha escolhida pelo usuário.
 */
type TFormularioRecuperacaoSenha = {
  email: string;
  senha: string;
  confirmarSenha: string;
};

type TEstadoRecuperacaoSenhaPersistido = {
  etapaAtual: number;
  email: string;
  codigoOtp: string;
  expiraEm: number;
};

const DURACAO_TIMER_SEGUNDOS = 600;
const DURACAO_TIMER_MS = DURACAO_TIMER_SEGUNDOS * 1000;
const RECUPERACAO_SENHA_STORAGE_KEY = 'boilerplate.recuperacao-senha.estado';

// Composables
const { t } = useI18n();
const router = useRouter();

// Stores
const authStore = useAuthStore();

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
const expiracaoCodigo = ref<number | null>(null);

// Funções
function alterarEmail(): void {
  pararTimer();
  limparEstadoRecuperacaoSenha();
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

function iniciarTimer(pExpiraEm = Date.now() + DURACAO_TIMER_MS): void {
  pararTimer();
  expiracaoCodigo.value = pExpiraEm;
  atualizarTempoRestante();

  intervaloTimer.value = setInterval(() => {
    atualizarTempoRestante();
  }, 1000);
}

function pararTimer(): void {
  if (!intervaloTimer.value) {
    return;
  }

  clearInterval(intervaloTimer.value);
  intervaloTimer.value = null;
}

function atualizarTempoRestante(): void {
  if (!expiracaoCodigo.value) {
    tempoRestante.value = 0;
    return;
  }

  tempoRestante.value = Math.max(0, Math.ceil((expiracaoCodigo.value - Date.now()) / 1000));

  if (tempoRestante.value === 0) {
    pararTimer();
    limparEstadoRecuperacaoSenha();
  }
}

function persistirEstadoRecuperacaoSenha(): void {
  if (etapaAtual.value === 1 || !formulario.value.email || !expiracaoCodigo.value) {
    return;
  }

  const estado: TEstadoRecuperacaoSenhaPersistido = {
    etapaAtual: etapaAtual.value,
    email: formulario.value.email,
    codigoOtp: codigoOtp.value,
    expiraEm: expiracaoCodigo.value,
  };

  ClassManagerStorage.set(RECUPERACAO_SENHA_STORAGE_KEY, estado, {
    storage: 'local',
    expiresAt: estado.expiraEm,
  });
}

function limparEstadoRecuperacaoSenha(): void {
  ClassManagerStorage.clear(RECUPERACAO_SENHA_STORAGE_KEY, 'local');
  expiracaoCodigo.value = null;
}

function restaurarEstadoRecuperacaoSenha(): void {
  const estado = ClassManagerStorage.get<TEstadoRecuperacaoSenhaPersistido | null>(
    RECUPERACAO_SENHA_STORAGE_KEY,
    null,
    'local',
  );

  if (!estado || !estado.email || estado.expiraEm <= Date.now()) {
    limparEstadoRecuperacaoSenha();
    return;
  }

  formulario.value = {
    ...criarFormularioPadrao(),
    email: estado.email,
  };
  codigoOtp.value = estado.codigoOtp ?? '';
  etapaAtual.value = estado.etapaAtual === 3 ? 3 : 2;
  emailValido.value = true;
  iniciarTimer(estado.expiraEm);
}

async function alterarSenha(): Promise<void> {
  carregando.value = true;

  try {
    await authStore.redefinirSenhaRecuperacao({
      email: formulario.value.email,
      codigo: codigoOtp.value,
      senha: formulario.value.senha,
      confirmarSenha: formulario.value.confirmarSenha,
    });
    limparEstadoRecuperacaoSenha();
    await router.push({ name: 'Login' });
  } finally {
    carregando.value = false;
  }
}

async function enviarCodigo(): Promise<void> {
  carregando.value = true;

  try {
    await authStore.solicitarRecuperacaoSenha(formulario.value.email);
    etapaAtual.value = 2;
    codigoOtp.value = '';
    iniciarTimer();
    persistirEstadoRecuperacaoSenha();
  } finally {
    carregando.value = false;
  }
}

async function reenviarCodigo(): Promise<void> {
  carregando.value = true;

  try {
    await authStore.solicitarRecuperacaoSenha(formulario.value.email);
    codigoOtp.value = '';
    iniciarTimer();
    persistirEstadoRecuperacaoSenha();
  } finally {
    carregando.value = false;
  }
}

async function resetarFormulario(): Promise<void> {
  formulario.value = criarFormularioPadrao();
  codigoOtp.value = '';
  etapaAtual.value = 1;
  pararTimer();
  limparEstadoRecuperacaoSenha();
  await nextTick();
  await etapaEmailRef.value?.reset();
}

async function resetarSenhas(): Promise<void> {
  formulario.value.senha = '';
  formulario.value.confirmarSenha = '';
  await nextTick();
  await etapaSenhaRef.value?.reset();
}

async function verificarCodigo(): Promise<void> {
  if (codigoOtp.value.length < 6) {
    return;
  }

  carregando.value = true;

  try {
    await authStore.verificarCodigoRecuperacaoSenha({
      email: formulario.value.email,
      codigo: codigoOtp.value,
    });
    etapaAtual.value = 3;
    persistirEstadoRecuperacaoSenha();
  } finally {
    carregando.value = false;
  }
}

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

// Observadores
watch([etapaAtual, () => formulario.value.email, codigoOtp], () => {
  persistirEstadoRecuperacaoSenha();
});

// Lifecycle Hooks
onMounted(() => {
  restaurarEstadoRecuperacaoSenha();
});

onUnmounted(() => {
  pararTimer();
});
</script>
