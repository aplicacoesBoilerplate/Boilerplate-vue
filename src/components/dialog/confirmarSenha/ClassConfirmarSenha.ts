import type { ConfirmarSenha } from "@/models/authModels/LoginModel";
import { authServices } from "@/services/authService";
import { useSnackbarStore } from "@/stores/SnackbarStore";

export class ConfirmarSenhaClass {
    show: boolean;
    confirmarSenha: ConfirmarSenha;
    callback?: () => Promise<void> | null;

    constructor() {
        this.show = false;
        this.confirmarSenha = {
            email_usuario: "",
            senha_usuario: "",
            confirmar_senha: ""
        }
        this.callback = undefined;
    }

    openDialog() {
        this.show = true;
    }

    clearFields() {
        this.confirmarSenha = {
            email_usuario: "",
            senha_usuario: "",
            confirmar_senha: ""
        }
    }

    closeDialog() {
        this.clearFields();
        this.show = false;
        this.callback = undefined;
    }

    setCallback(callback: () => Promise<void>) {
        this.callback = callback;
    }

    async executeCallback() {
        const senhaConfirmada = await authServices.confirmarSenha(this.confirmarSenha)
        if (senhaConfirmada) {
            if (this.callback) {
                await this.callback();
            }
            useSnackbarStore().showSnackbar('Senha confirmada!');
        } else {
            useSnackbarStore().showSnackbar('Senha inválida!', 'red');
        }
    }
}
