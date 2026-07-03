// Plugins
import { i18n } from '@/plugins/i18n';

// Types e Interfaces
import type { IHeadersDataTable } from '@/models/components/lHeaderTable';
import type { IUsuario } from '@/models/model/usuario/lUsuario';

function traduzir(pChave: string): string {
  const tradutor = i18n.global as unknown as { t: (pChaveTraducao: string) => string };

  return tradutor.t(pChave);
}

export function formatarBooleanoUsuario(pValor?: boolean): string {
  return pValor ? traduzir('messages.yes') : traduzir('messages.no');
}

export const MAPEAMENTO_CORES_AGRUPAMENTO_USUARIO: Partial<Record<keyof IUsuario, Record<string, string>>> = {
  ativo: {
    true: 'success',
    false: 'error',
  },
};

export const MAPEAMENTO_TABELA_USUARIO: IHeadersDataTable[] = [
  {
    title: traduzir('dataTable.users.headers.id'),
    align: 'start',
    key: 'id',
    width: 50,
  },
  {
    title: traduzir('dataTable.users.headers.username'),
    align: 'start',
    key: 'nome',
    width: 250,
  },
  {
    title: traduzir('dataTable.users.headers.email'),
    align: 'start',
    key: 'email',
    width: 200,
  },
  {
    title: traduzir('dataTable.users.headers.role'),
    align: 'start',
    key: 'papel',
    width: 'auto',
    maxWidth: 100,
  },
  {
    title: traduzir('dataTable.users.headers.phoneNumber'),
    align: 'end',
    key: 'telefone',
    width: 'auto',
    maxWidth: 200,
  },
  {
    title: traduzir('dataTable.users.headers.receiveNotifications'),
    key: 'notificar',
    align: 'center',
    value: (pItem: IUsuario) => formatarBooleanoUsuario(pItem.notificar),
    chartFormatter: formatarBooleanoUsuario,
  },
  {
    title: traduzir('dataTable.users.headers.active'),
    key: 'ativo',
    align: 'center',
    value: (pItem: IUsuario) => formatarBooleanoUsuario(pItem.ativo),
    chartFormatter: formatarBooleanoUsuario,
  },
  {
    title: traduzir('dataTable.headersDefault.actions'),
    key: 'actions',
    align: 'center',
  },
];
