/**
 * @property {boolean} isDesktopDrawerVisible - Se o menu principal (drawer) esta visivel ou oculto no modo desktop.
 * @property {boolean} isDrawerPinned - Se o menu principal esta fixado na tela (pinned) no modo desktop.
 */
export interface IPreferencesDrawer {
  isDesktopDrawerVisible: boolean;
  isDrawerPinned: boolean;
}

/** @description Tema de cores atual selecionado pelo usuario. */
export interface IPreferencesTheme {
  currentTheme: 'light' | 'dark' | 'system';
}

/** @description Interface principal de preferencias. */
export interface IPreferences {
  drawer: IPreferencesDrawer;
  theme: IPreferencesTheme;
}
