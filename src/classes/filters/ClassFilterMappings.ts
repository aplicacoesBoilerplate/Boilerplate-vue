// Types e Interfaces
import type { ICampoFiltroOption } from '@/models/filters/ICampoFiltroOption';
import { EFilterResources } from '@/models/filters/enums/EFilterResource';

// Constantes
import { cFILTERS_MAPPINGS } from '@/models/filters/enums/mapping/EFiltersMapping';

// Classe responsável por disponibilizar os mapeamentos de filtros.
export class ClassFilterMappings {
  /**
   * Retorna as configurações de mapeamento de filtros para um determinado recurso.
   * @template T Tipo do mapeamento.
   * @param resource Enum do recurso.
   * @returns Array de mapeamentos ou array vazio caso não exista.
   */
  static getMapping<T>(resource: EFilterResources): ICampoFiltroOption<T>[] {
    return cFILTERS_MAPPINGS[resource] as ICampoFiltroOption<T>[] || [];
  }
}
