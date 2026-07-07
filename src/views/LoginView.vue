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

    <OverlayFullscream v-model:exibirOverlay="exibirOverlayAutenticacao">
      <template #mensagem>
        <div class="text-subtitle-1 font-weight-bold">
          Preparando acesso
        </div>

        <div class="text-body-2 text-medium-emphasis text-center">
          Validando credenciais e rota inicial.
        </div>
      </template>
    </OverlayFullscream>
  </v-container>
</template>

<script lang="ts" setup>
// Ecossistema Vue
import { computed, nextTick, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

// Stores
import { useAuthStore } from '@/stores/auth.store';

// Types e Interfaces
import { criarRegistroPadrao, type IUsuarioSolicitacaoAcesso } from '@/models/model/usuario/IUsuarioSolicitacaoAcesso';

// Composables
import { useFormularioLogin } from '@/composables/useFormularioLogin';
import { useSnackbar } from '@/composables/useSnackbar';

// Componentes
import PainelLogin from '@/components/forms/fixtures/autenticacao/PainelLogin.vue';
import PainelRegistro from '@/components/forms/fixtures/autenticacao/PainelRegistro.vue';
import OverlayFullscream from '@/components/layout/OverlayFullscream.vue';

type TAbaAutenticacao = 'login' | 'registro';

// Composables
const router = useRouter();
const { t } = useI18n();
const { notify } = useSnackbar();
const { login, resetarLogin, salvarPreferenciaEmail } = useFormularioLogin();

// Stores
const authStore = useAuthStore();

// Reativas
const painelLoginRef = ref<InstanceType<typeof PainelLogin> | null>(null);
const painelRegistroRef = ref<InstanceType<typeof PainelRegistro> | null>(null);
const abaAtual = ref<TAbaAutenticacao>('login');
const loginValido = ref(false);
const registroValido = ref(false);
const carregandoLogin = ref(false);
const carregandoGoogle = ref(false);
const carregandoRegistro = ref(false);
const processandoRedirecionamento = ref(false);
const registro = ref<IUsuarioSolicitacaoAcesso>(criarRegistroPadrao());

// Funções
function handleErroLoginGoogle(pMensagem: string): void {
  notify(pMensagem, 'warning');
}

function irParaRecuperacaoSenha(): void {
  router.push({ name: 'RecuperacaoSenha' });
}

async function autenticarGoogle(pCredential?: string): Promise<void> {
  if (!pCredential) {
    notify('Configure o VITE_GOOGLE_CLIENT_ID para habilitar o login com Google.', 'warning');
    return;
  }

  carregandoGoogle.value = true;

  try {
    const usuarioAutenticado = await authStore.loginGoogle(pCredential);
    notify(`${t('messages.welcome')}, ${usuarioAutenticado.nome}!`, 'success');
    await redirecionarAposAutenticacao();
  } finally {
    carregandoGoogle.value = false;
  }
}

async function entrar(): Promise<void> {
  salvarPreferenciaEmail();
  carregandoLogin.value = true;

  try {
    const usuarioAutenticado = await authStore.login(login);
    notify(`${t('messages.welcome')}, ${usuarioAutenticado.nome}!`, 'success');
    await redirecionarAposAutenticacao();
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
    await authStore.solicitarAcesso(registro.value);
    registro.value = criarRegistroPadrao();
    await nextTick();
    await painelRegistroRef.value?.reset();
    abaAtual.value = 'login';
  } finally {
    carregandoRegistro.value = false;
  }
}

async function redirecionarAposAutenticacao(): Promise<void> {
  processandoRedirecionamento.value = true;

  try {
    const redirectPrioritario = typeof router.currentRoute.value.query.redirect === 'string'
      ? router.currentRoute.value.query.redirect
      : undefined;
    const destino = authStore.resolverDestinoAposLogin(redirectPrioritario);

    await router.push(destino);
  } finally {
    processandoRedirecionamento.value = false;
  }
}

// Computadas
const tituloAtual = computed(() => (abaAtual.value === 'login' ? 'Acessar sistema' : 'Solicitar acesso'));
const exibirOverlayAutenticacao = computed(() => {
  return carregandoLogin.value || carregandoGoogle.value || processandoRedirecionamento.value;
});
</script>
