import type { ITraceError } from './ModelErrorTrace';
import type { IUser } from '../../models/model/lUser';

export interface IErrorAPI {
  errorMessage: string;
  errorDateTime: Date;
  errorStatusCode: number;
  user: IUser;
  trace: ITraceError;
}
