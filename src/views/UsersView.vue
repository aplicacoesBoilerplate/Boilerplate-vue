<script setup lang="ts">
import { useInfiniteList } from '@/composables/useInfiniteList';
import { usersServices } from '@/services/usuariosService';
import { useRoute } from 'vue-router';

const route = useRoute();

const headers = [
  { title: 'ID', key: 'id', width: 80 },
  { title: 'Nome', key: 'nome' },
  { title: 'Email', key: 'email' },
];

const dataFake = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  nome: `Usuário ${i + 1}`,
  email: `usuario${i + 1}@example.com`
}));

const { items, loading, loadMore, tableId } = useInfiniteList(route.fullPath, usersServices.getAllUsers, 20);

function onIntersect(isIntersecting: boolean) {
  if (isIntersecting) loadMore();
}
</script>

<template>
  <v-container fluid class="fill-height align-start">
    <v-card>
      <v-data-table-virtual :id="tableId" :items="dataFake" :headers="headers" height="600">
        <template v-slot:body.append>
          <div v-intersect="onIntersect" class="pa-4 text-center">
            <v-progress-circular v-if="loading" indeterminate size="24" />
          </div>
        </template>
      </v-data-table-virtual>
    </v-card>
  </v-container>
</template>
