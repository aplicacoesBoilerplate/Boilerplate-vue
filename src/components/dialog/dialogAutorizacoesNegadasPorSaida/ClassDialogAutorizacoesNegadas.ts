import type { AutorizacoesConsulta } from "@/models/saidasModels/saidasModels.ts";
import { autorizacoesServices } from "@/services/autorizacoesServices.ts";
import type { HeaderPaginatorModel } from "@/models/HeaderPaginatorModel.ts";

export class DialogAutorizacoesNegadasClass {
    show: boolean;
    idAutorizacaoOrigem: number;
    autorizacoesNegadas: HeaderPaginatorModel<AutorizacoesConsulta>;

    constructor() {
        this.show = false;
        this.idAutorizacaoOrigem = 0;
        this.autorizacoesNegadas = {
            limite: 0,
            offset: 0,
            totalPaginas: 0,
            totalRegistros: 0,
            registros: [
                {
                    idAutorizacao: 0,
                    idFuncionarioAutorizacao: 0,
                    nomeResponsavel: "",
                    idSaida: 0,
                    aprovacaoSaida: false,
                    observacaoAutorizacao: "",
                    dataAutorizacao: "",
                },
            ],
        };
    }

    async openDialog(autorizacao: AutorizacoesConsulta) {
        await this.getAutorizacoesNegadas(autorizacao.idSaida);
        this.show = true;
        if (autorizacao.idAutorizacao) this.idAutorizacaoOrigem = autorizacao.idAutorizacao;
    }

    closeDialog() {
        this.show = false;
    }

    // Consulta as autorizações negadas para uma saída específica
    async getAutorizacoesNegadas(idSaida?: number) {
        if (idSaida) {
            const response = await autorizacoesServices.getAutorizacoesNegadasPorSaida(idSaida);
            this.autorizacoesNegadas = response;
        }
    }
}
