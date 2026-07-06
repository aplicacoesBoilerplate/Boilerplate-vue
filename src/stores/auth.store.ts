// Ecossistema Vue
import { computed, ref } from 'vue';
import type { LocationQueryRaw, RouteLocationRaw } from 'vue-router';

// Pinia
import { defineStore } from 'pinia';

// Stores
import { useListaCacheStore } from './listaCache.store';

// Types e Interfaces
import type { IFiltrosConsulta } from '@/models/filters/IFiltrosConsulta';
import type {
  ILogin,
  ILoginGoogle,
  IRedefinicaoSenhaRecuperacao,
  ISolicitacaoRecuperacaoSenha,
  IVerificacaoCodigoRecuperacaoSenha,
} from '@/models/model/autenticacao/autenticacao.models';
import type { IUsuario } from '@/models/model/usuario/lUsuario';
import type { IUsuarioSolicitacaoAcesso } from '@/models/model/usuario/IUsuarioSolicitacaoAcesso';

// Composables
import { useRequisicaoService } from '@/composables/useRequisicaoService';

// Services
import { CAutenticacaoService } from '@/services/CAutenticacaoService';
import { CRbacMockService } from '@/services/CRbacMockService';

// Constantes
const TOKEN_STORAGE_KEY = 'token';

export const useAuthStore = defineStore('auth', () => {
  // Stores
  const listCacheStore = useListaCacheStore();

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
  function limparSessaoLocal(): void {
    token.value = null;
    user.value = undefined;
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    listCacheStore.clearAll();
  }

  function persistirToken(pToken: string): void {
    token.value = pToken;
    sessionStorage.setItem(TOKEN_STORAGE_KEY, pToken);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }

  function logout(): void {
    limparSessaoLocal();
  }

  function resolverDestinoAposLogin(pRedirectPrioritario?: string): RouteLocationRaw {
    if (pRedirectPrioritario) {
      return pRedirectPrioritario;
    }

    const cargoUsuario = user.value?.papel
      ? CRbacMockService.buscarCargoPorPapel(user.value.papel)
      : undefined;
    const redirecionamentoInicial = cargoUsuario?.redirecionamentoInicial;

    if (!redirecionamentoInicial?.path) {
      return '/';
    }

    return {
      path: redirecionamentoInicial.path,
      query: serializarFiltrosParaQuery(redirecionamentoInicial.filtros),
    };
  }

  function serializarFiltrosParaQuery(pFiltros: IFiltrosConsulta[]): LocationQueryRaw {
    return pFiltros.reduce<LocationQueryRaw>((pQuery, pFiltro) => {
      if (!pFiltro.campo || !pFiltro.condicao) {
        return pQuery;
      }

      const valoresSelecionados = pFiltro.valoresSelecionados ?? [];
      const valoresFiltro = valoresSelecionados.length > 0
        ? valoresSelecionados
        : [pFiltro.valor ?? ''];
      const valorSerializado = valoresFiltro.map((pValor) => String(pValor)).join(',');
      const valorQuery = `${pFiltro.condicao}:${valorSerializado}`;
      const valorAtual = pQuery[pFiltro.campo];

      if (Array.isArray(valorAtual)) {
        pQuery[pFiltro.campo] = [...valorAtual, valorQuery];
        return pQuery;
      }

      if (valorAtual) {
        pQuery[pFiltro.campo] = [String(valorAtual), valorQuery];
        return pQuery;
      }

      pQuery[pFiltro.campo] = valorQuery;

      return pQuery;
    }, {});
  }

  async function carregarUsuarioAutenticado(): Promise<IUsuario> {
    const usuarioAutenticado = await requisicaoService.executar({
      metodo: async () => CAutenticacaoService.buscarUsuarioAutenticado(),
      parametros: undefined,
    });

    user.value = usuarioAutenticado;

    return usuarioAutenticado;
  }

  async function fetchUser(): Promise<void> {
    if (!token.value) {
      return;
    }

    try {
      await carregarUsuarioAutenticado();
    } catch {
      limparSessaoLocal();
    }
  }

  async function login(pLogin: ILogin): Promise<IUsuario> {
    const tokenAutenticacao = await requisicaoService.executar({
      metodo: CAutenticacaoService.login,
      parametros: pLogin,
    });

    persistirToken(tokenAutenticacao);

    return carregarUsuarioAutenticado();
  }

  async function loginGoogle(pCredential: string): Promise<IUsuario> {
    const parametros: ILoginGoogle = {
      credential: pCredential,
    };

    const tokenAutenticacao = await requisicaoService.executar({
      metodo: CAutenticacaoService.loginGoogle,
      parametros,
    });

    persistirToken(tokenAutenticacao);

    return carregarUsuarioAutenticado();
  }

  async function redefinirSenhaRecuperacao(pRedefinicao: IRedefinicaoSenhaRecuperacao): Promise<boolean> {
    return requisicaoService.executar({
      metodo: CAutenticacaoService.redefinirSenhaRecuperacao,
      parametros: pRedefinicao,
      sucesso: {
        mensagem: 'Senha redefinida com sucesso.',
        tipo: 'success',
      },
    });
  }

  async function solicitarAcesso(pSolicitacao: IUsuarioSolicitacaoAcesso): Promise<boolean> {
    return requisicaoService.executar({
      metodo: CAutenticacaoService.solicitarAcesso,
      parametros: pSolicitacao,
      sucesso: {
        mensagem: 'Solicitação de acesso registrada. Aguarde a liberação de um administrador.',
        tipo: 'success',
      },
    });
  }

  async function solicitarRecuperacaoSenha(pEmail: string): Promise<boolean> {
    const parametros: ISolicitacaoRecuperacaoSenha = {
      email: pEmail,
    };

    return requisicaoService.executar({
      metodo: CAutenticacaoService.solicitarRecuperacaoSenha,
      parametros,
      sucesso: {
        mensagem: 'Código de recuperação enviado.',
        tipo: 'success',
      },
    });
  }

  async function verificarCodigoRecuperacaoSenha(pVerificacao: IVerificacaoCodigoRecuperacaoSenha): Promise<boolean> {
    return requisicaoService.executar({
      metodo: CAutenticacaoService.verificarCodigoRecuperacaoSenha,
      parametros: pVerificacao,
      sucesso: {
        mensagem: 'Código validado com sucesso.',
        tipo: 'success',
      },
    });
  }

  return {
    user,
    token,
    carregando,
    erro,
    isAuthenticated,
    isAdmin,
    fetchUser,
    login,
    loginGoogle,
    logout,
    resolverDestinoAposLogin,
    redefinirSenhaRecuperacao,
    solicitarAcesso,
    solicitarRecuperacaoSenha,
    verificarCodigoRecuperacaoSenha,
  };
});
