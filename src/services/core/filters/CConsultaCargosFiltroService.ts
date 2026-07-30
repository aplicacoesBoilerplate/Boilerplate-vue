// Types e Interfaces
// Enums
import { EOperadoresFiltro } from '@/models/filters/enums/EOperadoresFiltro';
import type {
  IConsultaRegistrosFiltroPayload,
  IResultadoConsultaRegistrosFiltro,
} from '@/models/filters/IConsultaRegistrosFiltro';
import type { IFiltrosConsulta } from '@/models/filters/IFiltrosConsulta';
import type { ICargoRbac } from '@/models/model/core/rbac/rbac.model';

// Services
import { CRbacService } from '@/services/core/CRbacService';

/**
 * @description Service de consulta auxiliar de cargos usado pelos filtros avançados.
 */
export class CConsultaCargosFiltroService {
  public static async buscarRegistros(
    pPayload: IConsultaRegistrosFiltroPayload,
  ): Promise<IResultadoConsultaRegistrosFiltro<ICargoRbac>> {
    const filtros = CConsultaCargosFiltroService.montarFiltrosPesquisa(pPayload);
    const resposta = await CRbacService.consultar({
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

    return [
      {
        campo: pPayload.campo || 'nome',
        condicao: EOperadoresFiltro.CONTEM,
        valor: pPayload.termoPesquisa,
        dataInicio: null,
        dataFinal: null,
        valoresSelecionados: [],
      },
    ];
  }
}
