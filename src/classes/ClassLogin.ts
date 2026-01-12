import { StorageUtils } from "@/utils/StorageUtils";
import type { ILogin } from "./models/ModelLogin";
import { reactive } from "vue";

export class ClassLogin {
  private login: ILogin

  constructor(data?: Partial<ILogin>) {
    this.login = this.getDefault(data);
  }

  get model() {
    return this.login;
  }

  private getDefault(data?: Partial<ILogin>): ILogin {
    const emailDefault = StorageUtils.get<string>('access_email', '@gmail.com', 'local');

    return reactive({
      email: emailDefault! || data?.email || '',
      password: data?.password || ''
    })
  }

  reset() {
    const defaults = this.getDefault();
    Object.assign(this.login, defaults);
    StorageUtils.set('access_email', '@gmail.com', 'local');
  }

  saveEmailPreference() {
    StorageUtils.set('access_email', this.login.email, 'local');
  }

}
