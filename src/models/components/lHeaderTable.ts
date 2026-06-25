// Interface que define a estrutura de uma coluna de tabela
export interface IHeadersDataTable {
  // O título de exibição visual que será renderizado no cabeçalho da coluna
  title: string

  // A chave associada ao objeto de dados iterado, atua como identificador único da coluna
  key: string

  // Controla o alinhamento horizontal do cabeçalho e do conteúdo das células desta coluna
  align?: 'start' | 'end' | 'center'

  // Determina a altura fixa aplicável ao cabeçalho desta coluna
  height?: string | number

  // Define a restrição de altura máxima para o cabeçalho desta coluna
  maxHeigth?: string | number

  // Define a largura base da coluna, afetando seu dimensionamento horizontal no componente
  width?: string | number

  // Impõe um limite máximo de largura, muito útil para evitar expansões indesejadas com textos extensos
  maxWidth?: string | number

  // Determina se a coluna suporta a ordenação dos dados através da interação com o cabeçalho
  sortable?: boolean

  // Define a operação de agregação (soma ou contagem) quando os dados da tabela servem de base para um gráfico
  chartAggregator?: 'sum' | 'count'

  // Função de formatação para tratar os valores antes de serem renderizados nas representações gráficas
  chartFormatter?: (value?: any) => string

  // Função opcional que processa o item inteiro para gerar um valor customizado a ser exibido e ordenado (frequentemente usado em vez do valor bruto lido via `key`)
  value?: (item: any) => any
}
