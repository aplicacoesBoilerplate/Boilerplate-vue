export interface IHeadersDataTable {
  title: string;
  key: string;
  align?: 'start' | 'end' | 'center';
  sortable?: boolean;
  height?: string | number;
  maxHeigth?: string | number;
  width?: string | number;
  maxWidth?: string | number;
  value?: (item: any) => any;
}
