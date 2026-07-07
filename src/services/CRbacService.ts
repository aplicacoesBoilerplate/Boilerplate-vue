// Types e Interfaces
import type { IGenericListFetchPayload } from '@/models/components/IGenericListContext';
import type { ICargoRbac } from '@/models/model/rbac/ICargoRbac';
import type { TPapel } from '@/models/model/usuario/lUsuario';
import type { IResponsePaginacao } from '@/models/services/IResponsePaginacao';
import type { IParametrosPaginacaoRequisicao } from '@/models/services/IParametrosPaginacaoRequisicao';
import type { IFiltrosConsulta } from '@/models/filters/IFiltrosConsulta';

// Services
import { CBaseHttpService } from '@/services/base/CBaseHttpService';

/**
 * @description Centraliza os contratos HTTP para cargos e permissões RBAC.
 */
export class CRbacService extends CBaseHttpService {
  /**
   * @description Lista todos os cargos disponíveis.
   * @returns Cargos retornados pelo backend.
   */
  public static async listarTodos(): Promise<ICargoRbac[]> {
    return CRbacService.get<ICargoRbac[]>('/rbac/cargos');
  }

  /**
   * @description Consulta cargos com paginação e filtros.
   * @param pParametros Parâmetros de paginação, ordenação e filtros.
   * @returns Página de cargos retornada pelo backend.
   */
  public static async consultar(
    pParametros: IParametrosPaginacaoRequisicao<IFiltrosConsulta[]> | IGenericListFetchPayload = {},
  ): Promise<IResponsePaginacao<ICargoRbac>> {
    return CRbacService.post<IResponsePaginacao<ICargoRbac>, IParametrosPaginacaoRequisicao<IFiltrosConsulta[]>>(
      '/rbac/cargos/consulta',
      pParametros,
    );
  }

  /**
   * @description Busca um cargo por ID.
   * @param pIdCargo Identificador do cargo.
   * @returns Cargo encontrado.
   */
  public static async buscarPorId(pIdCargo: number): Promise<ICargoRbac> {
    return CRbacService.get<ICargoRbac>(`/rbac/cargos/${pIdCargo}`);
  }

  /**
   * @description Busca um cargo pelo papel estável.
   * @param pPapel Papel associado ao cargo.
   * @returns Cargo encontrado, quando existir.
   */
  public static async buscarPorPapel(pPapel: TPapel): Promise<ICargoRbac | undefined> {
    const cargos = await CRbacService.listarTodos();

    return cargos.find((pCargo) => pCargo.papel === pPapel);
  }

  /**
   * @description Cria um novo cargo.
   * @param pCargo Cargo a ser criado.
   * @returns Cargo persistido.
   */
  public static async salvar(pCargo: ICargoRbac): Promise<ICargoRbac> {
    return CRbacService.post<ICargoRbac, ICargoRbac>('/rbac/cargos', pCargo);
  }

  /**
   * @description Atualiza um cargo existente.
   * @param pCargo Cargo a ser atualizado.
   * @returns Cargo persistido.
   */
  public static async atualizar(pCargo: ICargoRbac): Promise<ICargoRbac> {
    return CRbacService.put<ICargoRbac, ICargoRbac>(`/rbac/cargos/${pCargo.id}`, pCargo);
  }

  /**
   * @description Remove um cargo.
   * @param pIdCargo Identificador do cargo.
   */
  public static async excluir(pIdCargo: number): Promise<void> {
    await CRbacService.delete<void>(`/rbac/cargos/${pIdCargo}`);
  }
}
