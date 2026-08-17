// Models
import type { IErros } from '@/models/model/common/IErros';

// Classes
import { CBaseConsultaApiService } from './base/CBaseConsultaApiService';

export class CErrosService extends CBaseConsultaApiService<IErros> {
  constructor() {
    super('/erros');
  }
}

export const errosService = new CErrosService();
