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
export class CManagerStorage {
  static get<TValue>(pKey: string, pFallback: TValue, pOptions?: TManagerStorageOptions): TValue {
    const storage = this.resolveStorage(pOptions);
    const value = this.safeGetItem(storage, pKey);

    if (!value) {
      return pFallback;
    }

    try {
      const parsedValue = JSON.parse(value) as TStoredValue<TValue>;

      // Valores antigos, salvos antes do TTL existir, continuam legiveis.
      if (!this.isManagedValue(parsedValue)) {
        return parsedValue;
      }

      // Leitura tambem invalida cache expirado, evitando limpezas globais obrigatorias.
      if (this.isExpired(parsedValue.expiresAt)) {
        this.clear(pKey, pOptions);
        return pFallback;
      }

      return parsedValue.value;
    } catch {
      this.clear(pKey, pOptions);
      return pFallback;
    }
  }

  static set<TValue>(pKey: string, pValue: TValue, pOptions?: TManagerStorageOptions) {
    const storage = this.resolveStorage(pOptions);
    const expiresAt = this.resolveExpiresAt(pOptions);

    // So envelopa o valor quando ha regra de expiracao; caso contrario mantem JSON simples.
    const storageValue: TStoredValue<TValue> =
      expiresAt !== null
        ? {
            __managerStorage: true,
            expiresAt,
            value: pValue,
          }
        : pValue;

    this.safeSetItem(storage, pKey, JSON.stringify(storageValue));
  }

  static clear(pKey: string, pOptions?: TManagerStorageOptions) {
    this.safeRemoveItem(this.resolveStorage(pOptions), pKey);
  }

  static has(pKey: string, pOptions?: TManagerStorageOptions) {
    return this.safeGetItem(this.resolveStorage(pOptions), pKey) !== null;
  }

  static clearExpired(pKey: string, pOptions?: TManagerStorageOptions) {
    this.get(pKey, null, pOptions);
  }

  static keys(pOptions?: TManagerStorageOptions) {
    const storage = this.resolveStorage(pOptions);

    try {
      return Array.from(Array.from({ length: storage.length }).keys(), (pIndex) => storage.key(pIndex)).filter(
        (pKey): pKey is string => typeof pKey === 'string',
      );
    } catch {
      return [];
    }
  }

  static clearByPrefix(pPrefix: string, pOptions?: TManagerStorageOptions) {
    const storage = this.resolveStorage(pOptions);

    this.keys(pOptions)
      .filter((pKey) => pKey.startsWith(pPrefix))
      .forEach((pKey) => this.safeRemoveItem(storage, pKey));
  }

  static clearExpiredByPrefix(pPrefix: string, pOptions?: TManagerStorageOptions) {
    // Forca leitura das chaves para reaproveitar a mesma regra de expiracao do get.
    this.keys(pOptions)
      .filter((pKey) => pKey.startsWith(pPrefix))
      .forEach((pKey) => this.clearExpired(pKey, pOptions));
  }

  private static normalizeOptions(pOptions?: TManagerStorageOptions): IManagerStorageOptions {
    // Aceita forma curta ('session') para chamadas frequentes em caches temporarios.
    if (typeof pOptions === 'string') {
      return { storage: pOptions };
    }

    return pOptions ?? {};
  }

  private static resolveStorage(pOptions?: TManagerStorageOptions) {
    const normalizedOptions = this.normalizeOptions(pOptions);
    return normalizedOptions.storage === 'session' ? window.sessionStorage : window.localStorage;
  }

  private static resolveExpiresAt(pOptions?: TManagerStorageOptions) {
    const normalizedOptions = this.normalizeOptions(pOptions);

    if (typeof normalizedOptions.expiresAt === 'number') {
      return normalizedOptions.expiresAt;
    }

    if (typeof normalizedOptions.expiresInMs === 'number') {
      return Date.now() + normalizedOptions.expiresInMs;
    }

    return null;
  }

  private static isManagedValue<TValue>(pValue: TStoredValue<TValue>): pValue is TManagedStorageValue<TValue> {
    return (
      typeof pValue === 'object' &&
      pValue !== null &&
      '__managerStorage' in pValue &&
      pValue.__managerStorage === true
    );
  }

  private static isExpired(pExpiresAt: number | null) {
    return typeof pExpiresAt === 'number' && Date.now() >= pExpiresAt;
  }

  private static safeGetItem(pStorage: Storage, pKey: string) {
    try {
      return pStorage.getItem(pKey);
    } catch {
      return null;
    }
  }

  private static safeSetItem(pStorage: Storage, pKey: string, pValue: string) {
    try {
      pStorage.setItem(pKey, pValue);
    } catch {
      // Quota/privacidade podem falhar; remover a chave evita manter dado parcial ou antigo.
      this.safeRemoveItem(pStorage, pKey);
    }
  }

  private static safeRemoveItem(pStorage: Storage, pKey: string) {
    try {
      pStorage.removeItem(pKey);
    } catch {
      throw new Error('Storage indisponivel ou bloqueado');
    }
  }
}
