import type { IConsultaRegistrosFiltroPayload, IResultadoConsultaRegistrosFiltro } from '@/models/filters/IConsultaRegistrosFiltro';
import type { IFiltrosConsulta } from '@/models/filters/IFiltrosConsulta';
import type { IConsultaRegistros, IResultadoConsultaRegistros } from '@/models/consulta/IConsultaRegistros';

import { CBaseHttpService } from './CBaseHttpService';

export class CConsultaGenericaService extends CBaseHttpService {
  static async consultar<T, I extends object>(
    pPathUrl: string,
    pPayload: IConsultaRegistrosFiltroPayload<T>,
    pCamposValidos?: Set<string>,
  ): Promise<IResultadoConsultaRegistros<I>> {
    const filtros = CConsultaGenericaService.resolverPayload(pPayload, undefined, pCamposValidos);
    const body: IConsultaRegistros = {
      filtros,
      limite: pPayload.limite,
      proximaEntrada: pPayload.proximaEntrada,
      ordenacao: pPayload.ordenacao,
    };
    return CConsultaGenericaService.post<IResultadoConsultaRegistros<I>, IConsultaRegistros>(
      pPathUrl,
      body,
    );
  }

  static async consultarListagem<T extends object>(
    pPathUrl: string,
    pPayload: IConsultaRegistros,
  ): Promise<IResultadoConsultaRegistros<T>> {
    return CConsultaGenericaService.post<IResultadoConsultaRegistros<T>, IConsultaRegistros>(
      pPathUrl,
      pPayload,
    );
  }

  static async consultarTodosRegistros<T, I extends object>(
    pPathUrl: string,
    pPayload: IConsultaRegistrosFiltroPayload<T>,
    pCamposValidos?: Set<string>,
  ): Promise<IResultadoConsultaRegistros<I>> {
    pPayload.limite = 100;

    const lResposta = await this.consultar<T, I>(pPathUrl, pPayload, pCamposValidos);
    const lRegistros = lResposta.registros;

    if (!lResposta.possuiMais) {
      return { registros: lRegistros };
    }

    const lProximaPagina = await this.consultarTodosRegistros<T, I>(pPathUrl, {
      ...pPayload,
      proximaEntrada: lResposta.proximaEntrada,
    });

    return {
      registros: [...lRegistros, ...lProximaPagina.registros],
      possuiMais: lProximaPagina.possuiMais,
      proximaEntrada: lProximaPagina.proximaEntrada,
    };
  }

  static async consultarTodosRegistrosListagem<T extends object>(
    pPathUrl: string,
    pPayload: IConsultaRegistros,
  ): Promise<IResultadoConsultaRegistros<T>> {
    pPayload.limite = 100;

    const lResposta = await this.consultarListagem<T>(pPathUrl, pPayload);
    const lRegistros = lResposta.registros;

    if (!lResposta.possuiMais) {
      return { registros: lRegistros };
    }

    const lProximaPagina = await this.consultarTodosRegistrosListagem<T>(pPathUrl, {
      ...pPayload,
      proximaEntrada: lResposta.proximaEntrada,
    });

    return {
      registros: [...lRegistros, ...lProximaPagina.registros],
      possuiMais: lProximaPagina.possuiMais,
      proximaEntrada: lProximaPagina.proximaEntrada,
    };
  }
}
