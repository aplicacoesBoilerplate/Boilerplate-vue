// Interface do Objeto de filtros para uma consulta
export interface IFiltrosConsulta {
  campo: string;
  condicao: string;
  valor: string;
  dataInicio: Date | string;
  dataFinal: Date | string;
  valoresSelecionados: any[];
}
