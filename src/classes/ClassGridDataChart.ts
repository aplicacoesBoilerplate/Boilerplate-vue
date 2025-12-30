import type { IModelValueGridDataChart } from "./models/modelComponents/ModelGridDataChart";

export class ClassGridDataChart {
  private modelGridDataChart: IModelValueGridDataChart<any>;

  constructor(data?: IModelValueGridDataChart<any>) {
    this.modelGridDataChart = {
      modelTable: {
        model: {
          hiddenChart: data?.modelTable.model.hiddenChart || true,
          headersTable: data?.modelTable.model.headersTable || [],
          itemsTable: data?.modelTable.model.itemsTable || []
        }
      },
      modelChart: {
        optionsFilterSelectData: data?.modelChart.optionsFilterSelectData || [],
        model: data?.modelChart.model || [
          {
            id: 1,
            color: 'rgba(var(--v-theme-on-surface), .2)',
            title: 'Start Data Table',
            value: 0
          }
        ]
      }
    }
  }

  getModelGridDataChart() {
    return this.modelGridDataChart;
  }

}
