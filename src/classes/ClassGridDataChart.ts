import type { IModelValueGridDataChart } from "./models/modelComponents/ModelGridDataChart";

export class ClassGridDataChart {
  private modelGridDataChart: IModelValueGridDataChart<any>;

  constructor(data?: IModelValueGridDataChart<any>) {
    this.modelGridDataChart = {
      modelTable: {
        model: {
          hiddenChart: data?.modelTable.model.hiddenChart ?? true,
          titleTable: data?.modelTable.model.titleTable || undefined,
          heightTable: data?.modelTable.model.heightTable || 400,
          maxHeightTable: data?.modelTable.model.maxHeightTable || 400,
          bgColorTable: data?.modelTable.model.bgColorTable || undefined,
          densityTable: data?.modelTable.model.densityTable || 'compact',
          headersTable: data?.modelTable.model.headersTable || [],
          itemsTable: data?.modelTable.model.itemsTable || [],
          loadingDataTable: data?.modelTable.model.loadingDataTable || true,
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
