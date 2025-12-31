import type { IUser } from "@/classes/models/ModelUser";
import { reactive } from "vue";

export class ClassUsers {
  private user: IUser

  constructor(data?: Partial<IUser>) {
    this.user = this.getDefault(data);
  }

  get model(): IUser {
    return this.user
  }

  private getDefault(data?: Partial<IUser>): IUser {
    return reactive({
      idUser: data?.idUser,
      username: data?.username || '',
      email: data?.email || '',
      role: data?.role || '',
      phoneNumber: data?.phoneNumber || '',
      receiveNotifications: data?.receiveNotifications || false,
      active: data?.active || true
    }) as IUser;
  }

  updateModel(data: IUser) {
    Object.assign(this.user, data);
  }

  reset() {
    const defaults = this.getDefault();

    Object.keys(this.user).forEach(key => {
      // @ts-ignore
      delete this.user[key];
    });

    Object.assign(this.user, defaults);
  }
}
