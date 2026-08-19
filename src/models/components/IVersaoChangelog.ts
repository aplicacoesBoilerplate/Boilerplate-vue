/** @description Opções das abas no componente das informações do sistema */
export type TAbaSistema = 'geral' | 'versoes';

/**
 * @property {string} titulo - Título da seção (ex: Novidades, Correções de bugs, etc)
 * @property {string} icone - Ícone da seção
 * @property {string} cor - Cor do ícone
 * @property {string[]} itens - Itens da seção
 */
export type TSecaoChangelog = {
  titulo: string;
  icone: string;
  cor: string;
  itens: string[];
};

/**
 * @property {string} numero - Versão do changelog
 * @property {string} data - Data do changelog
 * @property {TSecaoChangelog[]} secoes - Seções do changelog
 * @property {number} totalItens - Total de itens do changelog
 */
export type TVersaoChangelog = {
  numero: string;
  data: string;
  secoes: TSecaoChangelog[];
  totalItens: number;
};

/** @description Objeto usado para montagem do changelog em versões do sistema */
export type TMetadadosSecaoChangelog = Omit<TSecaoChangelog, 'itens'>;

/**
 * @property {number} totalAlteracoes - Total de alterações registradas no changelog
 * @property {string} versaoAtual - Versão atual do sistema
 * @property {TVersaoChangelog | null} versaoMaisRecenteChangelog - Versão mais recente registrada no changelog
 * @property {TVersaoChangelog[]} versoes - Array de versões registradas no changelog
 */
export type TPropsResumoVersoes = {
  totalAlteracoes: number;
  versaoAtual: string;
  versaoMaisRecenteChangelog: TVersaoChangelog | null;
  versoes: TVersaoChangelog[];
};

/** Tipagem com origem em TPropsResumoVersoes para o componente ListaRealizadosVersoes */
export type TPropsListaRealizadosVersoes = Pick<TPropsResumoVersoes, 'versaoAtual' | 'versoes'>;
