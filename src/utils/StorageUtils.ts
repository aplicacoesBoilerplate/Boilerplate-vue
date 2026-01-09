export type StorageType = 'local' | 'session';

export class StorageUtils {
  static set<T>(key: string, value: T, type: StorageType = 'local'): void {
    try {
      const jsonValue = JSON.stringify(value);
      const storage = type === 'session' ? sessionStorage : localStorage;
      storage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Erro ao salvar a chave "${key}":`, error);
    }
  }

  static get<T>(key: string, defaultValue: T | null = null, type: StorageType = 'local'): T | null {
    try {
      const storage = type === 'session' ? sessionStorage : localStorage;
      const item = storage.getItem(key);

      if (item === null) {
        return defaultValue;
      }

      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Erro ao ler a chave "${key}":`, error);
      return defaultValue;
    }
  }
}
