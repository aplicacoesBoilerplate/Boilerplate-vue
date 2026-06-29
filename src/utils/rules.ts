export const rulesPersonalizadas = {
  equals: (compareTo: string | (() => string)) => {
    return (v: string) =>
      v === (typeof compareTo === 'function' ? compareTo() : compareTo) || 'Os valores não coincidem';
  },
  includes: (validValues: string[]) => {
    return (v: string) => validValues.includes(v) || 'Preencha uma opção válida';
  },
  dateAfter: (compareTo: string | Date | (() => string | Date)) => {
    return (v: string | Date | null | undefined) => {
      if (!v) return true;

      // Converte o valor para data e remove a hora
      const inputDate = new Date(v);
      inputDate.setHours(0, 0, 0, 0);

      const compareRaw = typeof compareTo === 'function' ? compareTo() : compareTo;
      const compareDate = new Date(compareRaw);
      compareDate.setHours(0, 0, 0, 0);

      if (isNaN(inputDate.getTime())) return 'Data inválida';
      if (isNaN(compareDate.getTime())) return 'Data de comparação inválida';

      return inputDate >= compareDate || 'Não permitido anterior a data atual';
    };
  },
  dateAfterWithHours: (compareTo: string | Date | (() => string | Date)) => {
    return (v: string | Date) => {
      if (!v) return true;
      const inputDate = new Date(v);
      const compareRaw = typeof compareTo === 'function' ? compareTo() : compareTo;
      const compareDate = new Date(compareRaw);

      if (isNaN(inputDate.getTime())) return 'Data inválida';
      if (isNaN(compareDate.getTime())) return 'Data de comparação inválida';

      return inputDate > compareDate || 'Não permitido anterior a data atual';
    };
  },
};
