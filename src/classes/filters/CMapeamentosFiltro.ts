// Models
import { ERecursosFiltro } from '@/models/filters/enums/ERecursosFiltro';
import { MAPEAMENTO_FILTROS } from '@/models/filters/MapeamentoFiltros';

/** @description Classe responsável por disponibilizar os mapeamentos de filtros. */
export class CMapeamentosFiltro {
  /**
   * @description Retorna as configurações de mapeamento de filtros para um determinado recurso.
   * @template TRecurso - Recurso que identifica o mapeamento solicitado.
   * @param pRecurso - Recurso com os campos de filtro configurados.
   * @returns Campos de filtro com o tipo concreto associado ao recurso.
   */
  static getMapeamento<TRecurso extends ERecursosFiltro>(
    pRecurso: TRecurso,
  ): (typeof MAPEAMENTO_FILTROS)[TRecurso] {
    return MAPEAMENTO_FILTROS[pRecurso];
  }
}
