// Types e Interfaces
import type { IPreferenciaUsuario, IPreferenciasUsuario } from '@/models/services/IPreferenciaUsuario';

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
  public static async buscarPreferenciasUsuarioAutenticado(): Promise<IPreferenciasUsuario> {
    return CPreferenciaUsuarioService.get<IPreferenciasUsuario>('/preferencias/me');
  }

  /**
   * @description Salva um conjunto de preferências do usuário autenticado.
   * @param pPreferencias Preferências que serão persistidas.
   * @returns Preferências atualizadas.
   */
  public static async salvarPreferenciasUsuarioAutenticado(
    pPreferencias: IPreferenciasUsuario,
  ): Promise<IPreferenciasUsuario> {
    return CPreferenciaUsuarioService.put<IPreferenciasUsuario, IPreferenciasUsuario>(
      '/preferencias/me',
      pPreferencias,
    );
  }

  /**
   * @description Salva uma preferência específica do usuário autenticado.
   * @param pPreferencia Preferência que será persistida.
   * @returns Preferência atualizada.
   */
  public static async salvarPreferenciaUsuarioAutenticado(
    pPreferencia: IPreferenciaUsuario,
  ): Promise<IPreferenciaUsuario> {
    return CPreferenciaUsuarioService.put<IPreferenciaUsuario, IPreferenciaUsuario>(
      '/preferencias/me/item',
      pPreferencia,
    );
  }
}
