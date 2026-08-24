import type { TFiltroConsultaSerializado } from './IFiltrosConsulta';

/**
 * @description Conjunto nomeado de filtros persistido para um recurso específico.
 * @property {string} id - Identificador estável do template no escopo do usuário.
 * @property {string} nome - Nome exibido para o template.
 * @property {TFiltroConsultaSerializado[]} filtros - Filtros serializados que serão aplicados.
 */
export interface ITemplateFiltro {
  id: string;
  nome: string;
  filtros: TFiltroConsultaSerializado[];
}
