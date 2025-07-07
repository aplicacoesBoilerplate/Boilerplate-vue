<template>
  <v-menu transition="scale-transition">
    <template v-slot:activator="{ props }">
      <v-btn icon="mdi-filter-menu-outline" size="small" color="primary" title="Filtros" v-bind="props" />
    </template>
    <v-list>
      <v-list-item>
        <v-list-item-title>
          <div class="d-flex flex-row">
            <div v-if="showFilter.exibirOrdem">
              <!-- Filtro para ordenação dos registros -->
              <v-btn icon size="x-small" color="primary" variant="tonal" title="Ordem" @click="aoMudarOrdem()">
                <v-icon>{{ paginator.orderBy == 'ASC' ? "mdi-arrow-down" : "mdi-arrow-up" }}
                </v-icon>
              </v-btn>
              <span class="pr-2" />
            </div>

            <div v-if="showFilter.exibirApenasHoje">
              <!-- Filtro para considerar apenas os registros do dia -->
              <v-btn icon="mdi-calendar-today-outline" size="x-small" variant="tonal"
                :color="paginator.apenasHoje ? 'success' : 'info'"
                :title="paginator.apenasHoje ? 'Clique para buscar registros de todos os dias' : 'Clique para buscar registros apenas de hoje'"
                @click="alterarFiltroApenasHoje()" />
            </div>

            <div v-if="showFilter.exibirAprovacao">
              <span class="pr-2" />
              <!-- Filtro para apenas aprovados -->
              <v-btn icon="mdi-bookmark-check-outline" size="x-small" variant="tonal"
                :color="paginator.aprovacao ? 'success' : 'info'"
                :title="paginator.aprovacao ? 'Clique para incluir registros negados' : 'Clique para buscar apenas registros aprovados'"
                @click="alterarFiltroAprovacao()" />
            </div>

            <div v-if="showFilter.exibirAlterarInput">
              <span class="pr-2" />
              <!-- Filtro para apenas aprovados -->
              <v-btn icon="mdi-swap-horizontal-bold" size="x-small" variant="tonal"
                :color="paginator.alterarInput ? 'success' : 'info'"
                title="Clique para alterar os campos de busca no filtro" @click="alterarInputBusca()" />
            </div>

            <div v-if="showFilter.exibirSinteticos">
              <span class="pr-2" />
              <!-- Filtro para exibir modelos de relatórios sintéticos -->
              <v-btn icon="mdi-crosshairs-gps" size="x-small" variant="tonal"
                :color="paginator.exibirSintetico ? 'success' : 'red'"
                :title="paginator.exibirSintetico ? 'Clique para ocultar os modelos sintéticos' : 'Clique para listar os modelos sintéticos'"
                @click="alterarExibicaoSinteticos()" />
            </div>

            <div v-if="showFilter.exibirAnaliticos">
              <span class="pr-2" />
              <!-- Filtro para exibir modelos de relatórios sintéticos -->
              <v-btn icon="mdi-chart-box-multiple-outline" size="x-small" variant="tonal"
                :color="paginator.exibirAnaliticos ? 'success' : 'red'"
                :title="paginator.exibirAnaliticos ? 'Clique para ocultar os modelos analíticos' : 'Clique para listar os modelos analíticos'"
                @click="alterarExibicaoAnaliticos()" />
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
import { computed } from 'vue';

interface Props {
  show: {
    exibirOrdem?: boolean | true // Controle de visualização no componente para exibir ou não o filtro de ordenação, o valor padrão é true
    exibirApenasHoje?: boolean | false // Controle de visualização no componente da portaria para exibir ou não o filtro de apenas hoje, o valor padrão é false
    exibirAprovacao?: boolean | false // Controle de visualização no componente de consultar autorizações para exibir ou não o filtro de aprovações, o valor padrão é false
    exibirAlterarInput?: boolean | false // Controla a exibição do botão que emite o evento para trocar o campo de input
    exibirSinteticos?: boolean | false // Controla a exibição do botão que emite o filtro para apresentar os relatórios no modelo sintético
    exibirAnaliticos?: boolean | false // Controla a exibição do botão que emite o filtro para apresentar os relatórios no modelo analítico
  }
}

const props = defineProps<Props>()
const paginator = defineModel<PaginatorClass>('paginator', {
  required: true
})
const emit = defineEmits<{
  (e: 'alterado-ordem'): void
  (e: 'alterado-apenasHoje'): void
  (e: 'alterado-aprovacao'): void
  (e: 'alterar-input'): void
  (e: 'alterado-sinteticos'): void
  (e: 'alterado-analiticos'): void
  (e: 'limpar-filtros'): void
}>()
const showFilter = computed(() => props.show)

function aoMudarOrdem() {
  emit('alterado-ordem')
}

function alterarFiltroApenasHoje() {
  emit('alterado-apenasHoje')
}

function alterarFiltroAprovacao() {
  emit('alterado-aprovacao')
}

function alterarInputBusca() {
  emit('alterar-input')
}

function alterarExibicaoSinteticos() {
  emit('alterado-sinteticos')
}

function alterarExibicaoAnaliticos() {
  emit('alterado-analiticos')
}

function retornarFiltrosPadroes() {
  emit('limpar-filtros')
}

</script>
