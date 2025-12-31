import { reactive } from "vue";
import type { IModelValueGridDataChart } from "./models/modelComponents/ModelGridDataChart";

export class ClassGridDataChart<T> {
  private modelGridDataChart: IModelValueGridDataChart<T>;

  constructor(data?: IModelValueGridDataChart<T>) {
    this.modelGridDataChart = this.getDefault(data);
  }

  get model() {
    return this.modelGridDataChart;
  }

  private getDefault(data?: Partial<IModelValueGridDataChart<T>>) {
    const dataMTable = data?.modelTable?.model
    const dataMChart = data?.modelChart?.model
    return reactive({
      modelTable: data?.modelTable || {
        model: {
          hiddenChart: dataMTable?.hiddenChart || true,
          titleTable: dataMTable?.titleTable || '',
          heightTable: dataMTable?.heightTable || 'auto',
          maxHeightTable: dataMTable?.maxHeightTable || 400,
          densityTable: dataMTable?.densityTable || 'compact',
          headersTable: dataMTable?.headersTable || [],
          itemsTable: dataMTable?.itemsTable || Array <T>,
          loadingDataTable: dataMTable?.loadingDataTable || true,
        }
      },
      modelChart: {
        optionsFilterSelectData: data?.modelChart?.optionsFilterSelectData || [],
        model: dataMChart || [
          {
            id: 1,
            color: 'rgba(var(--v-theme-on-surface), .2)',
            title: 'Start Data Table',
            value: 0
          }
        ]
      }
    }) as IModelValueGridDataChart<T>;
  }

}
