// Ecossistema Vue
import { reactive } from 'vue';
import { i18n } from '@/plugins/i18n';

// Types e Interfaces
import type { IHeadersDataTable } from '../models/components/lHeaderTable';
import type { IUsuario } from '@/models/model/usuario/lUsuario';

// Classe responsável por determinar exibições e renderização dos componentes da tela de usuários.
export class ClassUsuarios {
  private usuario: IUsuario;

  constructor(data?: Partial<IUsuario>) {
    this.usuario = this.getDefault(data);
  }

  get model(): IUsuario {
    return this.usuario;
  }

  private getDefault(data?: Partial<IUsuario>): IUsuario {
    return reactive({
      id: data?.id,
      nome: data?.nome || 'Gerson Ribeiro',
      email: data?.email || '',
      papel: data?.papel || 'ADMIN',
      telefone: data?.telefone || '',
      notificar: data?.notificar || false,
      ativo: data?.ativo || true,
    }) as IUsuario;
  }

  updateModel(data: IUsuario) {
    Object.assign(this.usuario, data);
  }

  reset() {
    const defaults = this.getDefault();

    Object.keys(this.usuario).forEach((key) => {
      // @ts-ignore
      delete this.usuario[key];
    });

    Object.assign(this.usuario, defaults);
  }

  static formatBoolean(value?: boolean): string {
    // @ts-ignore
    const t = (key: string) => i18n.global.t(key);

    return value ? t('messages.yes') : t('messages.no');
  }

  static getHeaders(): IHeadersDataTable[] {
    // @ts-ignore
    const t = (key: string) => i18n.global.t(key);

    return [
      {
        title: t('dataTable.users.headers.id'),
        align: 'start',
        key: 'idUser',
        width: 50,
      },
      {
        title: t('dataTable.users.headers.username'),
        align: 'start',
        key: 'username',
        width: 250,
      },
      {
        title: t('dataTable.users.headers.email'),
        align: 'start',
        key: 'email',
        width: 200,
      },
      {
        title: t('dataTable.users.headers.role'),
        align: 'start',
        key: 'role',
        width: 'auto',
        maxWidth: 100,
      },
      {
        title: t('dataTable.users.headers.phoneNumber'),
        align: 'end',
        key: 'phoneNumber',
        width: 'auto',
        maxWidth: 200,
      },
      {
        title: t('dataTable.users.headers.receiveNotifications'),
        key: 'receiveNotifications',
        align: 'center',
        value: (item: IUsuario) => ClassUsuarios.formatBoolean(item.notificar),
        chartFormatter: ClassUsuarios.formatBoolean,
      },
      {
        title: t('dataTable.users.headers.active'),
        key: 'active',
        align: 'center',
        value: (item: IUsuario) => ClassUsuarios.formatBoolean(item.ativo),
        chartFormatter: ClassUsuarios.formatBoolean,
      },
      {
        title: t('dataTable.headersDefault.actions'),
        key: 'actions',
        align: 'center',
      },
    ];
  }
}
