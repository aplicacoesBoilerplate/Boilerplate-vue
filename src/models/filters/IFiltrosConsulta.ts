// Interface do Objeto de filtros para uma consulta
export interface IFiltrosConsulta {
  campo: string;
  condicao: string;
  valor?: unknown;
  dataInicio?: Date | string | null;
  dataFinal?: Date | string | null;
  valoresSelecionados?: unknown[];
}
