// Plugins
import { i18n } from '@/plugins/i18n';

/**
 * @description Classe para centralizar a tradução de textos usando o plugin do i18n
 */
export class CTradutor {
  // Atributo privado para centralizar o tratamento necessário para recuperar os dados do plugin de tradução
  private static readonly global = i18n.global as unknown as {
    t: (pChaveTraducao: string) => string;
    locale: { value: string };
  };

  /**
   * @description Traduz uma chave de tradução para a linguagem atual
   * @param {string} pChave - Chave de tradução a ser traduzida
   * @returns {string} Texto traduzido
   */
  static traduzir(pChave: string): string {
    return this.global.t(pChave);
  }

  /**
   * @description Obtém o locale ativo atualmente no sistema.
   * @returns {string} Código do locale ativo (ex: "pt-BR").
   */
  static get locale(): string {
    return this.global.locale.value;
  }
}
