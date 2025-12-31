import type { IUser } from "@/classes/models/ModelUser";
import { reactive } from "vue";
import type { IHeadersDataTable } from "./models/modelComponents/ModelHeaderTable";

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

  static formatBoolean(value?: boolean): string {
    return value ? 'Yes' : 'No'
  }

  static getHeaders(): IHeadersDataTable[] {
    return [
      { title: 'Id', align: 'start', key: 'idUser', width: 50 },
      { title: 'Username', align: 'start', key: 'username', width: 150 },
      { title: 'Email', align: 'start', key: 'email', width: 200 },
      { title: 'Role', align: 'start', key: 'role', width: 'auto', maxWidth: 100 },
      { title: 'Phone Number', align: 'end', key: 'phoneNumber', width: 'auto', maxWidth: 300 },
      {
        title: 'Receive Notifications',
        key: 'receiveNotifications',
        align: 'center',
        value: (item: IUser) => ClassUsers.formatBoolean(item.receiveNotifications),
        chartFormatter: ClassUsers.formatBoolean
      },
      {
        title: 'Active',
        key: 'active',
        align: 'center',
        value: (item: IUser) => ClassUsers.formatBoolean(item.active),
        chartFormatter: ClassUsers.formatBoolean
      },
      {
        title: 'Actions',
        key: 'actions',
        align: 'center'
      },
    ];
  }
}
