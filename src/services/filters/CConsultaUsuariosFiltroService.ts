// Types e Interfaces
import type {
  IConsultaRegistrosFiltroPayload,
  IResultadoConsultaRegistrosFiltro,
} from '@/models/filters/IConsultaRegistrosFiltro';
import type { IFiltrosConsulta } from '@/models/filters/IFiltrosConsulta';
import type { IUsuario } from '@/models/model/usuario/lUsuario';

// Enums
import { EOperadoresFiltro } from '@/models/filters/enums/EOperadoresFiltro';

// Services
import { CUsuarioService } from '@/services/CUsuarioService';

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
      ordem: 'asc',
      filtros,
    });

    return {
      registros: resposta.items,
      proximaEntrada: resposta.proximaEntrada,
      possuiMais: resposta.temMaisRegistros,
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
