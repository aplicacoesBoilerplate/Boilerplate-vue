import type { IConsultaRegistros, IResultadoConsultaRegistros } from '@/models/consulta/IConsultaRegistros';
import type { IFiltrosConsulta } from '@/models/filters/IFiltrosConsulta';
import type { IUsuario } from '@/models/model/core/usuario.model';

import { CBaseHttpService } from '@/services/base/CBaseHttpService';
import { CConsultaGenericaService } from '@/services/base/CConsultaGenericaService';

interface IRespostaUsuario {
  usuario: IUsuario;
}

export class CUsuarioService extends CBaseHttpService {
  public static async buscarTodos(
    pParametros: IConsultaRegistros,
  ): Promise<IResultadoConsultaRegistros<IUsuario>> {
    return CConsultaGenericaService.consultarListagem<IUsuario>(
      '/usuarios/consulta',
      pParametros,
    );
  }

  public static async pesquisar(
    pParametros: IConsultaRegistros = { filtros: [], limite: 10, ordenacao: 'asc' },
  ): Promise<IUsuario[]> {
    return CUsuarioService.post<IUsuario[], IConsultaRegistros>(
      '/usuarios/search',
      pParametros,
    );
  }

  public static async consultarTodosRegistros(
    pParametros?: Partial<IConsultaRegistros>,
  ): Promise<IUsuario[]> {
    const resultado = await CConsultaGenericaService.consultarTodosRegistrosListagem<IUsuario>(
      '/usuarios/consulta',
      {
        filtros: pParametros?.filtros ?? [],
        limite: pParametros?.limite ?? 100,
        ordenacao: pParametros?.ordenacao ?? 'asc',
        proximaEntrada: pParametros?.proximaEntrada,
      },
    );

    return resultado.registros;
  }

  public static async buscarPorId(pIdUsuario?: number): Promise<IUsuario> {
    const resposta = await CUsuarioService.get<IRespostaUsuario>(`/usuarios/${pIdUsuario}`);

    return resposta.usuario;
  }

  public static async criar(pUsuario: IUsuario): Promise<IUsuario> {
    return CUsuarioService.post<IUsuario, IUsuario>('/usuarios', pUsuario);
  }

  public static async atualizar(pUsuario: IUsuario): Promise<IUsuario> {
    return CUsuarioService.put<IUsuario, IUsuario>(`/usuarios/${pUsuario.id}`, pUsuario);
  }

  public static async excluir(pIdUsuario: number): Promise<void> {
    await CUsuarioService.delete<void>(`/usuarios/${pIdUsuario}`);
  }
}
