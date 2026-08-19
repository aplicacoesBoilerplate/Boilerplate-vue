// Models
import type {
  IConsultaRegistros,
  IConsultaTodosRegistrosOptions,
  IRespostaConsultaRegistros,
} from "@/models/consulta/IConsultaRegistros";
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

  public consultar = async (
    pParametros: Partial<IConsultaRegistros<TInterfaceRegistro>> = {},
    pSignal?: AbortSignal,
  ): Promise<IRespostaConsultaRegistros<TInterfaceRegistro>> => {
    return await this.post<
      IConsultaRegistros<TInterfaceRegistro>,
      IRespostaConsultaRegistros<TInterfaceRegistro>
    >({
      pathUrl: `${this.pathRecurso}/consulta`,
      body: this.normalizarBodyConsulta(pParametros),
      axiosConfig: { signal: pSignal },
    });
  };

  public async consultarTodosRegistros(
    pParametros: Partial<IConsultaRegistros<TInterfaceRegistro>> = {},
    pOptions: IConsultaTodosRegistrosOptions = {},
  ): Promise<IRespostaConsultaRegistros<TInterfaceRegistro>> {
    const budgets = {
      maxPages: pOptions.maxPages ?? 100,
      maxRecords: pOptions.maxRecords ?? 10_000,
      maxBytes: pOptions.maxBytes ?? 25 * 1024 * 1024,
      timeoutMs: pOptions.timeoutMs ?? 30_000,
    };
    Object.entries(budgets).forEach(([pName, pValue]) => {
      if (!Number.isFinite(pValue) || pValue <= 0) {
        throw new Error(`Orcamento de ${pName} precisa ser maior que zero.`);
      }
    });

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

    const timedRequest = this.createTimedSignal(pOptions.signal, budgets.timeoutMs);
    const lRegistros: TInterfaceRegistro[] = [];
    let lResposta: IRespostaConsultaRegistros<TInterfaceRegistro> = {
      ...lConsulta,
      registros: [],
    };
    let pageCount = 0;
    let estimatedBytes = 0;
    let previousCursor = this.cursorFingerprint(lConsulta.proximaEntrada);
    const startedAt = Date.now();

    try {
      do {
      this.assertBulkRequestActive(timedRequest.signal, startedAt, budgets.timeoutMs);
      lResposta = await this.consultar(lConsulta, timedRequest.signal);
      this.assertBulkRequestActive(timedRequest.signal, startedAt, budgets.timeoutMs);
      pageCount += 1;

      const hasMore = lResposta.possuiMais ?? false;
      if (hasMore && lResposta.registros.length === 0) {
        throw new Error('Pagina vazia nao pode indicar continuacao da consulta.');
      }

      const nextCursor = this.cursorFingerprint(lResposta.proximaEntrada);
      if (hasMore && nextCursor === null) {
        throw new Error('Resposta com continuacao precisa fornecer um cursor nao nulo.');
      }
      if (hasMore && nextCursor === previousCursor) {
        throw new Error('Cursor de paginacao repetido; a consulta nao apresentou progresso.');
      }

      lRegistros.push(...lResposta.registros);
      estimatedBytes += new TextEncoder().encode(JSON.stringify(lResposta.registros)).byteLength;

      if (lRegistros.length > budgets.maxRecords) {
        throw new Error(`Limite de registros excedido (${budgets.maxRecords}).`);
      }
      if (estimatedBytes > budgets.maxBytes) {
        throw new Error(`Limite estimado de bytes excedido (${budgets.maxBytes}).`);
      }
      if (hasMore && pageCount >= budgets.maxPages) {
        throw new Error(`Limite de paginas excedido (${budgets.maxPages}).`);
      }

      lConsulta = {
        ...lConsulta,
        proximaEntrada: lResposta.proximaEntrada,
        possuiMais: hasMore,
      };
      previousCursor = nextCursor;
      } while (lConsulta.possuiMais);

      return {
        ...lResposta,
        registros: lRegistros,
      };
    } finally {
      timedRequest.cleanup();
    }
  }

  private cursorFingerprint(pCursor: unknown): string | null {
    if (pCursor === null || pCursor === undefined) return null;

    try {
      return `${typeof pCursor}:${JSON.stringify(pCursor)}`;
    } catch {
      return `${typeof pCursor}:${String(pCursor)}`;
    }
  }

  private assertBulkRequestActive(pSignal: AbortSignal | undefined, pStartedAt: number, pTimeoutMs: number): void {
    if (pSignal?.aborted) {
      throw pSignal.reason ?? new DOMException('Consulta cancelada.', 'AbortError');
    }
    if (Date.now() - pStartedAt > pTimeoutMs) {
      throw new Error(`Tempo limite da consulta excedido (${pTimeoutMs} ms).`);
    }
  }

  private createTimedSignal(pExternalSignal: AbortSignal | undefined, pTimeoutMs: number): {
    signal: AbortSignal;
    cleanup: () => void;
  } {
    const controller = new AbortController();
    const abortFromExternal = () => controller.abort(
      pExternalSignal?.reason ?? new DOMException('Consulta cancelada.', 'AbortError'),
    );
    if (pExternalSignal?.aborted) abortFromExternal();
    else pExternalSignal?.addEventListener('abort', abortFromExternal, { once: true });

    const timeoutId = globalThis.setTimeout(() => {
      controller.abort(new DOMException(`Tempo limite da consulta excedido (${pTimeoutMs} ms).`, 'TimeoutError'));
    }, pTimeoutMs);

    return {
      signal: controller.signal,
      cleanup: () => {
        globalThis.clearTimeout(timeoutId);
        pExternalSignal?.removeEventListener('abort', abortFromExternal);
      },
    };
  }

  public async buscarPorId(pIdRegistro: number): Promise<TInterfaceRegistro> {
    return this.get<TInterfaceRegistro>({
      pathUrl: `${this.pathRecurso}/${pIdRegistro}`
    });
  }
}
