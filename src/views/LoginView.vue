<template>
  <v-container
    class="d-flex align-center justify-center py-8"
    style="min-height: 90vh"
    fluid
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
            {{ t('common.login.loginTab') }}
          </v-tab>

        </v-tabs>

        <div class="login-view__panels pt-5">
          <div
            :class="[
              'v-window-item login-view__panel',
              abaAtual === 'login' ? 'v-window-item--active' : 'login-view__panel--inactive',
            ]"
            :aria-hidden="abaAtual !== 'login'"
          >
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
          </div>

        </div>
      </v-card-text>
    </v-card>

    <OverlayFullscream v-model:exibirOverlay="exibirOverlayAutenticacao">
      <template #mensagem>
        <div class="text-subtitle-1 font-weight-bold">{{ t('common.login.preparingAccess') }}</div>

        <div class="text-body-2 text-high-emphasis text-center">{{ t('common.login.validatingAccess') }}</div>
      </template>
    </OverlayFullscream>
  </v-container>
</template>

<script lang="ts" setup>
// Ecossistema Vue
import { computed, nextTick, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

// Stores
import { useAuthStore } from '@/stores/auth.store';

// Types e Interfaces
// Composables
import { useFormularioLogin } from '@/composables/useFormularioLogin';
import { useSnackbar } from '@/composables/useSnackbar';

// Componentes
import PainelLogin from '@/components/forms/fixtures/autenticacao/PainelLogin.vue';
import OverlayFullscream from '@/components/layouts/OverlayFullscream.vue';

type TAbaAutenticacao = 'login';

// Composables
const router = useRouter();
const { t } = useI18n();
const { notify } = useSnackbar();
const { login, resetarLogin, salvarPreferenciaEmail } = useFormularioLogin();

// Stores
const authStore = useAuthStore();

// Reativas
const painelLoginRef = ref<InstanceType<typeof PainelLogin> | null>(null);
const abaAtual = ref<TAbaAutenticacao>('login');
const loginValido = ref(false);
const carregandoLogin = ref(false);
const carregandoGoogle = ref(false);
const processandoRedirecionamento = ref(false);

// Funções
function handleErroLoginGoogle(pMensagem: string): void {
  notify(pMensagem, 'warning');
}

function irParaRecuperacaoSenha(): void {
  router.push({ name: 'RecuperacaoSenha' });
}

async function autenticarGoogle(pCredential?: string): Promise<void> {
  if (!pCredential) {
    notify(t('common.login.googleNotConfigured'), 'warning');
    return;
  }

  carregandoGoogle.value = true;

  try {
    const usuarioAutenticado = await authStore.loginGoogle(pCredential);
    notify(`${t('messages.welcome')}, ${usuarioAutenticado.nome}!`, 'success');
    await redirecionarAposAutenticacao();
  } catch {
    return;
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
  } catch {
    return;
  } finally {
    carregandoLogin.value = false;
  }
}

async function resetarFormularioLogin(): Promise<void> {
  resetarLogin();
  await nextTick();
  await painelLoginRef.value?.reset();
}

async function redirecionarAposAutenticacao(): Promise<void> {
  processandoRedirecionamento.value = true;

  try {
    const redirectPrioritario =
      typeof router.currentRoute.value.query.redirect === 'string'
        ? router.currentRoute.value.query.redirect
        : undefined;
    const destino = authStore.resolverDestinoAposLogin(redirectPrioritario);

    await router.push(destino);
  } finally {
    processandoRedirecionamento.value = false;
  }
}

// Computadas
const tituloAtual = computed(() => t('common.login.accessTitle'));
const exibirOverlayAutenticacao = computed(() => {
  return carregandoLogin.value || carregandoGoogle.value || processandoRedirecionamento.value;
});
</script>

<style scoped>
.login-view__panels {
  position: relative;
}

.login-view__panel {
  opacity: 1;
  transition: opacity 180ms ease;
  width: 100%;
}

.login-view__panel--inactive {
  inset: 20px 0 auto;
  opacity: 0;
  pointer-events: none;
  position: absolute;
}
</style>
