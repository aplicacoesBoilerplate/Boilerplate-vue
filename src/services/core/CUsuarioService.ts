// Models
import type { IUsuario } from '@/models/model/core/usuario.model';

// Classes
import { CBaseCrudApiService } from '../base/CBaseCrudApiService';

export class CUsuarioService extends CBaseCrudApiService<IUsuario> {
  constructor() {
    super('/usuarios');
  }
}

export const usuarioService = new CUsuarioService();
