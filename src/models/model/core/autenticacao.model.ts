/**
 * @description Interface de base para as derivações de cada caso dos recursos de autenticação.
 * @property {string} identificacaoAcesso - E-mail ou nome de usuário usado na autenticação.
 * @property {string} email - E-mail na recuperação de senha.
 * @property {string} senha - Senha informada pelo usuário.
 * @property {string} confirmarSenha - Confirmação da nova senha escolhida pelo usuário.
 * @property {string} credential - Credencial JWT retornada pelo Google Identity Services.
 */
export interface ILoginBaseModel {
  identificacaoAcesso: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  credential: string;
}

export type TLogin = Pick<ILoginBaseModel, 'identificacaoAcesso' | 'senha'>;
export type TEmailAuth = Pick<ILoginBaseModel, 'email'>;

/**
 * @property {string} codigo - Código OTP enviado para o e-mail informado.
 */
export type TRecuperacaoSenha = TEmailAuth & {
  codigo: string;
}

/**
 * @property {string} novaSenha - Campo para a redefinição de senha, a rule de equals de confirmarSenha deve apontar para este atributo.
 */
export type TRedefinicaoRecuperacaoSenha = Pick<ILoginBaseModel, 'email' | 'senha' | 'confirmarSenha'> & {
  novaSenha: string;
};

export type TConfirmarSenha = Pick<ILoginBaseModel, 'identificacaoAcesso' | 'senha' | 'confirmarSenha'>;

/**
 * @property {string} tokenJWT - Token JWT emitido pelo backend.
 * @property {string} credential - Credencial JWT retornada pelo Google Identity Services.
 */
export interface IRespostaLogin {
  tokenJWT: string;
  credential: string;
}

export type TRespostaLoginPadrao = Pick<IRespostaLogin, 'tokenJWT'>;
export type TRespostaLoginGoogle = Pick<IRespostaLogin, 'credential'>;

/**
 * @description Cria um objeto ILogin com valores padrão.
 * @returns Objeto ILogin com valores padrão.
 */
export function criarLoginPadrao(): TLogin {
  return {
    identificacaoAcesso: '',
    senha: '',
  };
}
