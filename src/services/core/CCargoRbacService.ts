// Models
import type { ICargoRbac } from '@/models/model/core/rbac/rbac.model';

// Classes
import { CBaseCrudApiService } from '../base/CBaseCrudApiService';

export class CCargoRbacService extends CBaseCrudApiService<ICargoRbac> {
  constructor() {
    super('/rbac/cargos');
  }
}

export const cargoRbacService = new CCargoRbacService();
