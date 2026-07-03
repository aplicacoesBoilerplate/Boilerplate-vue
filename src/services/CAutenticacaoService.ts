// Types e Interfaces
import type { IAlterPassword, IConfirmPassword, ILogin } from '@/classes/models/ModelLogin';
import type { IUsuario } from '@/models/model/usuario/lUsuario';

// Services
import { CBaseHttpService } from '@/services/base/CBaseHttpService';
import { CUsuarioService } from '@/services/CUsuarioService';

interface IRespostaLogin {
  /**
   * Token JWT emitido pelo backend.
   */
  tokenJWT: string;
}

interface IRespostaUsuarioAutenticado {
  /**
   * Identificador do usuário autenticado no backend.
   */
  idUsuario: number;
}

/**
 * @description
 * Classe responsável por métodos de autenticação com implementação própria de métodos herdados para lidar com requisições HTTP.
 */
export class CAutenticacaoService extends CBaseHttpService {
  /**
   * @description
   * Método que faz login no sistema.
   * @param pLogin Interface que contém os dados de login.
   * @returns Promise<string> que contém o token JWT.
   */
  public static async login(pLogin: ILogin): Promise<string> {
    return (await CAutenticacaoService.post<IRespostaLogin, ILogin>('/auth/login', pLogin)).tokenJWT;
  }

  /**
   * @description
   * Método que busca o usuário autenticado no sistema.
   * @returns Promise<IUsuario> que contém o usuário autenticado.
   */
  public static async buscarUsuarioAutenticado(): Promise<IUsuario> {
    const resposta = await CAutenticacaoService.get<IRespostaUsuarioAutenticado>('/auth/me');

    return CUsuarioService.buscarPorId(resposta.idUsuario);
  }

  /**
   * @description
   * Método que confirma a senha do usuário autenticado no sistema.
   * @param pConfirmacao Interface que contém os dados de confirmação de senha.
   * @returns Promise<boolean> que contém true se a senha foi confirmada com sucesso.
   */
  public static async confirmarSenha(pConfirmacao: IConfirmPassword): Promise<boolean> {
    const usuario = await CAutenticacaoService.buscarUsuarioAutenticado();

    return CAutenticacaoService.post<boolean, IConfirmPassword>('/auth/confirmar', {
      ...pConfirmacao,
      email: usuario.email,
    });
  }

  /**
   * @description
   * Método que altera a senha do usuário autenticado no sistema.
   * @param pAlteracao Interface que contém os dados de alteração de senha.
   * @returns Promise<boolean> que contém true se a senha foi alterada com sucesso.
   */
  public static async alterarSenha(pAlteracao: IAlterPassword): Promise<boolean> {
    return CAutenticacaoService.put<boolean, IAlterPassword>('/auth/alter', pAlteracao);
  }

  /**
   * @description
   * Método para recuperação de senha, enviando token ao email do usuário.
   * @param pEmailUsuario Email do usuário que deseja recuperar a senha.
   * @returns Promise<boolean> Retorna true se o token foi enviado com sucesso.
   */
  public static async solicitarRecuperacaoDeSenha(pEmailUsuario: string): Promise<boolean> {
    return await CAutenticacaoService.post<boolean>('/auth/recuperar-senha', {
      emailUsuario: pEmailUsuario,
    });
  }
}
