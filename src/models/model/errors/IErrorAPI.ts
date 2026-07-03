// Types e Interfaces
import type { IUsuario } from "../usuario/lUsuario";

/**
 * Interface que representa o rastro de um erro retornado pela API
 */
export interface ITraceError {
  linha: number
  arquivo: string
  classe: string
  metodo: string
}

/**
 * Interface que representa o contrato de erro retornado pela API
 */
export interface IErrorAPI {
  mensagem: string;
  dataHora: Date;
  httpStatusCode: number;
  usuario: IUsuario;
  trace: ITraceError;
}
