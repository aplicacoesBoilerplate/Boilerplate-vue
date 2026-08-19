// Types e Interfaces
import type { IPreferenciasUsuario, IPreferenciaUsuario } from '@/models/services/IPreferenciaUsuario';

// Services
import { CBaseHttpService } from '@/services/base/CBaseHttpService';

/**
 * @description Centraliza os contratos HTTP de preferências persistentes do usuário autenticado.
 */
export class CPreferenciaUsuarioService extends CBaseHttpService {
  /**
   * @description Busca todas as preferências do usuário autenticado.
   * @returns Preferências persistidas no backend.
   */
  public async buscarPreferenciasUsuarioAutenticado(): Promise<IPreferenciasUsuario> {
    return this.get<IPreferenciasUsuario>({ pathUrl: '/preferencias/me' });
  }

  /**
   * @description Salva um conjunto de preferências do usuário autenticado.
   * @param pPreferencias Preferências que serão persistidas.
   * @returns Preferências atualizadas.
   */
  public async salvarPreferenciasUsuarioAutenticado(
    pPreferencias: IPreferenciasUsuario,
  ): Promise<IPreferenciasUsuario> {
    return this.put<IPreferenciasUsuario, IPreferenciasUsuario>({ pathUrl: '/preferencias/me', body: pPreferencias });
  }

  /**
   * @description Salva uma preferência específica do usuário autenticado.
   * @param pPreferencia Preferência que será persistida.
   * @returns Preferência atualizada.
   */
  public async salvarPreferenciaUsuarioAutenticado(
    pPreferencia: IPreferenciaUsuario,
  ): Promise<IPreferenciaUsuario> {
    return this.put<IPreferenciaUsuario, IPreferenciaUsuario>({ pathUrl: '/preferencias/me/item', body: pPreferencia });
  }
}

export const preferenciaUsuarioService = new CPreferenciaUsuarioService();
