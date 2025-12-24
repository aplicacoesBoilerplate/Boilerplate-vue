import type { ITraceError } from "./ModelErrorTrace";
import type { IUser } from "./ModelUser";

export interface IErrorAPI {
  errorMessage: string;
  errorDateTime: Date;
  errorStatusCode: number;
  user: IUser;
  trace: ITraceError;
}
