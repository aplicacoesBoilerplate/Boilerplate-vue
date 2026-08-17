// Models
import type { IServiceEscrita } from "@/models/services/IServiceImplements";

// Classes
import { CBaseConsultaApiService } from "./CBaseConsultaApiService";

/** @description Classe Genérica para implementação dos métodos de service base */
export abstract class CBaseCrudApiService<TInterfaceRegistro extends object>
  extends CBaseConsultaApiService<TInterfaceRegistro>
  implements IServiceEscrita<TInterfaceRegistro> {
  constructor(pPathRecurso: string) {
    super(pPathRecurso);
  }
  
  public async cadastrar(pRegistro: TInterfaceRegistro): Promise<TInterfaceRegistro> {
    return this.post<TInterfaceRegistro, TInterfaceRegistro>({
      pathUrl: this.pathRecurso,
      body: pRegistro
    });
  }

  public async editar(pRegistro: TInterfaceRegistro): Promise<TInterfaceRegistro> {
    return this.put<TInterfaceRegistro, TInterfaceRegistro>({
      pathUrl: this.pathRecurso,
      body: pRegistro
    });
  }

  public async modificar(pRegistro: TInterfaceRegistro): Promise<TInterfaceRegistro> {
    return this.patch<TInterfaceRegistro, TInterfaceRegistro>({
      pathUrl: this.pathRecurso,
      body: pRegistro
    });
  }

  public async excluir(pIdRegistro: number): Promise<void> {
    await this.delete<void>({
      pathUrl: `${this.pathRecurso}/${pIdRegistro}`
    });
  }
}
