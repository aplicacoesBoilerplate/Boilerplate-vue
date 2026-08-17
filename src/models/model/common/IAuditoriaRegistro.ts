/**
 * @description Metadados de auditoria para criação e atualização de registros.
 * @property {string | Date | null} criadoEm - Data/hora de criação do registro.
 * @property {number | null} criadoPor - Identificador do usuário que criou o registro.
 * @property {string | null} criadoPorReferencia - Nome ou referência textual do criador.
 * @property {string | Date | null} atualizadoEm - Data/hora da última atualização.
 * @property {number | null} atualizadoPor - Identificador do último usuário que alterou.
 * @property {string | null} atualizadoPorReferencia - Nome ou referência textual do último alterador.
 */
export interface IAuditoriaRegistro {
  criadoEm?: string | Date | null;
  criadoPor?: number | null;
  criadoPorReferencia?: string | null;
  atualizadoEm?: string | Date | null;
  atualizadoPor?: number | null;
  atualizadoPorReferencia?: string | null;
}
