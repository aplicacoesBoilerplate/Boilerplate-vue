// Types e Interfaces
import type { IRespostaConsultaRegistros } from "@/models/consulta/IConsultaRegistros";
import type { TManagerStorageLocation } from '@/utils/ManagerStorage';

/**
 * @description Interface que estende de IResultadoConsultaRegistros.
 * @template TInterfaceRegistro - Espera a interface do Objeto consultado.
 * 
 * @property {string} contexto - Identificador único dessa lista.
 * @property {number} atualizadoEm - Ultima alteração do contexto, útil para debug e políticas futuras de cache com redis.
 * @property {number} cacheTtlMs - Tempo de validade do contexto no storage da aba.
 * @property {TManagerStorageLocation} storage - Session para cache temporário de listas, local fica disponível para outros usos.
 */
export interface IGenericListContext<TInterfaceRegistro extends object = object> extends IRespostaConsultaRegistros<TInterfaceRegistro> {
  contexto: string;
  atualizadoEm: number;
  cacheTtlMs?: number;
  storage?: TManagerStorageLocation;
}
