<template>
  <v-tooltip
    :text="textoTooltip"
    location="bottom"
  >
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        class="mx-1"
        :color="instalacaoDisponivel ? 'success' : 'default'"
        :disabled="!instalacaoDisponivel"
        icon="mdi-cellphone-arrow-down"
        size="small"
        variant="text"
        @click="instalarPwa"
      />
    </template>
  </v-tooltip>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

// Composables
import { useSnackbar } from '@/composables/useSnackbar';

/**
 * @property {'accepted' | 'dismissed'} outcome - Resultado da escolha feita pelo usuário no prompt nativo.
 * @property {string} platform - Plataforma em que o aplicativo será instalado.
 */
interface IEscolhaUsuarioPwa {
  outcome: 'accepted' | 'dismissed';
  platform: string;
}

/**
 * @property {Function} prompt - Exibe o prompt nativo de instalação do navegador.
 * @property {Promise<IEscolhaUsuarioPwa>} userChoice - Resultado da escolha feita pelo usuário no prompt nativo.
 */
interface IEventoInstalacaoPwa extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<IEscolhaUsuarioPwa>;
}

// Composables
const { notify } = useSnackbar();
const { t } = useI18n();

// Reativas
const eventoInstalacao = ref<IEventoInstalacaoPwa | null>(null);

// Computadas
const instalacaoDisponivel = computed(() => !!eventoInstalacao.value);
const textoTooltip = computed(() =>
  instalacaoDisponivel.value
    ? t('components.btnInstalarPwa.instalarAplicativo')
    : t('components.btnInstalarPwa.instalacaoIndisponivel'),
);

// Funções

/**
 * Lida com o evento 'beforeinstallprompt', armazenando-o caso a instalação esteja disponível.
 * @param pEvento - Evento que dispara a instalação do aplicativo.
 */
function prepararInstalacaoPwa(pEvento: Event): void {
  pEvento.preventDefault();
  eventoInstalacao.value = pEvento as IEventoInstalacaoPwa;
}

/**
 * Instala o aplicativo no dispositivo do usuário, exibindo o prompt nativo de instalação.
 */
async function instalarPwa(): Promise<void> {
  if (!eventoInstalacao.value) {
    return;
  }

  const eventoAtual = eventoInstalacao.value;

  await eventoAtual.prompt();
  const escolha = await eventoAtual.userChoice;

  if (escolha.outcome === 'accepted') {
    notify(t('components.btnInstalarPwa.instalacaoIniciada'), 'success');
  }

  eventoInstalacao.value = null;
}

// Lifecycle Hooks
onMounted(() => {
  window.addEventListener('beforeinstallprompt', prepararInstalacaoPwa);
});

onBeforeUnmount(() => {
  window.removeEventListener('beforeinstallprompt', prepararInstalacaoPwa);
});
</script>
