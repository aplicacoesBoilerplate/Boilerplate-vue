// Enums
import { ERecursosFiltro } from '@/models/filters/enums/ERecursosFiltro';

// Types e Interfaces
import type { ICampoFiltro } from '@/models/filters/ICampoFiltro';

// Constantes
import { MAPEAMENTO_FILTROS } from '@/models/filters/MapeamentoFiltros';

/** @description Classe responsável por disponibilizar os mapeamentos de filtros. */
export class CMapeamentosFiltro {
  /**
   * @description Retorna as configurações de mapeamento de filtros para um determinado recurso.
   * @template T Tipo do mapeamento.
   * @param pRecurso Enum do recurso.
   * @returns Array de mapeamentos ou array vazio caso não exista.
   */
  static getMapeamento<T, TRegistroConsulta extends object = any>(
    pRecurso?: ERecursosFiltro,
  ): ICampoFiltro<T, TRegistroConsulta>[] {
    // Verifica se o recurso foi informado antes de retornar o mapeamento.
    if (!pRecurso) return [];
    return (MAPEAMENTO_FILTROS[pRecurso] as ICampoFiltro<T, TRegistroConsulta>[]) || [];
  }
}
