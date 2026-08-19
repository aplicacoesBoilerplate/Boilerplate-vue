// Classes
import { CTradutor } from './CTradutor';

/**
 * @description Classe utilitária responsável por centralizar funções de formatação genéricas da aplicação.
 */
export class CFormatters {
  /**
   * @description Formata um valor genérico para string.
   * @param {object} pValor Valor que será formatado.
   * @returns {string} Valor formatado.
   */
  static formatarGenerico(pValor: object | string): string {
    return String(pValor ?? '').trim() || 'N/A';
  }

  /**
   * @description Formata uma string separada por _ para exibição legível.
   * @param {string} pValor String que será formatada.
   * @returns {string} String formatada.
   */
  static formatarSplitUnderline(pValor?: string | null): string {
    return pValor ? pValor.split('_').join(' ') : '-';
  }

  /**
   * @description Formata uma string para capitalize.
   * @param {string} pString String que será formatada.
   * @returns {string} String formatada.
   */
  static formatarCaptalize(pString: string): string {
    const lStringFormatada = this.formatarGenerico(pString);
    return lStringFormatada.charAt(0).toUpperCase() + lStringFormatada.slice(1);
  }

  /**
   * @description Formata um booleano para "Sim" ou "Não" com base no idioma ativo.
   * @param {boolean | null | undefined} pValue Valor que será formatado.
   * @returns {string} Valor formatado.
   */
  static formatarBooleano(pValue?: boolean | null): string {
    return pValue ? CTradutor.traduzir('messages.yes') : CTradutor.traduzir('messages.no');
  }

  /**
   * @description Formata um inteiro para booleano. Considera 1 como 'Sim'.
   * @param {0 | 1} pValor Valor que será formatado.
   * @returns {string} Valor formatado.
   */
  static formatarInteiroParaBooleano(pValor: 0 | 1): string {
    const lResultado = pValor === 1 ? true : false;
    return this.formatarBooleano(lResultado);
  }

  /**
   * @description Formata o valor de uma célula para exportação de dados.
   * @param {unknown} pValor Valor que será formatado.
   * @returns {string} Valor formatado.
   */
  static formatarValorExportacao(pValor: unknown): string {
    if (pValor === null || pValor === undefined) {
      return '';
    }

    if (typeof pValor === 'boolean') {
      return this.formatarBooleano(pValor);
    }

    if (pValor instanceof Date) {
      const lIncluirHora = pValor.getUTCHours() !== 0 || 
        pValor.getUTCMinutes() !== 0 || 
        pValor.getUTCSeconds() !== 0 || 
        pValor.getUTCMilliseconds() !== 0;
      return this.formatarDataHora(pValor, lIncluirHora);
    }

    return String(pValor);
  }

  /**
   * @description Formata uma string de data (ex: "2024-05-20 14:30:00") em objeto Date (UTC) e formata para exibição no fuso horário do usuário.
   * @param pData String da data no formato "YYYY-MM-DD HH:MM:SS" ou objeto Date.
   * @param pIncluirHora Se deve incluir hora e minutos, true por padrão.
   * @returns Data formatada como string ou "-" se inválida.
   */
  static formatarDataHora(pData?: string | Date | null, pIncluirHora: boolean = true): string {
    if (!pData) return '-';

    let lParsedDate: Date;
    if (pData instanceof Date) {
      lParsedDate = pData;
    } else if (typeof pData === 'string') {
      const isYYYYMMDDHHMMSS = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(pData);
      const isYYYYMMDD = /^\d{4}-\d{2}-\d{2}$/.test(pData);

      if (isYYYYMMDDHHMMSS) {
        lParsedDate = new Date(pData.replace(' ', 'T') + 'Z');
      } else if (isYYYYMMDD) {
        // Se vier apenas a data, forçamos o parse como horário LOCAL (T00:00:00) 
        // para evitar que o Intl.DateTimeFormat jogue a data para o dia anterior.
        lParsedDate = new Date(pData + 'T00:00:00');
      } else {
        // Fallback para gerar uma Data válida.
        lParsedDate = new Date(pData);
      }
    } else {
      return '-';
    }

    // Verifica se a data é válida
    if (isNaN(lParsedDate.getTime())) {
      return '-';
    }

    // Configuração base do Intl, horário é adicionado sob condicional.
    const lConfigFormat: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    if (pIncluirHora) {
      lConfigFormat.hour = '2-digit';
      lConfigFormat.minute = '2-digit';
      lConfigFormat.second = '2-digit';
    }

    return new Intl.DateTimeFormat(CTradutor.locale, lConfigFormat).format(lParsedDate);
  }
}
