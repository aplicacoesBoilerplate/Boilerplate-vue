// Types e Interfaces
import type { IRespostaConsultaRegistros, TOrdem } from '@/models/consulta/IConsultaRegistros';
import type { TManagerStorageLocation } from '@/utils/ManagerStorage';

/**
 * @description Opções que definem a inicialização e a persistência de um contexto de lista.
 *
 * @property {number} cacheTtlMs - Tempo de validade do contexto persistido.
 * @property {TManagerStorageLocation} storage - Local de armazenamento do contexto.
 * @property {number} limite - Quantidade de registros solicitada por página.
 * @property {TOrdem} ordem - Direção de ordenação inicial da lista.
 */
export interface IGenericListContextOptions {
  cacheTtlMs?: number;
  storage?: TManagerStorageLocation;
  limite?: number;
  ordem?: TOrdem;
}

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
