export type FilterType = 'text' | 'number' | 'date' | 'boolean' | 'select'

export interface FilterColumn {
  key: string
  label: string
  type: FilterType
  options?: any[]
}

export const OPERATORS = {
  text: [
    { title: 'filterColumn.operators.startsIn', value: 'startsIn' },
    { title: 'filterColumn.operators.endsIn', value: 'endsIn' },
    { title: 'filterColumn.operators.contains', value: 'contains' },
    { title: 'filterColumn.operators.equals', value: 'equals' },
    { title: 'filterColumn.operators.notEquals', value: 'notEquals' },
    { title: 'filterColumn.operators.select', value: 'select' },
    { title: 'filterColumn.operators.except', value: 'except' }
  ],
  number: [
    { title: 'filterColumn.operators.equals', value: 'equals' },
    { title: 'filterColumn.operators.notEquals', value: 'notEquals' },
    { title: 'filterColumn.operators.greaterEqual', value: 'greaterEqual' },
    { title: 'filterColumn.operators.greaterThan', value: 'greaterThan' },
    { title: 'filterColumn.operators.lessEqual', value: 'lessEqual' },
    { title: 'filterColumn.operators.lessThan', value: 'lessThan' },
    { title: 'filterColumn.operators.between', value: 'between' },
    { title: 'filterColumn.operators.select', value: 'select' },
    { title: 'filterColumn.operators.except', value: 'except' }
  ],
  date: [
    { title: 'filterColumn.operators.equals', value: 'equals' },
    { title: 'filterColumn.operators.notEquals', value: 'notEquals' },
    { title: 'filterColumn.operators.greaterEqual', value: 'greaterEqual' },
    { title: 'filterColumn.operators.greaterThan', value: 'greaterThan' },
    { title: 'filterColumn.operators.lessEqual', value: 'lessEqual' },
    { title: 'filterColumn.operators.lessThan', value: 'lessThan' },
    { title: 'filterColumn.operators.between', value: 'between' },
    { title: 'filterColumn.operators.select', value: 'select' },
    { title: 'filterColumn.operators.except', value: 'except' }
  ],
  boolean: [
    { title: 'filterColumn.operators.equals', value: 'equals' }
  ],
  select: [
    { title: 'filterColumn.operators.startsIn', value: 'startsIn' },
    { title: 'filterColumn.operators.endsIn', value: 'endsIn' },
    { title: 'filterColumn.operators.contains', value: 'contains' },
    { title: 'filterColumn.operators.equals', value: 'equals' },
    { title: 'filterColumn.operators.notEquals', value: 'notEquals' },
    { title: 'filterColumn.operators.select', value: 'select' },
    { title: 'filterColumn.operators.except', value: 'except' }
  ]
};

export class ClassDefinitions {
  static get filterColumnsUsers(): FilterColumn[] {
    return [
      {
        key: 'id',
        label: 'forms.formUser.id',
        type: 'number'
      },
      {
        key: 'username',
        label: 'forms.formUser.inputUsername.label',
        type: 'text'
      },
      {
        key: 'email',
        label: 'forms.formUser.inputEmail.label',
        type: 'text'
      },
      {
        key: 'role',
        label: 'forms.formUser.inputRole.label',
        type: 'select',
        options: [
            { title: 'Admin', value: 'ADMIN' },
            { title: 'User', value: 'USER' }
        ]
      },
      {
        key: 'active',
        label: 'forms.formUser.inputUserActive.label',
        type: 'boolean'
      },
    ];
  }
}
