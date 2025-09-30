import type { AlterarSenha, ConfirmarSenha, LoginModel } from "@/models/authModels/LoginModel";
import http from "./axios";
import type { UsuarioConsulta } from "@/models/usersModels/UsuariosModels";
import { usuariosServices } from "./usuariosService";

export const authServices = {
    async login(loginData: LoginModel): Promise<string> {
        try {
            const response = await http.post("/auth/login", loginData);
            const token = response.data.tokenJWT;
            sessionStorage.setItem("token", token);
            return token;
        } catch (error) {
            throw error;
        }
    },

    async logout() {
        sessionStorage.removeItem("token");
    },

    async getByToken(): Promise<UsuarioConsulta> {
        try {
            const { data } = await http.get("/auth/me"); // Consulta os dados do usuário autenticado
            const usuario = await usuariosServices.getUserById(data.idUsuario); // Pega o id que não muda e consulta o estado atual no banco
            return usuario; // Retorna os dados do usuário autenticado com base no banco de dados (atualizado)
        } catch (error) {
            throw error;
        }
    },

    async confirmarSenha(confirmar: ConfirmarSenha): Promise<Boolean> {
        try {
            const usuarioToken = await this.getByToken(); // Pega os dados do usuário autenticado
            const usuario = await usuariosServices.getUserById(usuarioToken.idUsuario); // Pega o id que não muda e consulta o estado atual no banco
            confirmar.email_usuario = usuario.email; // Atribuir o e-mail para facilitar o preenchimento do formulário
            const { data } = await http.post("/auth/confirmar", confirmar);
            return data;
        } catch (error) {
            throw error;
        }
    },

    async alterarSenha(alter: AlterarSenha) {
        try {
            const { data } = await http.put("/auth/alter", alter);
            return data;
        } catch (error) {
            throw error;
        }
    },

    async resetarSenhaAoPadrao(emailUsuario: string) {
        try {
            await http.put(`/auth/resetar-senha?emailUsuario=${emailUsuario}`);
        } catch (error) {
            throw error;
        }
    },
};
