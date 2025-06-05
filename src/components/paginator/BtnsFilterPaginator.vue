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
              <v-icon>{{ paginadorClass.orderBy == 'ASC' ? "mdi-arrow-down" : "mdi-arrow-up" }}
              </v-icon>
            </v-btn>

            <div v-if="showFilter.exibirApenasHoje">
              <span class="pr-2" />

              <!-- Filtro para considerar apenas os registros do dia -->
              <v-btn icon="mdi-calendar-today-outline" size="x-small" variant="tonal"
                :color="paginadorClass.apenasHoje ? 'success' : 'info'" title="Apenas hoje"
                @click="alterarFiltroApenasHoje()" />
            </div>

            <div v-if="showFilter.exibirAprovacao">
              <span class="pr-2" />
              <!-- Filtro para apenas aprovados -->
              <v-btn icon="mdi-bookmark-check-outline" size="x-small" variant="tonal"
                :color="paginadorClass.aprovacao ? 'success' : 'info'" title="Aprovados"
                @click="alterarFiltroAprovacao()" />
            </div>

            <div v-if="showFilter.exibirToggle">
              <span class="pr-2" />
              <!-- Em campos onde a consulta pode ser enviada para mais de um campo, alterar o campo de busca -->
              <v-btn icon="mdi-swap-horizontal" size="x-small" variant="tonal" color="primary"
                title="Alterar campo de consulta" @click="alterarToggleInput()" />
            </div>
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

interface Props {
  show: {
    exibirApenasHoje?: boolean | false // Controle de visualização no componente da portaria para exibir ou não o filtro de apenas hoje, o valor padrão é false
    exibirAprovacao?: boolean | false // Controle de visualização no componente de consultar autorizações para exibir ou não o filtro de aprovações, o valor padrão é false
    exibirToggle?: boolean | false // Em casos onde podem ser enviados um search para diferentes parâmetros, alteramos o campo de input
  }
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'alterado-ordem'): void
  (e: 'alterado-apenasHoje'): void
  (e: 'alterado-aprovacao'): void
  (e: 'alterado-toggle-input'): void
}>()
const showFilter = computed(() => props.show)

function aoMudarOrdem() {
  paginadorClass.value.alterarOrdenacao()
  emit('alterado-ordem')
}

function alterarFiltroApenasHoje() {
  paginadorClass.value.alterarFiltroApenasHoje()
  emit('alterado-apenasHoje')
}

function alterarFiltroAprovacao() {
  paginadorClass.value.alterarFiltroAprovacao()
  emit('alterado-aprovacao')
}

function alterarToggleInput() {
  emit('alterado-toggle-input')
}

</script>
