// Ecossistema Vue
import { computed, onScopeDispose, ref } from 'vue';
// Pinia
import { defineStore } from 'pinia';

import { useGenericFilterStore } from '@/stores/genericFilter.store';
import { useGenericListStore } from '@/stores/genericList.store';
import { usePreferencesStore } from '@/stores/preferences.store';

// Types e Interfaces
import type { TFiltroConsultaSerializado } from '@/models/filters/IFiltrosConsulta';
import type {
  TEmailAuth,
  TLogin,
  TLoginGoogle,
  TRecuperacaoSenha,
  TRedefinicaoRecuperacaoSenha,
} from '@/models/model/core/autenticacao.model';
import type { ICargoRbac } from '@/models/model/core/rbac/rbac.model';
import type { IUsuario } from '@/models/model/core/usuario.model';
import type { IUsuarioSolicitacaoAcesso } from '@/models/model/core/usuario.solicitacao.model';
import type { LocationQueryRaw, RouteLocationRaw } from 'vue-router';

// Composables
import { useRequisicaoService } from '@/composables/useRequisicaoService';

import {
  broadcastSessionTermination,
  clearPrivateBrowserState,
  subscribeToSessionTermination,
} from '@/services/base/sessionLifecycle';
// Services
import { autenticacaoService } from '@/services/core/CAutenticacaoService';

import { CTradutor } from '@/classes/Utils/CTradutor';

// Constantes
const TOKEN_STORAGE_KEY = 'token';

export const useAuthStore = defineStore('auth', () => {
  // Stores
  const genericListStore = useGenericListStore();
  const genericFilterStore = useGenericFilterStore();
  const preferencesStore = usePreferencesStore();

  // Composables
  const requisicaoService = useRequisicaoService();

  // Reativas
  const user = ref<IUsuario | undefined>();
  const cargoAtual = ref<ICargoRbac | undefined>();
  const token = ref(sessionStorage.getItem(TOKEN_STORAGE_KEY) || localStorage.getItem(TOKEN_STORAGE_KEY) || null);
  let atualizacaoPermissoesEmAndamento: Promise<ICargoRbac | undefined> | null = null;
  let encerramentoSessaoEmAndamento: Promise<void> | null = null;

  // Computadas
  const carregando = computed(() => requisicaoService.carregando.value);
  const erro = computed(() => requisicaoService.erro.value);
  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.papel === 'ADMIN');

  // Funções
  function limparSessaoLocal(): void {
    token.value = null;
    user.value = undefined;
    cargoAtual.value = undefined;
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    genericListStore.clearAllContexts();
    genericFilterStore.clearAllContexts();
    preferencesStore.clearLocalPreferences();
    clearPrivateBrowserState();
  }

  function persistirToken(pToken: string): void {
    token.value = pToken;
    sessionStorage.setItem(TOKEN_STORAGE_KEY, pToken);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }

  async function redirecionarParaLogin(): Promise<void> {
    const { default: router } = await import('@/router');
    if (router.currentRoute.value.name !== 'Login') {
      await router.replace({ name: 'Login' });
    }
  }

  function encerrarSessao(
    pOptions: { remoto?: boolean; broadcast?: boolean; redirecionar?: boolean } = {},
  ): Promise<void> {
    if (encerramentoSessaoEmAndamento) return encerramentoSessaoEmAndamento;

    const { remoto = true, broadcast = true, redirecionar = true } = pOptions;
    const tokenEncerrado = token.value;
    limparSessaoLocal();
    if (broadcast) broadcastSessionTermination();

    const encerramento = (async () => {
      try {
        if (remoto && tokenEncerrado) {
          await autenticacaoService.logout(tokenEncerrado, AbortSignal.timeout(5_000));
        }
      } catch {
        // A indisponibilidade do backend nunca impede a remocao local das credenciais.
      } finally {
        if (redirecionar) await redirecionarParaLogin();
      }
    })();

    const sharedEncerramento = encerramento.finally(() => {
      if (encerramentoSessaoEmAndamento === sharedEncerramento) {
        encerramentoSessaoEmAndamento = null;
      }
    });
    encerramentoSessaoEmAndamento = sharedEncerramento;
    return encerramentoSessaoEmAndamento;
  }

  function logout(): Promise<void> {
    return encerrarSessao();
  }

  const unsubscribeSessionTermination = subscribeToSessionTermination(() => {
    void encerrarSessao({ remoto: false, broadcast: false });
  });
  onScopeDispose(unsubscribeSessionTermination);

  function resolverDestinoAposLogin(pRedirectPrioritario?: string): RouteLocationRaw {
    if (pRedirectPrioritario) {
      return pRedirectPrioritario;
    }

    const redirecionamentoInicial = cargoAtual.value?.redirecionamentoInicial;

    if (!redirecionamentoInicial?.path) {
      return '/';
    }

    return {
      path: redirecionamentoInicial.path,
      query: serializarFiltrosParaQuery(redirecionamentoInicial.filtros),
    };
  }

  function serializarFiltrosParaQuery(pFiltros: TFiltroConsultaSerializado[]): LocationQueryRaw {
    return pFiltros.reduce<LocationQueryRaw>((pQuery, pFiltro) => {
      if (!pFiltro.campo || !pFiltro.condicao) {
        return pQuery;
      }

      const valoresSelecionados = pFiltro.valoresSelecionados ?? [];
      const valoresFiltro = valoresSelecionados.length > 0 ? valoresSelecionados : [pFiltro.valor ?? ''];
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
      metodo: async () => autenticacaoService.buscarUsuarioAutenticado(),
      parametros: undefined,
    });

    user.value = usuarioAutenticado;
    await atualizarPermissoesUsuarioAutenticado(true);

    await preferencesStore.carregarPreferenciasBackend();

    return usuarioAutenticado;
  }

  async function atualizarPermissoesUsuarioAutenticado(pPropagarErro = false): Promise<ICargoRbac | undefined> {
    if (!user.value?.papel) {
      cargoAtual.value = undefined;
      return undefined;
    }

    const requisicao =
      atualizacaoPermissoesEmAndamento ??
      autenticacaoService.buscarCargoUsuarioAutenticado().then((pCargo) => {
        cargoAtual.value = pCargo;
        return pCargo;
      });

    atualizacaoPermissoesEmAndamento = requisicao;

    try {
      return await requisicao;
    } catch (pErro) {
      if (pPropagarErro) {
        throw pErro;
      }

      return cargoAtual.value;
    } finally {
      if (atualizacaoPermissoesEmAndamento === requisicao) {
        atualizacaoPermissoesEmAndamento = null;
      }
    }
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

  async function login(pLogin: TLogin): Promise<IUsuario> {
    const tokenAutenticacao = await requisicaoService.executar({
      metodo: (pLoginPayload: TLogin) => autenticacaoService.login(pLoginPayload),
      parametros: pLogin,
    });

    persistirToken(tokenAutenticacao);

    return carregarUsuarioAutenticado();
  }

  async function loginGoogle(pCredential: string): Promise<IUsuario> {
    const parametros: TLoginGoogle = {
      credential: pCredential,
    };

    const tokenAutenticacao = await requisicaoService.executar({
      metodo: (pLoginGooglePayload: TLoginGoogle) => autenticacaoService.loginGoogle(pLoginGooglePayload),
      parametros,
    });

    persistirToken(tokenAutenticacao);

    return carregarUsuarioAutenticado();
  }

  async function redefinirSenhaRecuperacao(pRedefinicao: TRedefinicaoRecuperacaoSenha): Promise<boolean> {
    return requisicaoService.executar({
      metodo: (pRedefinicaoPayload: TRedefinicaoRecuperacaoSenha) => autenticacaoService.redefinirSenhaRecuperacao(pRedefinicaoPayload),
      parametros: pRedefinicao,
      sucesso: {
        mensagem: CTradutor.traduzir('common.messages.passwordReset'),
        tipo: 'success',
      },
    });
  }

  async function solicitarAcesso(pSolicitacao: IUsuarioSolicitacaoAcesso): Promise<boolean> {
    return requisicaoService.executar({
      metodo: (pSolicitacaoPayload: IUsuarioSolicitacaoAcesso) => autenticacaoService.solicitarAcesso(pSolicitacaoPayload),
      parametros: pSolicitacao,
      sucesso: {
        mensagem: CTradutor.traduzir('common.messages.accessRequested'),
        tipo: 'success',
      },
    });
  }

  async function solicitarRecuperacaoSenha(pEmail: string): Promise<boolean> {
    const parametros: TEmailAuth = {
      email: pEmail,
    };

    return requisicaoService.executar({
      metodo: (pSolicitacaoPayload: TEmailAuth) => autenticacaoService.solicitarRecuperacaoSenha(pSolicitacaoPayload),
      parametros,
      sucesso: {
        mensagem: CTradutor.traduzir('common.messages.recoverySent'),
        tipo: 'success',
      },
    });
  }

  async function verificarCodigoRecuperacaoSenha(pVerificacao: TRecuperacaoSenha): Promise<boolean> {
    return requisicaoService.executar({
      metodo: (pVerificacaoPayload: TRecuperacaoSenha) => autenticacaoService.verificarCodigoRecuperacaoSenha(pVerificacaoPayload),
      parametros: pVerificacao,
      sucesso: {
        mensagem: CTradutor.traduzir('common.messages.recoveryValidated'),
        tipo: 'success',
      },
    });
  }

  return {
    user,
    cargoAtual,
    token,
    carregando,
    erro,
    isAuthenticated,
    isAdmin,
    fetchUser,
    login,
    loginGoogle,
    logout,
    encerrarSessao,
    atualizarPermissoesUsuarioAutenticado,
    resolverDestinoAposLogin,
    redefinirSenhaRecuperacao,
    solicitarAcesso,
    solicitarRecuperacaoSenha,
    verificarCodigoRecuperacaoSenha,
  };
});
