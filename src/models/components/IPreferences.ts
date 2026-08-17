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

import type { TChartType } from './TChartType';

export interface IChartPreferences {
  visible: boolean;
  grouping: string;
  type: TChartType;
  showLegend: boolean;
  showLabels: boolean;
}

/** @description Interface principal de preferencias. */
export interface IPreferences {
  drawer: IPreferencesDrawer;
  theme: IPreferencesTheme;
  charts: Record<string, IChartPreferences>;
}
