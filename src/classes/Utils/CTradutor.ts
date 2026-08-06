// Plugins
import { i18n } from '@/plugins/i18n';

/**
 * @description Classe para centralizar a tradução de textos usando o plugin do i18n.
 */
export class CTradutor {
  // Atributo privado para centralizar o tratamento necessário para recuperar os dados do plugin de tradução.
  private static readonly global = i18n.global as unknown as {
    t: (pChaveTraducao: string) => string;
    te: (pChaveTraducao: string) => boolean;
    locale: { value: string };
  };

  /**
   * @description Verifica se uma chave possui tradução no locale atual ou em seus fallbacks.
   * @param pChave - Chave de tradução.
   * @returns Indica se existe uma tradução para a chave.
   */
  static possuiTraducao(pChave: string): boolean {
    return this.global.te(pChave);
  }  

  /**
   * @description Traduz uma chave de tradução para a linguagem atual.
   * @param {string} pChave - Chave de tradução a ser traduzida.
   * @param {string} pDefault - Texto opcional exibido quando a tradução falha.
   * @returns {string} Texto traduzido.
   */
  static traduzir(pChave: string, pDefault: string = ''): string {
    return this.possuiTraducao(pChave) ? this.global.t(pChave) : pDefault;
  }

  /**
   * @description Obtém o locale ativo atualmente no sistema.
   * @returns {string} Código do locale ativo (ex: "pt-BR").
   */
  static get locale(): string {
    return this.global.locale.value;
  }
}
