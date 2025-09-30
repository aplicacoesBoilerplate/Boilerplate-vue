import type { AutorizacoesConsulta } from "@/models/saidasModels/saidasModels";
import { autorizacoesServices } from "@/services/autorizacoesServices";

export class DialogAutorizacoesClass {
    show: boolean;
    isEditing: boolean;
    autorizacao: AutorizacoesConsulta;

    constructor() {
        this.show = false;
        this.isEditing = false;
        this.autorizacao = {
            idFuncionarioAutorizacao: 0,
            nomeResponsavel: "",
            idSaida: 0,
            aprovacaoSaida: false,
            observacaoAutorizacao: "",
            dataAutorizacao: "",
        };
    }

    openDialog() {
        this.show = true;
    }

    async getAutorizacao(idAutorizacao?: number, aprovacao?: boolean) {
        if (idAutorizacao) this.autorizacao = await autorizacoesServices.getAutorizacaoById(idAutorizacao);
        if (aprovacao != null) this.autorizacao.aprovacaoSaida = aprovacao;
    }

    clearFields() {
        if (this.isEditing) {
            this.getAutorizacao(this.autorizacao.idAutorizacao);
        } else {
            this.autorizacao = {
                idFuncionarioAutorizacao: 0,
                nomeResponsavel: "",
                idSaida: 0,
                aprovacaoSaida: false,
                observacaoAutorizacao: "",
                dataAutorizacao: "",
            };
        }
    }

    closeDialog() {
        this.clearFields();
        this.show = false;
        this.isEditing = false;
    }

    // Método para abrir o diálogo de autorização com os dados preenchidos
    async completeForm(idAutorizacao?: number, aprovacao?: boolean) {
        this.show = true;
        this.isEditing = true;
        if (idAutorizacao != null) {
            await this.getAutorizacao(idAutorizacao, aprovacao);
        }
    }
}
