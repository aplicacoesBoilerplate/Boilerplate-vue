/**
 * @description Preferência persistida por usuário, contexto e chave.
 * @property {number} id - Identificador da preferência no backend.
 * @property {string} contexto - Contexto funcional da preferência.
 * @property {string} chave - Chave estável dentro do contexto.
 * @property {string} valorJson - Valor serializado em JSON.
 */
export interface IPreferenciaUsuario {
  id?: number;
  contexto: string;
  chave: string;
  valorJson: string;
}

/**
 * @description Envelope usado para buscar ou salvar preferências do usuário autenticado.
 * @property {IPreferenciaUsuario[]} preferencias - Preferências persistidas para o usuário.
 */
export interface IPreferenciasUsuario {
  preferencias: IPreferenciaUsuario[];
}
