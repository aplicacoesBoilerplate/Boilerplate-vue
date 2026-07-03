<template>
  <div class="d-flex justify-center mb-5" v-if="loading">
    <v-progress-circular color="primary" indeterminate />
  </div>

  <FormLogin
    ref="refFormLogin"
    v-model:login="login"
    v-model:valid="isFormValid"
    @onSubmit="authLogin"
  >
    <template #actions>
      <div class="d-flex flex-row">
        <v-icon-btn
          icon="mdi-refresh"
          v-tooltip="t('tooltips.forms.reset')"
          variant="text"
          color="amber"
          class="ma-3"
          @click="handleReset"
        />

        <v-spacer />

        <v-icon-btn
          icon="mdi-lock-reset"
          v-tooltip="t('tooltips.forms.forgotPassword')"
          variant="text"
          color="primary"
          class="ma-3"
          @click="forgotPassword"
        />

        <v-spacer />

        <v-icon-btn
          icon="mdi-login-variant"
          v-tooltip="t('tooltips.forms.submit')"
          variant="text"
          color="success"
          class="ma-3"
          @click="onSubmit"
        />
      </div>
    </template>
  </FormLogin>
</template>

<script lang="ts" setup>
// Ecossistema Vue
import { computed, nextTick, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

// Stores
import { useAuthStore } from '@/stores/auth';

// Composables
import { useSnackbar } from '@/composables/useSnackbar';
import { useFormularioLogin } from '@/composables/useFormularioLogin';

// Componentes
import FormLogin from '@/components/forms/FormLogin.vue';

// Composables
const router = useRouter();
const { t } = useI18n();
const { notify } = useSnackbar();
const { login, resetarLogin, salvarPreferenciaEmail } = useFormularioLogin();

// Stores
const authStore = useAuthStore();

// Reativas
const refFormLogin = ref<InstanceType<typeof FormLogin> | null>(null);
const isFormValid = ref(false);

// Computadas
const loading = computed(() => authStore.carregando);

// Funções
async function authLogin(): Promise<void> {
  const usuarioLogado = await authStore.login(login);
  notify(`${t('messages.welcome')}, ${usuarioLogado.nome}!`, 'success');
}

async function handleReset(): Promise<void> {
  resetarLogin();
  await nextTick();
  refFormLogin.value?.reset();
}

function forgotPassword(): void {
  router.push({ name: 'ForgotPassword' });
}

async function onSubmit(): Promise<void> {
  salvarPreferenciaEmail();
  await nextTick();
  await refFormLogin.value?.submit();
}

</script>
