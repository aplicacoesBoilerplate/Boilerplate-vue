const SESSION_EVENT_KEY = 'boilerplate.session.lifecycle';
const SESSION_CHANNEL_NAME = 'boilerplate.session';
const SESSION_TERMINATED = 'session-terminated';

const PRIVATE_STORAGE_KEYS = ['token', 'boilerplate.recuperacao-senha.estado'];
const PRIVATE_STORAGE_PREFIXES = [
  'boilerplate.generic-list.context.',
  'boilerplate.generic-filter.context.',
];

type TSessionLifecycleMessage = {
  type: typeof SESSION_TERMINATED;
  id: string;
  timestamp: number;
};

function isTerminationMessage(pValue: unknown): pValue is TSessionLifecycleMessage {
  return (
    typeof pValue === 'object' &&
    pValue !== null &&
    'type' in pValue &&
    pValue.type === SESSION_TERMINATED
  );
}

function removeByPrefix(pStorage: Storage, pPrefix: string): void {
  const keys = Array.from({ length: pStorage.length }, (pUnused, pIndex) => {
    void pUnused;
    return pStorage.key(pIndex);
  }).filter(
    (pKey): pKey is string => typeof pKey === 'string',
  );
  keys.filter((pKey) => pKey.startsWith(pPrefix)).forEach((pKey) => pStorage.removeItem(pKey));
}

export function clearPrivateBrowserState(): void {
  for (const storage of [window.sessionStorage, window.localStorage]) {
    PRIVATE_STORAGE_KEYS.forEach((pKey) => storage.removeItem(pKey));
    PRIVATE_STORAGE_PREFIXES.forEach((prefix) => removeByPrefix(storage, prefix));
  }
}

export function broadcastSessionTermination(): void {
  const message: TSessionLifecycleMessage = {
    type: SESSION_TERMINATED,
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
    timestamp: Date.now(),
  };

  try {
    const channel = new BroadcastChannel(SESSION_CHANNEL_NAME);
    channel.postMessage(message);
    channel.close();
    return;
  } catch {
    localStorage.setItem(SESSION_EVENT_KEY, JSON.stringify(message));
    localStorage.removeItem(SESSION_EVENT_KEY);
  }
}

export function subscribeToSessionTermination(pCallback: () => void): () => void {
  let channel: BroadcastChannel | null = null;

  try {
    channel = new BroadcastChannel(SESSION_CHANNEL_NAME);
    channel.addEventListener('message', (pEvent: MessageEvent<unknown>) => {
      if (isTerminationMessage(pEvent.data)) pCallback();
    });
  } catch {
    channel = null;
  }

  const handleStorage = (pEvent: StorageEvent) => {
    if (pEvent.key !== SESSION_EVENT_KEY || !pEvent.newValue) return;

    try {
      if (isTerminationMessage(JSON.parse(pEvent.newValue))) pCallback();
    } catch {
      // Eventos corrompidos ou de outra aplicacao sao ignorados.
    }
  };
  window.addEventListener('storage', handleStorage);

  return () => {
    channel?.close();
    window.removeEventListener('storage', handleStorage);
  };
}
