function removeUndefined(obj: Record<string, any>) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined))
}

export function useUtils() {
  return {
    removeUndefined,
  }
}
