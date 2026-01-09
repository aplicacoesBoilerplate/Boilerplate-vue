export interface IQueryFilter {
  field: string
  condition: string
  value: string
  startDate: Date | string
  endDate: Date | string
  selectValues?: any[]
}
