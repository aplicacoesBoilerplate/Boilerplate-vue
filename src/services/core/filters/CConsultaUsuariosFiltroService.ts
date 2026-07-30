// Types e Interfaces
// Enums
import { EOperadoresFiltro } from '@/models/filters/enums/EOperadoresFiltro';
import type {
  IConsultaRegistrosFiltroPayload,
  IResultadoConsultaRegistrosFiltro,
} from '@/models/filters/IConsultaRegistrosFiltro';
import type { IFiltrosConsulta } from '@/models/filters/IFiltrosConsulta';
import type { IUsuario } from '@/models/model/core/usuario.model';

// Services
import { CUsuarioService } from '@/services/core/CUsuarioService';

/**
 * @description Service de consulta auxiliar de usuários usado pelos filtros avançados.
 */
export class CConsultaUsuariosFiltroService {
  public static async buscarRegistros(
    pPayload: IConsultaRegistrosFiltroPayload,
  ): Promise<IResultadoConsultaRegistrosFiltro<IUsuario>> {
    const filtros = CConsultaUsuariosFiltroService.montarFiltrosPesquisa(pPayload);
    const resposta = await CUsuarioService.buscarTodos({
      limite: pPayload.limite,
      proximaEntrada: pPayload.proximaEntrada,
      ordenacao: 'asc',
      filtros,
    });

    return {
      registros: resposta.registros,
      proximaEntrada: resposta.proximaEntrada,
      possuiMais: resposta.possuiMais,
    };
  }

  private static montarFiltrosPesquisa(pPayload: IConsultaRegistrosFiltroPayload): IFiltrosConsulta[] {
    if (!pPayload.termoPesquisa) {
      return [];
    }

    const campoPesquisa = CConsultaUsuariosFiltroService.resolverCampoPesquisa(pPayload.campo);

    return [
      {
        campo: campoPesquisa,
        condicao: EOperadoresFiltro.CONTEM,
        valor: pPayload.termoPesquisa,
        dataInicio: null,
        dataFinal: null,
        valoresSelecionados: [],
      },
    ];
  }

  private static resolverCampoPesquisa(pCampo?: string): string {
    if (pCampo === 'id') {
      return 'idUsuario';
    }

    const camposUsuarios = new Set(['nome', 'email', 'telefone']);

    return pCampo && camposUsuarios.has(pCampo) ? pCampo : 'nome';
  }
}
