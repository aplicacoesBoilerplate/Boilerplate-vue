// Models
import type { IConsultaRegistros, IRespostaConsultaRegistros } from "@/models/consulta/IConsultaRegistros";
import type { IServiceConsulta } from "@/models/services/IServiceImplements";

// Classes
import { CBaseHttpService } from "./CBaseHttpService";

export abstract class CBaseConsultaApiService<TInterfaceRegistro extends object>
  extends CBaseHttpService
  implements IServiceConsulta<TInterfaceRegistro> {
  constructor(protected pathRecurso: string) {
    super()
  }
  
  private normalizarBodyConsulta(
    pParametros: Partial<IConsultaRegistros<TInterfaceRegistro>> = {}
  ): IConsultaRegistros<TInterfaceRegistro> {
    return {
      ...pParametros,
      filtros: pParametros.filtros ?? [],
      limite: pParametros.limite ?? 10,
      ordenacao: pParametros.ordenacao ?? 'asc',
      proximaEntrada: pParametros.proximaEntrada,
      possuiMais: pParametros.possuiMais ?? true,
    };
  }

  public async consultar(
    pParametros: Partial<IConsultaRegistros<TInterfaceRegistro>> = {}
  ): Promise<IRespostaConsultaRegistros<TInterfaceRegistro>> {
    return await this.post<
      IConsultaRegistros<TInterfaceRegistro>,
      IRespostaConsultaRegistros<TInterfaceRegistro>
    >({
      pathUrl: `${this.pathRecurso}/consulta`,
      body: this.normalizarBodyConsulta(pParametros)
    });
  }

  public async consultarTodosRegistros(
    pParametros: Partial<IConsultaRegistros<TInterfaceRegistro>> = {}
  ): Promise<IRespostaConsultaRegistros<TInterfaceRegistro>> {
    let lConsulta: IConsultaRegistros<TInterfaceRegistro> = this.normalizarBodyConsulta({
      ...pParametros,
      limite: 100
    });


    if (!lConsulta.possuiMais) {
      return {
        ...lConsulta,
        registros: [],
      };
    }

    const lRegistros: TInterfaceRegistro[] = [];
    let lResposta: IRespostaConsultaRegistros<TInterfaceRegistro>;

    do {
      lResposta = await this.consultar(lConsulta);
      lRegistros.push(...lResposta.registros);

      lConsulta = {
        ...lConsulta,
        proximaEntrada: lResposta.proximaEntrada,
        possuiMais: lResposta.possuiMais ?? false,
      };
    } while (lConsulta.possuiMais);

    return {
      ...lResposta,
      registros: lRegistros,
    };
  }

  public async buscarPorId(pIdRegistro: number): Promise<TInterfaceRegistro> {
    return this.get<TInterfaceRegistro>({
      pathUrl: `${this.pathRecurso}/${pIdRegistro}`
    });
  }
}
