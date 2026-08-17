// Models
import type {
  IConsultaRegistros,
  IConsultaTodosRegistrosOptions,
  IRespostaConsultaRegistros,
} from "../consulta/IConsultaRegistros";

export interface IServiceConsulta<T extends object> {
  consultar(pParametros?: Partial<IConsultaRegistros<T>>, pSignal?: AbortSignal): Promise<IRespostaConsultaRegistros<T>>;
  consultarTodosRegistros(
    pParametros?: Partial<IConsultaRegistros<T>>,
    pOptions?: IConsultaTodosRegistrosOptions,
  ): Promise<IRespostaConsultaRegistros<T>>;
  buscarPorId(pIdRegistro: number): Promise<T>
}

export interface IServiceEscrita<T extends object> {
  cadastrar(registro: T): Promise<T>;
  editar(registro: T): Promise<T>;
  modificar(registro: T): Promise<T>;
  excluir(id: number): Promise<void>;
}
