import type { IModelValueGridDataChart } from "./models/modelComponents/ModelGridDataChart";

export class ClassGridDataChart<T> {
  private modelGridDataChart: IModelValueGridDataChart<T>;

  constructor(data?: IModelValueGridDataChart<T>) {
    const defaults = {
      modelTable: {
        model: {
          hiddenChart: true,
          titleTable: '',
          heightTable: 'auto',
          maxHeightTable: 400,
          densityTable: 'compact',
          headersTable: [],
          itemsTable: Array <T>,
          loadingDataTable: true,
        }
      },
      modelChart: {
        optionsFilterSelectData: [],
        model: [
          {
            id: 1,
            color: 'rgba(var(--v-theme-on-surface), .2)',
            title: 'Start Data Table',
            value: 0
          }
        ]
      }
    };
    this.modelGridDataChart = {
      modelTable: {
        model: { ...defaults.modelTable.model, ...data?.modelTable?.model }
      },
      modelChart: {
        ...defaults.modelChart,
        ...data?.modelChart
      }
    } as IModelValueGridDataChart<T>;
  }

  getModelGridDataChart() {
    return this.modelGridDataChart;
  }

}
