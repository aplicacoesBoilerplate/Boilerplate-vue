import type { SnackbarQueueMessage } from 'vuetify';

/** @description Define os tipos visuais disponíveis para o snackbar. */
export type TTipoSnackbar = 'success' | 'error' | 'info' | 'warning';

/**
 * @description Interface de propriedades para a fila do Snackbar.
 * @property {TTipoSnackbar} [tipo] Estilo visual baseado no contexto da mensagem.
 * @property {string} [titulo] Título principal da mensagem (em negrito no topo).
 * @property {string} mensagem Corpo detalhado do alerta ou da notificação.
 * @property {number} [timeout] Tempo em milissegundos para desaparecer sozinho.
 * @property {string} [icon] Ícone customizado (substitui o padrão atrelado ao `type`).
 * @property {string} [urlRedirecionamento] Url para um link acionável gerado na lateral do snackbar.
 */
export interface IPropsSnackbarQueue {
  tipo?: TTipoSnackbar;
  titulo?: string;
  mensagem: string;
  timeout?: number;
  icon?: string;
  urlRedirecionamento?: string;
}

/** @description Tipo para usar com o v-snackbar-queue na store. */
export type TSnackbarQueueItem = Exclude<SnackbarQueueMessage, string> & { urlRedirecionamento?: string; id?: string };
