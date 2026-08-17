import type { IHeadersDataTable } from '@/models/components/lHeaderTable';
import type { IConsultaRegistros } from '@/models/consulta/IConsultaRegistros';

export type TFormatoExportacaoDados = 'txt' | 'pdf' | 'excel';

export interface IMetodoExportacaoDadosOptions {
  signal?: AbortSignal;
}

export type TMetodoExportacaoDados<TParametros extends object = Record<string, unknown>, TItem = unknown> = (
  pParametros?: TParametros,
  pOptions?: IMetodoExportacaoDadosOptions,
) => Promise<TItem[]>;

export interface IExecutarExportacaoDadosOptions<
  TParametros extends object = Record<string, unknown>,
  TItem = unknown,
> {
  formato: TFormatoExportacaoDados;
  contexto: string;
  metodo: TMetodoExportacaoDados<TParametros & Partial<IConsultaRegistros<Record<string, unknown>>>, TItem>;
  parametros?: TParametros & Partial<IConsultaRegistros<Record<string, unknown>>>;
  colunas?: IHeadersDataTable[];
  nomeArquivo?: string;
  signal?: AbortSignal;
  maxRecords?: number;
  maxEstimatedBytes?: number;
}

export interface IColunaNormalizadaExportacao<TItem = unknown> {
  titulo: string;
  chave: string;
  valor?: (pItem: TItem) => unknown;
}
