// Types e Interfaces
import type { IErros } from './IErros';
import type { IHeadersDataTable } from '@/models/components/lHeaderTable';

// Utils
import { CFormatters } from '@/classes/Utils/CFormatters';

function formatarDataErro(pItem: IErros): string {
  return CFormatters.formatarDataHora(pItem.dataHora, 'pt-BR', true);
}

export const MAPEAMENTO_TABELA_ERROS: IHeadersDataTable[] = [
  {
    title: 'Código',
    align: 'start',
    key: 'idError',
    width: 70,
  },
  {
    title: 'Mensagem',
    align: 'start',
    key: 'mensagem',
    width: 260,
  },
  {
    title: 'Status HTTP',
    align: 'center',
    key: 'httpStatusCode',
    width: 120,
  },
  {
    title: 'Classe',
    align: 'start',
    key: 'classe',
    width: 220,
  },
  {
    title: 'Método',
    align: 'start',
    key: 'metodo',
    width: 180,
  },
  {
    title: 'Linha',
    align: 'center',
    key: 'linha',
    width: 80,
  },
  {
    title: 'Usuário',
    align: 'start',
    key: 'usuarioReferencia',
    width: 180,
  },
  {
    title: 'Data e hora',
    align: 'start',
    key: 'dataHora',
    width: 180,
    value: formatarDataErro,
  },
];
