function removeUndefined(obj: Record<string, any>) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined))
}

export function useUtils() {
  return {
    removeUndefined,
  }
}

export const rules = {
  required: (v: string | number) => !!v || 'Campo obrigatório',
  emailFormat: (value: string) => /.+@.+\..+/.test(value) || 'Formato de e-mail inválido.',
  min: (v: string | any[]) => v.length >= 8 || 'Mínimo de 8 caracteres',
  max: (v: string | any[]) => v.length <= 100 || 'Máximo 100 caracteres',
  equals: (compareTo: string | (() => string)) => {
    return (v: string) =>
      v === (typeof compareTo === 'function' ? compareTo() : compareTo) ||
      'Os valores não coincidem'
  },
}
