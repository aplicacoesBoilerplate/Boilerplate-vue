import { ref, onMounted, nextTick } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { useListaCacheStore } from '@/stores/listaCache.store';

export function useInfiniteList<T>(key: string, fetchData: Function, limit = 20) {
  const store = useListaCacheStore();
  const items = ref<T[]>([]);
  const offset = ref(0);
  const loading = ref(false);
  const isFinished = ref(false);

  const tableId = `virtual-table-${key.replace(/\W/g, '')}`;

  const loadMore = async () => {
    if (loading.value || isFinished.value) return;

    loading.value = true;
    try {
      const newItems = await fetchData(offset.value, limit);
      if (newItems.length < limit) isFinished.value = true;

      items.value.push(...newItems);
      offset.value += limit;
    } finally {
      loading.value = false;
    }
  };

  const initialize = async () => {
    const cached = store.getSnapshot(key);
    if (cached) {
      items.value = cached.items;
      offset.value = cached.nextOffset;
      isFinished.value = cached.isFinished;

      await nextTick();
      const wrapper = document.querySelector(`#${tableId} .v-table__wrapper`);
      if (wrapper) {
        wrapper.scrollTop = cached.scrollPosition;
      }
    } else {
      await loadMore();
    }
  };

  onBeforeRouteLeave(() => {
    const wrapper = document.querySelector(`#${tableId} .v-table__wrapper`);
    store.saveSnapshot(key, {
      items: items.value,
      nextOffset: offset.value,
      isFinished: isFinished.value,
      scrollPosition: wrapper ? wrapper.scrollTop : 0
    });
  });

  onMounted(initialize);

  return { items, loading, isFinished, loadMore, tableId };
}
