import type { SnackbarQueueMessage } from 'vuetify';

export type TSnackbarType = 'success' | 'error' | 'info' | 'warning';

export interface IPropsSnackbarQueue {
  /** Estilo visual baseado no contexto da mensagem. */
  tipo?: TSnackbarType;
  /** Titulo principal da mensagem (em negrito no topo). */
  titulo?: string;
  /** Corpo detalhado do alerta ou da notificacao. */
  mensagem: string;
  /** Tempo em milissegundos para desaparecer sozinho. */
  timeout?: number;
  /** Icone customizado (substitui o padrao atrelado ao `type`). */
  icon?: string;
  /** Url para um link acionavel gerado na lateral do snackbar. */
  urlRedirecionamento?: string;
}

// Tipo para usar com o v-snackbar-queue na store
export type TSnackbarQueueItem = Exclude<SnackbarQueueMessage, string> & { urlRedirecionamento?: string, id?: string };
