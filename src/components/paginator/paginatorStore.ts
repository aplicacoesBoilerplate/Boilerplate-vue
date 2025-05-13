import { ref, computed } from 'vue'
import { type FiltroPaginacao } from '@/models/FiltersModels'
import type { HeaderPaginatorModel } from '@/models/HeaderPaginatorModel'

const filtrosPaginator = ref<FiltroPaginacao>({
  limite: 25,
  offset: 1,
  orderBy: 'ASC',
})

const totalPaginas = ref(1)
const totalRegistros = ref(0)

const paginaAtual = computed(() => {
  return Math.floor((filtrosPaginator.value.offset - 1) / filtrosPaginator.value.limite) + 1
})

function setNewLimite(newLimite: number) {
  filtrosPaginator.value.limite = newLimite
}

function setPaginaAtual(pagina: number) {
  filtrosPaginator.value.offset = (pagina - 1) * filtrosPaginator.value.limite + 1
}

function setTotalPaginas(total: number) {
  totalPaginas.value = total
}

function setTotalRegistros(total: number) {
  totalRegistros.value = total
}

function carregarFiltrosDaAPI(headerPaginator: HeaderPaginatorModel<any>) {
  filtrosPaginator.value.limite = headerPaginator.limite
  filtrosPaginator.value.offset = headerPaginator.paginaAtual
  filtrosPaginator.value.totalPaginas = headerPaginator.totalPaginas
  filtrosPaginator.value.totalRegistros = headerPaginator.totalRegistros
}

export function usePaginator() {
  return {
    filtrosPaginator,
    paginaAtual,
    totalPaginas,
    totalRegistros,
    setNewLimite,
    setPaginaAtual,
    setTotalPaginas,
    setTotalRegistros,
    carregarFiltrosDaAPI,
  }
}
