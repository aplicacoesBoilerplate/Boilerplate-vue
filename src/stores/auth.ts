// Pinia
import { defineStore } from 'pinia';

// Ecossistema Vue
import { ref, computed } from 'vue';

// Stores
import { useListCacheStore } from './listCache';

// Types e Interfaces
import type { ILogin } from '@/models/model/autenticacao/autenticacao.models';
import type { IUsuario } from '@/models/model/usuario/lUsuario';

// Composables
import { useRequisicaoService } from '@/composables/useRequisicaoService';

// Services
import { CAutenticacaoService } from '@/services/CAutenticacaoService';

// Constantes
const TOKEN_STORAGE_KEY = 'token';

export const useAuthStore = defineStore('auth', () => {
  // Stores
  const listCacheStore = useListCacheStore();

  // Composables
  const requisicaoService = useRequisicaoService();

  // Reativas
  const user = ref<IUsuario | undefined>();
  const token = ref(sessionStorage.getItem(TOKEN_STORAGE_KEY) || localStorage.getItem(TOKEN_STORAGE_KEY) || null);

  // Computadas
  const carregando = computed(() => requisicaoService.carregando.value);
  const erro = computed(() => requisicaoService.erro.value);
  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.papel === 'ADMIN');

  // Funções
  function persistirToken(pToken: string): void {
    token.value = pToken;
    sessionStorage.setItem(TOKEN_STORAGE_KEY, pToken);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }

  async function carregarUsuarioAutenticado(): Promise<IUsuario> {
    const usuarioAutenticado = await requisicaoService.executar({
      metodo: async () => CAutenticacaoService.buscarUsuarioAutenticado(),
      parametros: undefined,
    });

    user.value = usuarioAutenticado;

    return usuarioAutenticado;
  }

  async function login(pLogin: ILogin): Promise<IUsuario> {
    const tokenAutenticacao = await requisicaoService.executar({
      metodo: CAutenticacaoService.login,
      parametros: pLogin,
    });

    persistirToken(tokenAutenticacao);

    return carregarUsuarioAutenticado();
  }

  async function fetchUser(): Promise<void> {
    if (!token.value) {
      return;
    }

    try {
      await carregarUsuarioAutenticado();
    } catch {
      logout();
    }
  }

  function logout(): void {
    token.value = null;
    user.value = undefined;
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    listCacheStore.clearAll();
  }

  return {
    user,
    token,
    carregando,
    erro,
    isAuthenticated,
    isAdmin,
    login,
    fetchUser,
    logout,
  };
});
