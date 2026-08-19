// Ecossistema Vue
import { onMounted, onUnmounted } from 'vue';

// Stores
import { useAuthStore } from '@/stores/auth.store';

/**
 * @description Mantém as permissões do cargo autenticado atualizadas quando a sessão volta ao foco.
 * @returns Função que permite disparar a sincronização de permissões manualmente.
 */
export function useSincronizacaoPermissoesRbac() {
  const authStore = useAuthStore();

  async function sincronizarPermissoes(): Promise<void> {
    if (!authStore.isAuthenticated || !authStore.user) {
      return;
    }

    await authStore.atualizarPermissoesUsuarioAutenticado();
  }

  function sincronizarQuandoVisivel(): void {
    if (document.visibilityState === 'visible') {
      void sincronizarPermissoes();
    }
  }

  onMounted(() => {
    window.addEventListener('focus', sincronizarPermissoes);
    document.addEventListener('visibilitychange', sincronizarQuandoVisivel);
  });

  onUnmounted(() => {
    window.removeEventListener('focus', sincronizarPermissoes);
    document.removeEventListener('visibilitychange', sincronizarQuandoVisivel);
  });

  return {
    sincronizarPermissoes,
  };
}
