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
 * @property {Promise<IEscolhaUsuarioPwa>} escolhaUsuario - Resultado da escolha feita pelo usuário no prompt nativo.
 */
interface IEventoInstalacaoPwa extends Event {
  prompt: () => Promise<void>;
  escolhaUsuario: Promise<IEscolhaUsuarioPwa>;
}

// Composables
const { notify } = useSnackbar();

// Reativas
const eventoInstalacao = ref<IEventoInstalacaoPwa | null>(null);

// Computadas
const instalacaoDisponivel = computed(() => !!eventoInstalacao.value);
const textoTooltip = computed(() =>
  instalacaoDisponivel.value ? 'Instalar aplicativo' : 'Instalação indisponível neste navegador',
);

// Funções

/**
 * Lida com o evento 'beforeinstallprompt', armazenando-o caso a instalação esteja disponível.
 * @param pEvento - Evento que dispara a instalação do aplicativo.
 */
function handleBeforeInstallPrompt(pEvento: Event): void {
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
  const escolha = await eventoAtual.escolhaUsuario;

  if (escolha.outcome === 'accepted') {
    notify('Instalação do aplicativo iniciada.', 'success');
  }

  eventoInstalacao.value = null;
}

// Lifecycle Hooks
onMounted(() => {
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
});

onBeforeUnmount(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
});
</script>
