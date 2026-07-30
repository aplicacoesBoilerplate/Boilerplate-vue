import type { IConsultaRegistros, IResultadoConsultaRegistros } from '@/models/consulta/IConsultaRegistros';
import type { IFiltrosConsulta } from '@/models/filters/IFiltrosConsulta';
import type { ICargoRbac } from '@/models/model/core/rbac/rbac.model';
import type { TPapel } from '@/models/model/core/usuario.model';

import { CBaseHttpService } from '@/services/base/CBaseHttpService';
import { CConsultaGenericaService } from '@/services/base/CConsultaGenericaService';

export class CRbacService extends CBaseHttpService {
  public static async listarTodos(): Promise<ICargoRbac[]> {
    return CRbacService.get<ICargoRbac[]>('/rbac/cargos');
  }

  public static async consultar(
    pParametros: IConsultaRegistros,
  ): Promise<IResultadoConsultaRegistros<ICargoRbac>> {
    return CConsultaGenericaService.consultarListagem<ICargoRbac>(
      '/rbac/cargos/consulta',
      pParametros,
    );
  }

  public static async consultarTodosRegistros(
    pParametros?: Partial<IConsultaRegistros>,
  ): Promise<ICargoRbac[]> {
    const resultado = await CConsultaGenericaService.consultarTodosRegistrosListagem<ICargoRbac>(
      '/rbac/cargos/consulta',
      {
        filtros: pParametros?.filtros ?? [],
        limite: pParametros?.limite ?? 100,
        ordenacao: pParametros?.ordenacao ?? 'asc',
        proximaEntrada: pParametros?.proximaEntrada,
      },
    );

    return resultado.registros;
  }

  public static async buscarPorId(pIdCargo: number): Promise<ICargoRbac> {
    return CRbacService.get<ICargoRbac>(`/rbac/cargos/${pIdCargo}`);
  }

  public static async buscarPorPapel(pPapel: TPapel): Promise<ICargoRbac | undefined> {
    const cargos = await CRbacService.listarTodos();

    return cargos.find((pCargo) => pCargo.papel === pPapel);
  }

  public static async salvar(pCargo: ICargoRbac): Promise<ICargoRbac> {
    return CRbacService.post<ICargoRbac, ICargoRbac>('/rbac/cargos', pCargo);
  }

  public static async atualizar(pCargo: ICargoRbac): Promise<ICargoRbac> {
    return CRbacService.put<ICargoRbac, ICargoRbac>(`/rbac/cargos/${pCargo.id}`, pCargo);
  }

  public static async excluir(pIdCargo: number): Promise<void> {
    await CRbacService.delete<void>(`/rbac/cargos/${pIdCargo}`);
  }
}
