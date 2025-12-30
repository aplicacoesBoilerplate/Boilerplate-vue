export interface IHeadersDataTable {
  title: string
  key: string
  align?: 'start' | 'end' | 'center'
  height?: string | number
  maxHeigth?: string | number
  width?: string | number
  maxWidth?: string | number
  sortable?: boolean
  chartAggregator?: 'sum' | 'count'
  chartFormatter?: (value: string | number) => string
  value?: (item: any) => any
}
