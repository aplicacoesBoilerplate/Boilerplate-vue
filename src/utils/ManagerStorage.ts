export type TManagerStorageLocation = 'local' | 'session';

// TValue é semelhante ao T do Generics
type TStoredValue<TValue> = TValue | TManagedStorageValue<TValue>;

type TManagedStorageValue<TValue> = {
  __managerStorage: true;
  expiresAt: number | null;
  value: TValue;
};

export interface IManagerStorageOptions {
  /** Define onde o dado sera armazenado. O padrao permanece localStorage. */
  storage?: TManagerStorageLocation;
  /** Tempo de vida em milissegundos. Quando expirar, o valor e removido e o fallback e retornado. */
  expiresInMs?: number;
  /** Timestamp absoluto de expiracao. Tem prioridade sobre expiresInMs. */
  expiresAt?: number;
}

export type TManagerStorageOptions = TManagerStorageLocation | IManagerStorageOptions;

// Classe central para persistencia no navegador, com suporte a local/session storage e expiracao.
export class ClassManagerStorage {
  static get<TValue>(key: string, fallback: TValue, options?: TManagerStorageOptions): TValue {
    const storage = this.resolveStorage(options);
    const value = this.safeGetItem(storage, key);

    if (!value) {
      return fallback;
    }

    try {
      const parsedValue = JSON.parse(value) as TStoredValue<TValue>;

      // Valores antigos, salvos antes do TTL existir, continuam legiveis.
      if (!this.isManagedValue(parsedValue)) {
        return parsedValue;
      }

      // Leitura tambem invalida cache expirado, evitando limpezas globais obrigatorias.
      if (this.isExpired(parsedValue.expiresAt)) {
        this.clear(key, options);
        return fallback;
      }

      return parsedValue.value;
    } catch {
      this.clear(key, options);
      return fallback;
    }
  }

  static set<TValue>(key: string, value: TValue, options?: TManagerStorageOptions) {
    const storage = this.resolveStorage(options);
    const expiresAt = this.resolveExpiresAt(options);

    // So envelopa o valor quando ha regra de expiracao; caso contrario mantem JSON simples.
    const storageValue: TStoredValue<TValue> =
      expiresAt !== null
        ? {
            __managerStorage: true,
            expiresAt,
            value,
          }
        : value;

    this.safeSetItem(storage, key, JSON.stringify(storageValue));
  }

  static clear(key: string, options?: TManagerStorageOptions) {
    this.safeRemoveItem(this.resolveStorage(options), key);
  }

  static has(key: string, options?: TManagerStorageOptions) {
    return this.safeGetItem(this.resolveStorage(options), key) !== null;
  }

  static clearExpired(key: string, options?: TManagerStorageOptions) {
    this.get(key, null, options);
  }

  static keys(options?: TManagerStorageOptions) {
    const storage = this.resolveStorage(options);

    try {
      return Array.from({ length: storage.length }, (_, index) => storage.key(index)).filter(
        (key): key is string => typeof key === 'string',
      );
    } catch {
      return [];
    }
  }

  static clearByPrefix(prefix: string, options?: TManagerStorageOptions) {
    const storage = this.resolveStorage(options);

    this.keys(options)
      .filter((key) => key.startsWith(prefix))
      .forEach((key) => this.safeRemoveItem(storage, key));
  }

  static clearExpiredByPrefix(prefix: string, options?: TManagerStorageOptions) {
    // Forca leitura das chaves para reaproveitar a mesma regra de expiracao do get.
    this.keys(options)
      .filter((key) => key.startsWith(prefix))
      .forEach((key) => this.clearExpired(key, options));
  }

  private static normalizeOptions(options?: TManagerStorageOptions): IManagerStorageOptions {
    // Aceita forma curta ('session') para chamadas frequentes em caches temporarios.
    if (typeof options === 'string') {
      return { storage: options };
    }

    return options ?? {};
  }

  private static resolveStorage(options?: TManagerStorageOptions) {
    const normalizedOptions = this.normalizeOptions(options);
    return normalizedOptions.storage === 'session' ? window.sessionStorage : window.localStorage;
  }

  private static resolveExpiresAt(options?: TManagerStorageOptions) {
    const normalizedOptions = this.normalizeOptions(options);

    if (typeof normalizedOptions.expiresAt === 'number') {
      return normalizedOptions.expiresAt;
    }

    if (typeof normalizedOptions.expiresInMs === 'number') {
      return Date.now() + normalizedOptions.expiresInMs;
    }

    return null;
  }

  private static isManagedValue<TValue>(value: TStoredValue<TValue>): value is TManagedStorageValue<TValue> {
    return (
      typeof value === 'object' && value !== null && '__managerStorage' in value && value.__managerStorage === true
    );
  }

  private static isExpired(expiresAt: number | null) {
    return typeof expiresAt === 'number' && Date.now() >= expiresAt;
  }

  private static safeGetItem(storage: Storage, key: string) {
    try {
      return storage.getItem(key);
    } catch {
      return null;
    }
  }

  private static safeSetItem(storage: Storage, key: string, value: string) {
    try {
      storage.setItem(key, value);
    } catch {
      // Quota/privacidade podem falhar; remover a chave evita manter dado parcial ou antigo.
      this.safeRemoveItem(storage, key);
    }
  }

  private static safeRemoveItem(storage: Storage, key: string) {
    try {
      storage.removeItem(key);
    } catch {
      throw new Error('Storage indisponivel ou bloqueado');
    }
  }
}
