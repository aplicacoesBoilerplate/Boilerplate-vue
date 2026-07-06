// Types e Interfaces
import type { IResponsePaginacao } from '@/models/services/IResponsePaginacao';
import type { IFiltrosConsulta } from '@/models/filters/IFiltrosConsulta';
import type { IUsuario } from '@/models/model/usuario/lUsuario';
import type { IParametrosPaginacaoRequisicao } from '@/models/services/IParametrosPaginacaoRequisicao';

// Services
import { CBaseHttpService } from '@/services/base/CBaseHttpService';

interface IRespostaUsuario {
  /**
   * Usuário retornado pelo backend em consultas individuais.
   */
  usuario: IUsuario;
}

/**
 * @description
 * Classe responsável por métodos de usuários com implementação própria de métodos herdados para lidar com requisições HTTP.
 */
export class CUsuarioService extends CBaseHttpService {
  /**
   * @description Método que busca todos os usuários.
   * @param pParametros Parâmetros para ordenação e paginação da requisição.
   * @returns Promise<IResponsePaginacao<IUsuario>> que contém o header e os usuários.
   */
  public static async buscarTodos(
    pParametros: IParametrosPaginacaoRequisicao<IFiltrosConsulta[]> = {},
  ): Promise<IResponsePaginacao<IUsuario>> {
    return CUsuarioService.get<IResponsePaginacao<IUsuario>>('/usuarios/consulta', {
      params: pParametros,
    });
  }

  /**
   * @description Método que faz uma busca rápida de usuários por nome ou email.
   * @param pParametros Parâmetros para ordenação e paginação da requisição.
   * @returns Promise<IUsuario[]> que contém os usuários.
   */
  public static async pesquisar(
    pParametros: IParametrosPaginacaoRequisicao<IFiltrosConsulta[]> = {},
  ): Promise<IUsuario[]> {
    return CUsuarioService.post<IUsuario[]>('/usuarios/search', {
      params: pParametros,
    });
  }

  /**
   * @description Método que busca um usuário por ID.
   * @param pIdUsuario ID do usuário.
   * @returns Promise<IUsuario> que contém o usuário.
   */
  public static async buscarPorId(pIdUsuario?: number): Promise<IUsuario> {
    const resposta = await CUsuarioService.get<IRespostaUsuario>(`/usuarios/${pIdUsuario}`);

    return resposta.usuario;
  }

  /**
   * @description Método que cria um usuário.
   * @param pUsuario Usuário a ser criado.
   * @returns Promise<IUsuario> que contém o usuário criado.
   */
  public static async criar(pUsuario: IUsuario): Promise<IUsuario> {
    return CUsuarioService.post<IUsuario, IUsuario>('/usuarios', pUsuario);
  }

  /**
   * @description Método que atualiza um usuário.
   * @param pUsuario Usuário a ser atualizado.
   * @returns Promise<IUsuario> que contém o usuário atualizado.
   */
  public static async atualizar(pUsuario: IUsuario): Promise<IUsuario> {
    return CUsuarioService.put<IUsuario, IUsuario>(`/usuarios/${pUsuario.id}`, pUsuario);
  }

  /**
   * @description Método que exclui um usuário.
   * @param pIdUsuario ID do usuário a ser excluído.
   * @returns Promise<void> que contém a resposta da requisição.
   */
  public static async excluir(pIdUsuario: number): Promise<void> {
    await CUsuarioService.delete<void>(`/usuarios/${pIdUsuario}`);
  }
}
