// Types e Interfaces
import type { IGenericListFetchPayload } from '@/models/components/IGenericListContext';
import type { IFiltrosConsulta } from '@/models/filters/IFiltrosConsulta';
import type { IErros } from '@/models/model/errors/IErros';
import type { IResponsePaginacao } from '@/models/services/IResponsePaginacao';
import type { IParametrosPaginacaoRequisicao } from '@/models/services/IParametrosPaginacaoRequisicao';

// Services
import { CBaseHttpService } from '@/services/base/CBaseHttpService';

/**
 * @description Centraliza os contratos HTTP para logs de erro do sistema.
 */
export class CErroService extends CBaseHttpService {
  public static async consultar(
    pParametros: IParametrosPaginacaoRequisicao<IFiltrosConsulta[]> | IGenericListFetchPayload = {},
  ): Promise<IResponsePaginacao<IErros>> {
    return CErroService.post<IResponsePaginacao<IErros>, IParametrosPaginacaoRequisicao<IFiltrosConsulta[]>>(
      '/erros/consulta',
      pParametros,
    );
  }
}
