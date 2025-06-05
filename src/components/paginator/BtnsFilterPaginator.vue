<template>
  <v-menu transition="scale-transition">
    <template v-slot:activator="{ props }">
      <v-btn icon="mdi-filter-menu-outline" size="small" color="primary" title="Filtros" v-bind="props" />
    </template>
    <v-list>
      <v-list-item>
        <v-list-item-title>
          <div class="d-flex flex-row">
            <!-- Filtro para ordenação dos registros -->
            <v-btn icon size="x-small" color="primary" variant="tonal" title="Ordem" @click="aoMudarOrdem()">
              <v-icon>{{ copyPaginadorClass.orderBy == 'ASC' ? "mdi-arrow-down" : "mdi-arrow-up" }}
              </v-icon>
            </v-btn>

            <div v-if="showFilter.exibirApenasHoje">
              <span class="pr-2" />
              <!-- Filtro para considerar apenas os registros do dia -->
              <v-btn icon="mdi-calendar-today-outline" size="x-small" variant="tonal"
                :color="copyPaginadorClass.apenasHoje ? 'success' : 'info'"
                :title="copyPaginadorClass.apenasHoje ? 'Buscar todos os dias' : 'Buscar apenas hoje'"
                @click="alterarFiltroApenasHoje()" />
            </div>

            <div v-if="showFilter.exibirAprovacao">
              <span class="pr-2" />
              <!-- Filtro para apenas aprovados -->
              <v-btn icon="mdi-bookmark-check-outline" size="x-small" variant="tonal"
                :color="copyPaginadorClass.aprovacao ? 'success' : 'info'"
                :title="copyPaginadorClass.aprovacao ? 'Buscar Negados' : 'Buscar aprovados'"
                @click="alterarFiltroAprovacao()" />
            </div>

            <span class="pr-2" />
            <!-- Filtro para limpar todos os filtros -->
            <v-btn icon="mdi-refresh" size="x-small" variant="tonal" color="warning" title="Limpar todos os filtros"
              @click="retornarFiltrosPadroes()" />
          </div>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { PaginatorClass } from '@/components/paginator/ClassPaginator';
import { computed, ref } from 'vue';

const paginadorClass = ref(new PaginatorClass({ limite: 10, offset: 1, totalPaginas: 0, totalRegistros: 0, orderBy: 'DESC', search: '' }))
const copyPaginadorClass = paginadorClass.value

interface Props {
  show: {
    exibirApenasHoje?: boolean | false // Controle de visualização no componente da portaria para exibir ou não o filtro de apenas hoje, o valor padrão é false
    exibirAprovacao?: boolean | false // Controle de visualização no componente de consultar autorizações para exibir ou não o filtro de aprovações, o valor padrão é false
  }
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'alterado-ordem'): void
  (e: 'alterado-apenasHoje'): void
  (e: 'alterado-aprovacao'): void
  (e: 'limpar-filtros'): void
}>()
const showFilter = computed(() => props.show)

function aoMudarOrdem() {
  copyPaginadorClass.orderBy = copyPaginadorClass.orderBy == 'ASC' ? 'DESC' : 'ASC'
  emit('alterado-ordem')
}

function alterarFiltroApenasHoje() {
  copyPaginadorClass.apenasHoje = !copyPaginadorClass.apenasHoje
  emit('alterado-apenasHoje')
}

function alterarFiltroAprovacao() {
  copyPaginadorClass.aprovacao = !copyPaginadorClass.aprovacao
  emit('alterado-aprovacao')
}

function retornarFiltrosPadroes() {
  emit('limpar-filtros')
}

</script>
