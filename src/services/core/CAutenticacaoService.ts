// Types e Interfaces
import type {
  IRespostaLogin,
  IRespostaUsuarioAutenticado,
  TAlterarSenha,
  TConfirmarSenha,
  TEmailAuth,
  TLogin,
  TLoginGoogle,
  TRecuperacaoSenha,
  TRedefinicaoRecuperacaoSenha,
} from '@/models/model/core/autenticacao.model';
import type { ICargoRbac } from '@/models/model/core/rbac/rbac.model';
import type { IUsuario } from '@/models/model/core/usuario.model';
import type { IUsuarioSolicitacaoAcesso } from '@/models/model/core/usuario.solicitacao.model';

// Services
import { CBaseHttpService } from '@/services/base/CBaseHttpService';
import { usuarioService } from '@/services/core/CUsuarioService';

/**
 * Centraliza os contratos HTTP de autenticação.
 */
export class CAutenticacaoService extends CBaseHttpService {
  /**
   * @description Altera a senha do usuário autenticado.
   * @param pAlteracao - Dados da nova senha e sua confirmação.
   * @returns Indica se a alteração foi concluída.
   */
  public async alterarSenha(pAlteracao: TAlterarSenha): Promise<boolean> {
    return this.put<TAlterarSenha, boolean>({ pathUrl: '/auth/senha', body: pAlteracao });
  }

  /**
   * @description Consulta os dados do usuário autenticado.
   * @returns Usuário correspondente à sessão atual.
   */
  public async buscarUsuarioAutenticado(): Promise<IUsuario> {
    const resposta = await this.get<IRespostaUsuarioAutenticado>({ pathUrl: '/auth/me' });

    return usuarioService.buscarPorId(resposta.idUsuario);
  }

  /**
   * @description Consulta o cargo e as permissões do usuário autenticado sem exigir acesso administrativo ao RBAC.
   * @returns Cargo e permissões do usuário autenticado.
   */
  public async buscarCargoUsuarioAutenticado(): Promise<ICargoRbac> {
    return this.get<ICargoRbac>({ pathUrl: '/auth/me/cargo' });
  }

  /**
   * @description Confirma a senha do usuário autenticado.
   * @param pConfirmacao - Senha informada para confirmação.
   * @returns Indica se a senha foi confirmada.
   */
  public async confirmarSenha(pConfirmacao: TConfirmarSenha): Promise<boolean> {
    const usuario = await this.buscarUsuarioAutenticado();

    return this.post<TConfirmarSenha, boolean>({ pathUrl: '/auth/senha/confirmar', body: { ...pConfirmacao, email: usuario.email } });
  }

  /**
   * @description Encerra a sessão no backend quando o projeto implementar invalidação remota.
   * @param pToken - Credencial capturada antes da limpeza local imediata.
   * @param pSignal - Sinal que limita o melhor-esforço de revogação remota.
   * @returns Finaliza quando o logout remoto for concluído.
   */
  public async logout(pToken: string, pSignal?: AbortSignal): Promise<void> {
    await this.post<object, void>({
      pathUrl: '/auth/logout',
      body: {},
      axiosConfig: {
        signal: pSignal,
        headers: { Authorization: `Bearer ${pToken}` },
      },
    });
  }

  /**
   * @description Autentica o usuário com identificação de acesso e senha.
   * @param pLogin - Credenciais de autenticação.
   * @returns Token JWT emitido pelo backend.
   */
  public async login(pLogin: TLogin): Promise<string> {
    const resposta = await this.post<TLogin, IRespostaLogin>({ pathUrl: '/auth/login', body: pLogin });

    return resposta.tokenJWT;
  }

  /**
   * @description Autentica o usuário usando a credencial retornada pelo Google.
   * @param pLoginGoogle - Credencial emitida pelo Google Identity Services.
   * @returns Token JWT emitido pelo backend.
   */
  public async loginGoogle(pLoginGoogle: TLoginGoogle): Promise<string> {
    const resposta = await this.post<TLoginGoogle, IRespostaLogin>({ pathUrl: '/auth/login/google', body: pLoginGoogle });

    return resposta.tokenJWT;
  }

  /**
   * @description Redefine a senha usando o código recebido por e-mail.
   * @param pRedefinicao - E-mail, código e nova senha para recuperação.
   * @returns Indica se a senha foi redefinida.
   */
  public async redefinirSenhaRecuperacao(pRedefinicao: TRedefinicaoRecuperacaoSenha): Promise<boolean> {
    return this.post<TRedefinicaoRecuperacaoSenha, boolean>({ pathUrl: '/auth/recuperacao-senha/redefinir', body: pRedefinicao });
  }

  /**
   * @description Solicita acesso para criação de uma nova conta.
   * @param pSolicitacao - Dados do usuário que solicita acesso.
   * @returns Indica se a solicitação foi registrada.
   */
  public async solicitarAcesso(pSolicitacao: IUsuarioSolicitacaoAcesso): Promise<boolean> {
    return this.post<IUsuarioSolicitacaoAcesso, boolean>({ pathUrl: '/auth/solicitacoes-acesso', body: pSolicitacao });
  }

  /**
   * @description Solicita o envio do código de recuperação de senha.
   * @param pSolicitacao - E-mail para o qual o código será enviado.
   * @returns Indica se o código foi solicitado.
   */
  public async solicitarRecuperacaoSenha(pSolicitacao: TEmailAuth): Promise<boolean> {
    return this.post<TEmailAuth, boolean>({ pathUrl: '/auth/recuperacao-senha/solicitar', body: pSolicitacao });
  }

  /**
   * @description Verifica se o código de recuperação informado é válido.
   * @param pVerificacao - E-mail e código de recuperação informados.
   * @returns Indica se o código é válido.
   */
  public async verificarCodigoRecuperacaoSenha(pVerificacao: TRecuperacaoSenha): Promise<boolean> {
    return this.post<TRecuperacaoSenha, boolean>({ pathUrl: '/auth/recuperacao-senha/verificar', body: pVerificacao });
  }
}

export const autenticacaoService = new CAutenticacaoService();
