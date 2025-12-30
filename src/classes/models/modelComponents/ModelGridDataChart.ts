import type { IHeadersDataTable } from "./ModelHeaderTable";

export type ValueDataChart = {
  id: number,
  title: string,
  value: number,
  color: string,
  pattern?: string
}

export interface IModelValueDataChart {
  optionsFilterSelectData: string[]
  model: ValueDataChart[]
}

export interface IPropsDataTable {
  hiddenChart: boolean,
  titleTable?: string;
  heightTable?: string | number;
  maxHeightTable?: string | number;
  bgColorTable?: string;
  densityTable?: 'comfortable' | 'compact' | 'default';
  headersTable: IHeadersDataTable[];
  itemsTable: any[];
  loadingDataTable?: boolean;
}

export interface IModelValueDataTable {
  model: IPropsDataTable
}

export interface IModelValueGridDataChart {
  modelTable: IModelValueDataTable;
  modelChart: IModelValueDataChart;
}
