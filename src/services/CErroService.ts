import type { IConsultaRegistros, IResultadoConsultaRegistros } from '@/models/consulta/IConsultaRegistros';
import type { IFiltrosConsulta } from '@/models/filters/IFiltrosConsulta';
import type { IErros } from '@/models/model/errors/IErros';

import { CBaseHttpService } from '@/services/base/CBaseHttpService';
import { CConsultaGenericaService } from '@/services/base/CConsultaGenericaService';

export class CErroService extends CBaseHttpService {
  public static async consultar(
    pParametros: IConsultaRegistros,
  ): Promise<IResultadoConsultaRegistros<IErros>> {
    return CConsultaGenericaService.consultarListagem<IErros>(
      '/erros/consulta',
      pParametros,
    );
  }

  public static async consultarTodosRegistros(
    pParametros?: Partial<IConsultaRegistros>,
  ): Promise<IErros[]> {
    const resultado = await CConsultaGenericaService.consultarTodosRegistrosListagem<IErros>(
      '/erros/consulta',
      {
        filtros: pParametros?.filtros ?? [],
        limite: pParametros?.limite ?? 100,
        ordenacao: pParametros?.ordenacao ?? 'asc',
        proximaEntrada: pParametros?.proximaEntrada,
      },
    );

    return resultado.registros;
  }
}
