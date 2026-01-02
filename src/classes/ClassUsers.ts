import type { IHeadersDataTable } from "./models/modelComponents/ModelHeaderTable";
import type { IUser } from "@/classes/models/ModelUser";
import { reactive } from "vue";
import { i18n } from '@/plugins/i18n';

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
    // @ts-ignore
    const t = (key: string) => i18n.global.t(key)

    return value ? t('messages.yes') : t('messages.no')
  }

  static getHeaders(): IHeadersDataTable[] {
    // @ts-ignore
    const t = (key: string) => i18n.global.t(key)

    return [
      {
        title: t('dataTable.users.headers.id'),
        align: 'start',
        key: 'idUser',
        width: 50
      },
      {
        title: t('dataTable.users.headers.username'),
        align: 'start',
        key: 'username',
        width: 250
      },
      {
        title: t('dataTable.users.headers.email'),
        align: 'start',
        key: 'email',
        width: 200
      },
      {
        title: t('dataTable.users.headers.role'),
        align: 'start',
        key: 'role',
        width: 'auto',
        maxWidth: 100
      },
      {
        title: t('dataTable.users.headers.phoneNumber'),
        align: 'end',
        key: 'phoneNumber',
        width: 'auto',
        maxWidth: 200
      },
      {
        title: t('dataTable.users.headers.receiveNotifications'),
        key: 'receiveNotifications',
        align: 'center',
        value: (item: IUser) => ClassUsers.formatBoolean(item.receiveNotifications),
        chartFormatter: ClassUsers.formatBoolean
      },
      {
        title: t('dataTable.users.headers.active'),
        key: 'active',
        align: 'center',
        value: (item: IUser) => ClassUsers.formatBoolean(item.active),
        chartFormatter: ClassUsers.formatBoolean
      },
      {
        title: t('dataTable.headersDefault.actions'),
        key: 'actions',
        align: 'center'
      },
    ];
  }
}
