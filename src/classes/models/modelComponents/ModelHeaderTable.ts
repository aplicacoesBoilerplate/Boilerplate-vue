export interface IHeadersDataTable {
  title: string;
  key: string;
  align?: 'start' | 'end' | 'center';
  sortable?: boolean;
  width?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  fixed?: boolean;
  value?: (item: any) => any;
}
