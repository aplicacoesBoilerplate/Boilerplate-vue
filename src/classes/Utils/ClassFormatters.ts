export class ClassFormatters {
  static formatarGenerico(pValue: any): string {
    return String(pValue ?? "").trim() || "N/A";
  }

  static formatarCaptalize(pString: string): string {
    const stringFormatada = this.formatarGenerico(pString);
    return stringFormatada.charAt(0).toUpperCase() + stringFormatada.slice(1);
  }

  static formatarInteiroParaBooleano(pValue: any): boolean {
    return pValue === 1 ? true : false;
  }

  /**
   * Converte uma string de data (ex: "2024-05-20 14:30:00") em objeto Date (UTC)
   * e formata para exibição no fuso horário do usuário.
   *
   * @param pData String da data no formato "YYYY-MM-DD HH:MM:SS"
   * @param pLocale Locale para formatação (ex: "pt-BR")
   * @param pWithTime Se deve incluir hora e minutos
   * @returns Data formatada como string ou "-" se inválida
   */
  static formatarDataHora(pData: string | Date, pLocale: string = 'pt-BR', pWithTime: boolean = true): string {
    if (!pData) return "-";

    let parsedDate: Date;

    if (pData instanceof Date) {
      parsedDate = pData;
    } else if (typeof pData === 'string') {
      // Verifica se o formato é "YYYY-MM-DD HH:MM:SS" (sem Z)
      const isYYYYMMDDHHMMSS = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(pData);

      if (isYYYYMMDDHHMMSS) {
        // Se for "YYYY-MM-DD HH:MM:SS", substitui espaço por 'T' e adiciona 'Z' para o JS interpretar como UTC
        // Isso garante que o banco de dados e o JS concordem com o fuso horário (UTC)
        parsedDate = new Date(pData.replace(' ', 'T') + 'Z');
      } else {
        // Para outros formatos (ex: "2024-05-20T14:30:00.000Z"), o JS já interpreta corretamente como UTC
        parsedDate = new Date(pData);
      }
    } else {
      return "-";
    }

    // Verifica se a data é válida
    if (isNaN(parsedDate.getTime())) {
      return "-";
    }

    const lConfigFormat: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };

    if (pWithTime) {
      lConfigFormat.hour = '2-digit';
      lConfigFormat.minute = '2-digit';
      lConfigFormat.second = '2-digit';
    }

    return new Intl.DateTimeFormat(pLocale, lConfigFormat).format(parsedDate);
  }
}
