<template>
  <v-container
    class="d-flex align-center justify-center py-8"
    fluid
    style="min-height: 90vh"
  >
    <v-card
      class="w-100"
      maxWidth="720"
      elevation="8"
      rounded="lg"
    >
      <v-card-title class="d-flex align-center justify-center ga-2 pt-6">
        <v-icon
          icon="mdi-shield-key-outline"
          color="primary"
        />
        <span>{{ tituloAtual }}</span>
      </v-card-title>

      <v-card-text>
        <v-tabs
          v-model="abaAtual"
          color="primary"
          density="compact"
          grow
        >
          <v-tab value="login">
            <v-icon
              icon="mdi-login-variant"
              start
            />
            Login
          </v-tab>

          <v-tab value="registro">
            <v-icon
              icon="mdi-account-plus-outline"
              start
            />
            Registro
          </v-tab>
        </v-tabs>

        <v-window
          v-model="abaAtual"
          class="pt-5"
        >
          <v-window-item value="login">
            <PainelLogin
              ref="painelLoginRef"
              v-model:login="login"
              v-model:valid="loginValido"
              :carregando="carregandoLogin"
              :carregandoGoogle="carregandoGoogle"
              :tooltipResetar="t('tooltips.forms.reset')"
              @autenticarGoogle="autenticarGoogle"
              @entrar="entrar"
              @erroGoogle="handleErroLoginGoogle"
              @recuperarSenha="irParaRecuperacaoSenha"
              @resetar="resetarFormularioLogin"
            />
          </v-window-item>

          <v-window-item value="registro">
            <PainelRegistro
              ref="painelRegistroRef"
              v-model:registro="registro"
              v-model:valid="registroValido"
              :carregando="carregandoRegistro"
              :tooltipResetar="t('tooltips.forms.reset')"
              @resetar="resetarFormularioRegistro"
              @solicitarAcesso="solicitarAcesso"
            />
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
// Ecossistema Vue
import { computed, nextTick, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

// Types e Interfaces
import type { IUsuarioSolicitacaoAcesso } from '@/models/model/usuario/IUsuarioSolicitacaoAcesso';

// Composables
import { useFormularioLogin } from '@/composables/useFormularioLogin';
import { useSnackbar } from '@/composables/useSnackbar';

// Componentes
import PainelLogin from '@/components/forms/fixtures/autenticacao/PainelLogin.vue';
import PainelRegistro from '@/components/forms/fixtures/autenticacao/PainelRegistro.vue';

type TAbaAutenticacao = 'login' | 'registro';

// Composables
const router = useRouter();
const { t } = useI18n();
const { notify } = useSnackbar();
const { login, resetarLogin, salvarPreferenciaEmail } = useFormularioLogin();

// Reativas
const painelLoginRef = ref<InstanceType<typeof PainelLogin> | null>(null);
const painelRegistroRef = ref<InstanceType<typeof PainelRegistro> | null>(null);
const abaAtual = ref<TAbaAutenticacao>('login');
const loginValido = ref(false);
const registroValido = ref(false);
const carregandoLogin = ref(false);
const carregandoGoogle = ref(false);
const carregandoRegistro = ref(false);
const registro = ref<IUsuarioSolicitacaoAcesso>(criarRegistroPadrao());

// Computadas
const tituloAtual = computed(() => (abaAtual.value === 'login' ? 'Acessar sistema' : 'Solicitar acesso'));

// Funções
function criarRegistroPadrao(): IUsuarioSolicitacaoAcesso {
  return {
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  };
}

function handleErroLoginGoogle(pMensagem: string): void {
  notify(pMensagem, 'warning');
}

function irParaRecuperacaoSenha(): void {
  router.push({ name: 'ForgotPassword' });
}

async function autenticarGoogle(pCredential?: string): Promise<void> {
  carregandoGoogle.value = true;

  try {
    await simularRequisicao();
    notify(
      pCredential
        ? 'Credencial do Google recebida. Autenticação com backend simulada com sucesso.'
        : 'Autenticação com Google simulada com sucesso.',
      'success',
    );
  } finally {
    carregandoGoogle.value = false;
  }
}

async function entrar(): Promise<void> {
  salvarPreferenciaEmail();
  carregandoLogin.value = true;

  try {
    await simularRequisicao();
    notify(`${t('messages.welcome')}, ${login.email}!`, 'success');
  } finally {
    carregandoLogin.value = false;
  }
}

async function resetarFormularioLogin(): Promise<void> {
  resetarLogin();
  await nextTick();
  await painelLoginRef.value?.reset();
}

async function resetarFormularioRegistro(): Promise<void> {
  registro.value = criarRegistroPadrao();
  await nextTick();
  await painelRegistroRef.value?.reset();
}

async function solicitarAcesso(): Promise<void> {
  carregandoRegistro.value = true;

  try {
    await simularRequisicao();
    notify('Solicitação de acesso registrada. Aguarde a liberação de um administrador.', 'success');
    registro.value = criarRegistroPadrao();
    await nextTick();
    await painelRegistroRef.value?.reset();
    abaAtual.value = 'login';
  } finally {
    carregandoRegistro.value = false;
  }
}

async function simularRequisicao(pDelay = 900): Promise<void> {
  await new Promise((pResolve) => setTimeout(pResolve, pDelay));
}
</script>
