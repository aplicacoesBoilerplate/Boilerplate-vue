export interface IPreferencesDrawer {
  /** Se o menu principal (drawer) esta visivel ou oculto no modo desktop. */
  isDesktopDrawerVisible: boolean;
  /** Se o menu principal esta fixado na tela (pinned) no modo desktop. */
  isDrawerPinned: boolean;
}

export interface IPreferencesTheme {
  /** Tema de cores atual selecionado pelo usuario. */
  currentTheme: 'light' | 'dark' | 'system';
}

// Interface principal de preferencias.
export interface IPreferences {
  drawer: IPreferencesDrawer;
  theme: IPreferencesTheme;
}
