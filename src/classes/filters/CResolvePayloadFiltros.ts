// Enums
import { EOperadoresFiltro } from '@/models/filters/enums/EOperadoresFiltro';
import type { IConsultaRegistrosFiltroPayload } from '@/models/filters/IConsultaRegistrosFiltro';
import type { IFiltrosConsulta } from '@/models/filters/IFiltrosConsulta';

/**
 * @description Classe com métodos genéricos que realizam tratamentos no payload para consultas com filtros.
 */
export class CResolvePayloadFiltros {
  private camposValidos?: Set<string>;

  /**
   * @description Cria uma instância do resolvedor de payload.
   * @param pCamposValidos Conjunto de campos válidos para o Set de validação do campo de pesquisa.
   */
  constructor(pCamposValidos?: Set<string>) {
    this.camposValidos = pCamposValidos;
  }

  /**
   * @description Recebe o payload para uma consulta aplicando filtros e realiza a normalização.
   * @param pPayload - Retorno do DialogFiltros para o recurso especificado.
   * @param pCampoDefault - Campo fallback para aplicar filtro caso a validação com Set falhe.
   * @returns Array de filtros no formato esperado pelo backend.
   */
  montarFiltrosPesquisa<T>(pPayload: IConsultaRegistrosFiltroPayload<T>, pCampoDefault?: string): IFiltrosConsulta[] {
    if (!pPayload.termoPesquisa) {
      return [];
    }

    const campoPesquisa = this.resolverCampo(pPayload.campo, pCampoDefault);

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

  /**
   * @description Função para validar se o campo selecionado está presente no conjunto de campos válidos.
   * @param pCampo - Campo que será aplicado filtro.
   * @param pCampoDefault - Campo de fallback caso o valor enviado não seja válido.
   * @returns Casting de pCampo para string ou o pCampoDefault.
   */
  resolverCampo(pCampo: unknown, pCampoDefault: string = 'id'): string {
    if (pCampo && this.camposValidos?.has(String(pCampo))) {
      return String(pCampo);
    }

    return pCampoDefault;
  }
}
