import { ref } from 'vue';
import { defineStore } from 'pinia';

interface ListSnapshot {
  items: any[];
  nextOffset: number;
  scrollPosition: number;
  isFinished: boolean;
}

export const useListaCacheStore = defineStore('listaCache', () => {
  const snapshots = ref<Map<string, ListSnapshot>>(new Map());

  function saveSnapshot(key: string, data: ListSnapshot) {
    snapshots.value.set(key, data);
  }

  function getSnapshot(key: string): ListSnapshot | undefined {
    return snapshots.value.get(key);
  }

  function clearSnapshot(key: string) {
    snapshots.value.delete(key);
  }

  function clearAll() {
    snapshots.value.clear();
  }

  return {
    snapshots,
    saveSnapshot,
    getSnapshot,
    clearSnapshot,
    clearAll,
  };
});
