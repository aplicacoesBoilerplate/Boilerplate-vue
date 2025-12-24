import type { IErrorAPI } from "./models/ModelErrorAPI"

export class ClassErrorAPI {
  private errorAPI: IErrorAPI;

  constructor(error?: IErrorAPI) {
    this.errorAPI = error ?? {} as IErrorAPI;
  }

  get getErrorAPI(): IErrorAPI {
    return this.errorAPI;
  }
}
