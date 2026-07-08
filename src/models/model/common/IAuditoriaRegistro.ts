/**
 * @description Metadados de criação e última atualização de um registro.
 */
export interface IAuditoriaRegistro {
  criadoEm?: string | Date | null;
  criadoPor?: number | null;
  criadoPorReferencia?: string | null;
  atualizadoEm?: string | Date | null;
  atualizadoPor?: number | null;
  atualizadoPorReferencia?: string | null;
}
