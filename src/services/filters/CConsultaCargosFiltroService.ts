// Types e Interfaces
import type {
  IConsultaRegistrosFiltroPayload,
  IResultadoConsultaRegistrosFiltro,
} from '@/models/filters/IConsultaRegistrosFiltro';
import { CARGOS_RBAC_INICIAIS, type ICargoRbac } from '@/models/model/rbac/rbac.models';

const CARGOS_CONSULTA_FILTRO: ICargoRbac[] = CARGOS_RBAC_INICIAIS;

// Service temporário para simular a consulta auxiliar de cargos até o backend expor o endpoint definitivo.
export class CConsultaCargosFiltroService {
  public static async buscarRegistros(
    pPayload: IConsultaRegistrosFiltroPayload,
  ): Promise<IResultadoConsultaRegistrosFiltro<ICargoRbac>> {
    await new Promise((pResolver) => setTimeout(pResolver, 300));

    const termoPesquisa = CConsultaCargosFiltroService.normalizarTexto(pPayload.termoPesquisa);
    const proximaEntrada = Number(pPayload.proximaEntrada ?? 0);
    const limite = pPayload.limite || 10;

    const registrosFiltrados = CARGOS_CONSULTA_FILTRO.filter((pCargo) =>
      CConsultaCargosFiltroService.cargoCorrespondePesquisa(pCargo, termoPesquisa),
    );

    const registros = registrosFiltrados.slice(proximaEntrada, proximaEntrada + limite);
    const proximoIndice = proximaEntrada + registros.length;

    return {
      registros,
      proximaEntrada: proximoIndice < registrosFiltrados.length ? proximoIndice : undefined,
      possuiMais: proximoIndice < registrosFiltrados.length,
    };
  }

  private static normalizarTexto(pValor: unknown): string {
    return String(pValor ?? '')
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  private static cargoCorrespondePesquisa(pCargo: ICargoRbac, pTermoPesquisa: string): boolean {
    if (!pTermoPesquisa) {
      return true;
    }

    const nome = CConsultaCargosFiltroService.normalizarTexto(pCargo.nome);
    const codigo = CConsultaCargosFiltroService.normalizarTexto(pCargo.codigo);
    const descricao = CConsultaCargosFiltroService.normalizarTexto(pCargo.descricao);

    return nome.includes(pTermoPesquisa) || codigo.includes(pTermoPesquisa) || descricao.includes(pTermoPesquisa);
  }
}
