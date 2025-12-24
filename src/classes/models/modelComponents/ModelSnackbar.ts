export type SnackbarColor = 'success' | 'info' | 'warning' | 'error';

export interface IModelSnackbar {
  visible: boolean;
  message: string;
  color: SnackbarColor;
}
