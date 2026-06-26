import type { IHeadersDataTable } from '../../../models/components/lHeaderTable';

export type ValueDataChart = {
  id: number;
  title: string;
  value: number;
  color: string;
  pattern?: string;
};

export interface IModelValueDataChart {
  optionsFilterSelectData: string[];
  model: ValueDataChart[];
}

export interface IPropsDataTable<T> {
  hiddenChart: boolean;
  titleTable?: string;
  heightTable?: string | number;
  maxHeightTable?: string | number;
  bgColorTable?: string;
  densityTable?: 'comfortable' | 'compact' | 'default';
  headersTable: IHeadersDataTable[];
  itemsTable: Array<T>;
  loadingDataTable?: boolean;
}

export interface IModelValueDataTable<T> {
  model: IPropsDataTable<T>;
}

export interface IModelValueGridDataChart<T> {
  modelTable: IModelValueDataTable<T>;
  modelChart: IModelValueDataChart;
}
