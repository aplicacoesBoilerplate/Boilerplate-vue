<template>
  <v-container fluid class="fill-height align-start">
    <data-table
      title="Relatório de Usuários"
      density="compact"
      :headers="headers"
      :items="data"
      :loading="loading"
      :height="'auto'"
      @item-selecionado="handleSelection"
    />
  </v-container>
</template>

<script setup lang="ts">
import type { IHeadersDataTable } from '@/classes/models/modelComponents/ModelHeaderTable';
import DataTable from '@/components/DataTable.vue';
import { useInfiniteList } from '@/composables/useInfiniteList';
import { usersServices } from '@/services/usuariosService';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const headers: IHeadersDataTable[] = [
  { title: 'Barco', align: 'start', key: 'name', width: 200 },
  { title: 'Velocidade (knots)', align: 'end', key: 'speed' },
  { title: 'Tamanho (m)', align: 'end', key: 'length' },
  {
    title: 'Preço ($)',
    align: 'end',
    key: 'price',
    value: (item: any) => formatPrice(item.price)
  },
  { title: 'Ano', align: 'center', key: 'year' },
]

function formatPrice (value: number) {
  return `$${value.toFixed(0).replace(/\d(?=(\d{3})+$)/g, '$&,')}`
}

const data = ref([
  { id: 1, name: 'Speedster', speed: 35, length: 22, price: 300000, year: 2021 },
  { id: 2, name: 'Ocean King', speed: 25, length: 35, price: 4500000, year: 2023 },
])

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 10000);
});

function handleSelection(item: any[]) {
  console.log('Selecionado:', item);
}

const { loading } = useInfiniteList(route.fullPath, usersServices.getAllUsers, 20);

// function onIntersect(isIntersecting: boolean) {
//   if (isIntersecting) loadMore();
// }
</script>
