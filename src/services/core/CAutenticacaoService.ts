// Types e Interfaces
import type {
  IAlterPassword,
  IConfirmPassword,
  ILogin,
  ILoginGoogle,
  IRedefinicaoSenhaRecuperacao,
  IRespostaLogin,
  IRespostaUsuarioAutenticado,
  ISolicitacaoRecuperacaoSenha,
  IVerificacaoCodigoRecuperacaoSenha,
} from '@/models/model/core/autenticacao.model';
import type { ICargoRbac } from '@/models/model/core/rbac/rbac.model';
import type { IUsuario } from '@/models/model/core/usuario.model';
import type { IUsuarioSolicitacaoAcesso } from '@/models/model/core/usuario.solicitacao.model';

// Services
import { CBaseHttpService } from '@/services/base/CBaseHttpService';
import { CUsuarioService } from '@/services/core/CUsuarioService';

/**
 * Centraliza os contratos HTTP de autenticação.
 */
export class CAutenticacaoService extends CBaseHttpService {
  /**
   * Altera a senha do usuário autenticado.
   * @param pAlteracao
   */
  public static async alterarSenha(pAlteracao: IAlterPassword): Promise<boolean> {
    return CAutenticacaoService.put<boolean, IAlterPassword>('/auth/senha', pAlteracao);
  }

  /**
   * Consulta os dados do usuário autenticado.
   */
  public static async buscarUsuarioAutenticado(): Promise<IUsuario> {
    const resposta = await CAutenticacaoService.get<IRespostaUsuarioAutenticado>('/auth/me');

    return CUsuarioService.buscarPorId(resposta.idUsuario);
  }

  /**
   * Consulta o cargo e as permissões do usuário autenticado sem exigir acesso administrativo ao RBAC.
   */
  public static async buscarCargoUsuarioAutenticado(): Promise<ICargoRbac> {
    return CAutenticacaoService.get<ICargoRbac>('/auth/me/cargo');
  }

  /**
   * Confirma a senha do usuário autenticado.
   * @param pConfirmacao
   */
  public static async confirmarSenha(pConfirmacao: IConfirmPassword): Promise<boolean> {
    const usuario = await CAutenticacaoService.buscarUsuarioAutenticado();

    return CAutenticacaoService.post<boolean, IConfirmPassword>('/auth/senha/confirmar', {
      ...pConfirmacao,
      email: usuario.email,
    });
  }

  /**
   * Encerra a sessão no backend quando o projeto implementar invalidação remota.
   */
  public static async logout(): Promise<void> {
    return CAutenticacaoService.post<void>('/auth/logout');
  }

  /**
   * Autentica o usuário com e-mail e senha.
   * @param pLogin
   */
  public static async login(pLogin: ILogin): Promise<string> {
    const resposta = await CAutenticacaoService.post<IRespostaLogin, ILogin>('/auth/login', pLogin);

    return resposta.tokenJWT;
  }

  /**
   * Autentica o usuário usando a credencial retornada pelo Google.
   * @param pLoginGoogle
   */
  public static async loginGoogle(pLoginGoogle: ILoginGoogle): Promise<string> {
    const resposta = await CAutenticacaoService.post<IRespostaLogin, ILoginGoogle>('/auth/login/google', pLoginGoogle);

    return resposta.tokenJWT;
  }

  /**
   * Redefine a senha usando o código recebido por e-mail.
   * @param pRedefinicao
   */
  public static async redefinirSenhaRecuperacao(pRedefinicao: IRedefinicaoSenhaRecuperacao): Promise<boolean> {
    return CAutenticacaoService.post<boolean, IRedefinicaoSenhaRecuperacao>(
      '/auth/recuperacao-senha/redefinir',
      pRedefinicao,
    );
  }

  /**
   * Solicita acesso para criação de uma nova conta.
   * @param pSolicitacao
   */
  public static async solicitarAcesso(pSolicitacao: IUsuarioSolicitacaoAcesso): Promise<boolean> {
    return CAutenticacaoService.post<boolean, IUsuarioSolicitacaoAcesso>('/auth/solicitacoes-acesso', pSolicitacao);
  }

  /**
   * Solicita o envio do código de recuperação de senha.
   * @param pSolicitacao
   */
  public static async solicitarRecuperacaoSenha(pSolicitacao: ISolicitacaoRecuperacaoSenha): Promise<boolean> {
    return CAutenticacaoService.post<boolean, ISolicitacaoRecuperacaoSenha>(
      '/auth/recuperacao-senha/solicitar',
      pSolicitacao,
    );
  }

  /**
   * Verifica se o código de recuperação informado é válido.
   * @param pVerificacao
   */
  public static async verificarCodigoRecuperacaoSenha(
    pVerificacao: IVerificacaoCodigoRecuperacaoSenha,
  ): Promise<boolean> {
    return CAutenticacaoService.post<boolean, IVerificacaoCodigoRecuperacaoSenha>(
      '/auth/recuperacao-senha/verificar',
      pVerificacao,
    );
  }
}
