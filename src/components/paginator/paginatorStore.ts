import { ref, computed, watch } from 'vue'
import { type FiltroPaginacao } from '@/models/FiltersModels'
import type { HeaderPaginatorModel } from '@/models/HeaderPaginatorModel'

const filtrosPaginator = ref<FiltroPaginacao>({
  limite: 25,
  offset: 1,
  orderBy: 'ASC',
})

// Controlado separadamente, esses campos são respostas da API
const totalPaginas = ref(1)
const totalRegistros = ref(1)

function setNewLimite(newLimite: number) {
  filtrosPaginator.value.limite = newLimite
}

// A variável para a página será o offset
function setPaginaAtual(pagina: number) {
  filtrosPaginator.value.offset = pagina
}

function setTotalPaginas(total: number) {
  totalPaginas.value = total
}

function setTotalRegistros(total: number) {
  totalRegistros.value = total
}

function toggleOrderBy() {
  const newOrder = filtrosPaginator.value.orderBy == 'ASC' ? 'DESC' : 'ASC'
  filtrosPaginator.value.orderBy = newOrder
}

// Utilidade para onMounted e o paginator atualizar os filtros
function carregarFiltrosDaAPI(headerPaginator: HeaderPaginatorModel<any>) {
  filtrosPaginator.value.limite = headerPaginator.limite
  filtrosPaginator.value.offset = headerPaginator.offset
  totalPaginas.value = headerPaginator.totalPaginas
  totalRegistros.value = headerPaginator.totalRegistros
}

export function usePaginator() {
  return {
    filtrosPaginator,
    totalPaginas,
    totalRegistros,
    setNewLimite,
    setPaginaAtual,
    setTotalPaginas,
    setTotalRegistros,
    toggleOrderBy,
    carregarFiltrosDaAPI,
  }
}
