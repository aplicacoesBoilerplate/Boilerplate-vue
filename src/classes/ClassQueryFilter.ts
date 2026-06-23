import type { FilterColumn } from "./ClassDefinitions";
import type { IQueryFilter } from "./models/modelComponents/ModelQueryFilter";

import { StorageUtils } from "@/utils/StorageUtils";
import { FALLBACK_LOCALE } from "@/plugins/i18n";
import { useRoute } from "vue-router";
import { reactive, ref, watch } from "vue";
import { ClassFormatters } from "./Utils/ClassFormatters";

export class ClassQueryFilter {
  private query: IQueryFilter[]
  private staging: IQueryFilter;
  private availableColumns = ref<FilterColumn[]>([]);
  private storageKey: string;

  constructor(data?: Partial<IQueryFilter>[]) {
    const route = useRoute();
    const routeName = (route.name as string) || 'default';
    this.storageKey = `filter_context_${routeName}`;

    watch(
      () => route.name,
      (newName) => {
        if (!newName) return;

        this.storageKey = `filter_context_${String(newName)}`;
        const savedData = StorageUtils.get<IQueryFilter[]>(this.storageKey, [], 'session');

        this.query.splice(0, this.query.length);
        if (savedData && savedData.length > 0) {
          savedData.forEach(item => this.query.push(this.createItem(item)));
        }

        this.resetStaging();
      },{ immediate: true }
    );

    watch(
      () => route.meta?.filterConfig,
      (newConfig) => {
        this.availableColumns.value = (newConfig as FilterColumn[]) || [];
      }, { immediate: true }
    );

    this.query = this.getDefault(data);
    this.staging = reactive(this.createItem());

    watch(() => this.query, (newVal) => {
      StorageUtils.set(this.storageKey, newVal, 'session');
    }, { deep: true });
  }

  get model(): IQueryFilter[] {
    return this.query;
  }

  get stagingModel(): IQueryFilter {
    return this.staging;
  }

  get filters(): FilterColumn[] {
    return this.availableColumns.value;
  }

  private createItem(data: Partial<IQueryFilter> = {}): IQueryFilter {
    const today = new Date();
    const locale = typeof navigator !== 'undefined' ? navigator.language : FALLBACK_LOCALE;

    const defaults: IQueryFilter = {
      field: '',
      condition: '',
      value: '',
      startDate: ClassFormatters.formatarDataHora(today, locale),
      endDate: ClassFormatters.formatarDataHora(today, locale),
      selectValues: []
    };

    return { ...defaults, ...data };
  }

  private getDefault(data?: Partial<IQueryFilter>[]): IQueryFilter[] {
    if (data && data.length > 0) {
      return reactive(data.map(item => this.createItem(item)));
    }


    const emptyItem = this.createItem();
    const dataStorage = StorageUtils.get<IQueryFilter[]>(this.storageKey, [emptyItem], 'session');

    if (dataStorage && Array.isArray(dataStorage) && dataStorage.length > 0) {
      return reactive(dataStorage.map(item => this.createItem(item)));
    }

    return reactive([]);
  }

  addFilter(): boolean {
    if (this.isDuplicate(this.staging)) {
      return false;
    }

    this.query.push({ ...this.staging });
    this.resetStaging();
    return true;
  }

  private isDuplicate(newItem: IQueryFilter): boolean {
    return this.query.some(existing =>
      existing.field === newItem.field &&
      existing.condition === newItem.condition &&
      existing.value === newItem.value &&
      existing.startDate === newItem.startDate &&
      existing.endDate === newItem.endDate
    );
  }

  removeFilter(index: number) {
    if (this.query.length === 1) {
      this.reset();
      return;
    }
    this.query.splice(index, 1);
  }

  reset() {
    this.query.splice(0, this.query.length);
    StorageUtils.set(this.storageKey, this.query, 'session');
  }

  resetStaging() {
    const freshItem = this.createItem();
    Object.assign(this.staging, freshItem);
  }

  getColumnType(key: string): FilterColumn | undefined {
    return this.availableColumns.value.find(col => col.key === key);
  }

  fieldChanged(newField: string) {
    this.staging.field = newField;
    this.staging.condition = '';
    this.staging.value = '';
    this.staging.startDate = '';
    this.staging.endDate = '';
  }

  updateStaging(data: Partial<IQueryFilter>) {
    Object.assign(this.staging, data);
  }
}
