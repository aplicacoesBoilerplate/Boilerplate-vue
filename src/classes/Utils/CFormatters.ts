export class CFormatters {
  static formatarGenerico(pValue: object | string): string {
    return String(pValue ?? '').trim() || 'N/A';
  }

  static formatarCaptalize(pString: string): string {
    const stringFormatada = this.formatarGenerico(pString);
    return stringFormatada.charAt(0).toUpperCase() + stringFormatada.slice(1);
  }

  static formatarInteiroParaBooleano(pValue: number): boolean {
    return pValue === 1 ? true : false;
  }

  /**
   * @description Converte uma string de data (ex: "2024-05-20 14:30:00") em objeto Date (UTC)
   * e formata para exibição no fuso horário do usuário.
   * @param pData String da data no formato "YYYY-MM-DD HH:MM:SS"
   * @param pLocale Locale para formatação (ex: "pt-BR")
   * @param pWithTime Se deve incluir hora e minutos, true por padrão
   * @returns Data formatada como string ou "-" se inválida
   */
  static formatarDataHora(pData: string | Date, pLocale: string = 'pt-BR', pWithTime: boolean = true): string {
    if (!pData) return '-';

    let parsedDate: Date;

    if (pData instanceof Date) {
      parsedDate = pData;
    } else if (typeof pData === 'string') {
      const isYYYYMMDDHHMMSS = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(pData);

      if (isYYYYMMDDHHMMSS) {
        parsedDate = new Date(pData.replace(' ', 'T') + 'Z');
      } else {
        parsedDate = new Date(pData);
      }
    } else {
      return '-';
    }

    if (isNaN(parsedDate.getTime())) {
      return '-';
    }

    const lConfigFormat: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    if (pWithTime) {
      lConfigFormat.hour = '2-digit';
      lConfigFormat.minute = '2-digit';
      lConfigFormat.second = '2-digit';
    }

    return new Intl.DateTimeFormat(pLocale, lConfigFormat).format(parsedDate);
  }
}
