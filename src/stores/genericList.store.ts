// Ecossistema vue
import { computed, ref, toRaw } from 'vue';
import { defineStore } from 'pinia';

// Models
import type { IGenericListContext, IGenericListContextOptions } from '@/models/components/IGenericListContext';
import type { TOrdem } from '@/models/consulta/IConsultaRegistros';
import type { TManagerStorageLocation } from '@/utils/ManagerStorage';

// Utils
import { ClassManagerStorage } from '@/utils/ManagerStorage';

// Constantes
const STORAGE_PREFIX = 'boilerplate.generic-list.context.';
const DEFAULT_CACHE_TTL_MS = 15 * 60 * 1000;
const DEFAULT_STORAGE: TManagerStorageLocation = 'session';
const DEFAULT_LIMIT = 10;
const DEFAULT_ORDER: TOrdem = 'desc';

type TResolvedContextOptions = Required<
  Pick<IGenericListContextOptions, 'cacheTtlMs' | 'storage' | 'limite' | 'ordem'>
>;

/**
 * @description Função para criar um contexto vazio.
 * @param pContextId O ID do contexto.
 * @param pLimit O número máximo de itens a serem recuperados por página.
 * @param pOrder A ordem em que os itens devem ser recuperados.
 * @returns Um contexto vazio.
 */
function createEmptyContext<TItem extends object = object>(
  pContextId: string,
  pLimit = DEFAULT_LIMIT,
  pOrder: TOrdem = DEFAULT_ORDER,
): IGenericListContext<TItem> {
  return {
    contexto: pContextId,
    filtros: [],
    registros: [],
    proximaEntrada: null,
    possuiMais: true,
    limite: pLimit,
    ordenacao: pOrder,
    atualizadoEm: Date.now(),
  };
}

/**
 * @description Função para obter a chave de armazenamento.
 * @param pContextId O ID do contexto.
 * @returns A chave de armazenamento.
 */
function getStorageKey(pContextId: string) {
  // Cada contexto fica em uma chave própria para permitir invalidação pontual por lista.
  return `${STORAGE_PREFIX}${pContextId}`;
}

/**
 * @description Função para resolver as opções do contexto.
 * @param pOptions As opções do contexto.
 * @returns As opções resolvidas.
 */
function resolveOptions(pOptions?: IGenericListContextOptions): TResolvedContextOptions {
  return {
    cacheTtlMs: pOptions?.cacheTtlMs ?? DEFAULT_CACHE_TTL_MS,
    storage: pOptions?.storage ?? DEFAULT_STORAGE,
    limite: pOptions?.limite ?? DEFAULT_LIMIT,
    ordem: pOptions?.ordem ?? DEFAULT_ORDER,
  };
}

export const useGenericListStore = defineStore('genericList', () => {
  // Reativas
  const contexts = ref<Record<string, IGenericListContext>>({});
  const currentContextId = ref('');
  // As opções ficam em memória porque elas fazem parte do contrato de cada uso do componente.
  const contextOptions = new Map<string, TResolvedContextOptions>();

  /**
   * @description Inicializa um novo contexto de lista.
   * @param pContextId O ID do contexto.
   * @param pOptions As opções do contexto.
   */
  function initContext<TItem extends object = object>(pContextId: string, pOptions?: IGenericListContextOptions) {
    const resolvedOptions = resolveOptions(pOptions);
    const storageKey = getStorageKey(pContextId);

    contextOptions.set(pContextId, resolvedOptions);
    currentContextId.value = pContextId;

    const storedContext = ClassManagerStorage.get<IGenericListContext<TItem> | null>(
      storageKey,
      null,
      resolvedOptions.storage,
    );

    // ManagerStorage ja remove valores expirados; se voltar null, a lista comeca limpa.
    // O storage não preserva o generic do registro; a recuperação tipada ocorre em getContext().
    contexts.value[pContextId] = (storedContext ??
      createEmptyContext<TItem>(pContextId, resolvedOptions.limite, resolvedOptions.ordem)) as unknown as IGenericListContext;

    if (!storedContext) {
      persistContext(pContextId);
    }
  }

  /**
   * @description Recupera um contexto de lista pelo ID.
   * @param pContextId O ID do contexto.
   * @returns O contexto de lista.
   */
  function getContext<TItem extends object = object>(pContextId: string): IGenericListContext<TItem> {
    if (!contexts.value[pContextId]) {
      // Acesso defensivo para stores/componentes que consultem antes do onMounted da lista.
      initContext<TItem>(pContextId);
    }

    return contexts.value[pContextId] as unknown as IGenericListContext<TItem>;
  }

  /**
   * @description Recupera os itens de um contexto de lista.
   * @param pContextId O ID do contexto.
   * @returns Os itens do contexto.
   */
  function getItems<TItem extends object = object>(pContextId: string): TItem[] {
    return getContext<TItem>(pContextId).registros;
  }

  /**
   * @description Recupera o próximo item de um contexto de lista.
   * @param pContextId O ID do contexto.
   * @returns O próximo item do contexto.
   */
  function getNextEntry(pContextId: string) {
    return getContext(pContextId).proximaEntrada;
  }

  /**
   * @description Recupera se ha mais itens de um contexto de lista.
   * @param pContextId O ID do contexto.
   * @returns Se ha mais itens no contexto.
   */
  function getHasMore(pContextId: string) {
    return getContext(pContextId).possuiMais;
  }

  /**
   * @description Recupera o limite de itens de um contexto de lista.
   * @param pContextId O ID do contexto.
   * @returns O limite de itens do contexto.
   */
  function getLimit(pContextId: string) {
    return getContext(pContextId).limite;
  }

  /**
   * @description Recupera a ordem de itens de um contexto de lista.
   * @param pContextId O ID do contexto.
   * @returns A ordem de itens do contexto.
   */
  function getOrder(pContextId: string) {
    return getContext(pContextId).ordenacao;
  }

  /**
   * @description Define o limite de itens de um contexto de lista.
   * @param pContextId O ID do contexto.
   * @param pLimit O limite de itens.
   */
  function setLimit(pContextId: string, pLimit: number) {
    // O limite tambem e persistido para manter a lista coerente ao voltar para a rota.
    const options = getOptions(pContextId);

    contextOptions.set(pContextId, {
      ...options,
      limite: pLimit,
    });

    getContext(pContextId).limite = pLimit;
    persistContext(pContextId);
  }

  /**
   * @description Define a ordem de itens de um contexto de lista.
   * @param pContextId O ID do contexto.
   * @param pOrder A ordem de itens.
   */
  function setOrder(pContextId: string, pOrder: TOrdem) {
    // A ordenacao tambem e persistida.
    const options = getOptions(pContextId);

    contextOptions.set(pContextId, {
      ...options,
      ordem: pOrder,
    });

    getContext(pContextId).ordenacao = pOrder;
    persistContext(pContextId);
  }

  /**
   * @description Adiciona itens a um contexto de lista.
   * @param pContextId O ID do contexto.
   * @param pNewItems Os novos itens.
   * @param pNextEntry O próximo item.
   * @param pHasMore Se ha mais itens.
   */
  function addItems<TItem extends object = object>(pContextId: string, pNewItems: TItem[], pNextEntry: unknown, pHasMore: boolean) {
    const context = getContext<TItem>(pContextId);

    // Acumula paginas ja consultadas para que o retorno de rota nao dependa de nova chamada.
    context.registros.push(...pNewItems);
    context.proximaEntrada = pNextEntry;
    context.possuiMais = pHasMore;
    context.atualizadoEm = Date.now();

    persistContext(pContextId);
  }

  /**
   * @description Substitui os itens de um contexto de lista.
   * @param pContextId O ID do contexto.
   * @param pItems Os itens.
   * @param pNextEntry O próximo item.
   * @param pHasMore Se ha mais itens.
   */
  function replaceItems<TItem extends object = object>(pContextId: string, pItems: TItem[], pNextEntry: unknown, pHasMore: boolean) {
    const context = getContext<TItem>(pContextId);

    context.registros = pItems;
    context.proximaEntrada = pNextEntry;
    context.possuiMais = pHasMore;
    context.atualizadoEm = Date.now();

    persistContext(pContextId);
  }

  /**
   * @description Reseta um contexto de lista.
   * @param pContextId O ID do contexto.
   */
  function resetContext(pContextId: string) {
    const options = getOptions(pContextId);

    // Mantem limite/opcoes atuais, mas descarta cursor e itens armazenados.
    contexts.value[pContextId] = createEmptyContext(pContextId, options.limite, options.ordem);
    persistContext(pContextId);
  }

  /**
   * @description Remove um contexto de lista.
   * @param pContextId O ID do contexto.
   */
  function removeContext(pContextId: string) {
    delete contexts.value[pContextId];
    ClassManagerStorage.clear(getStorageKey(pContextId), getOptions(pContextId).storage);
  }

  /**
   * @description Limpa os contextos expirados.
   */
  function clearExpiredContexts() {
    // Limpeza util para ser chamada na inicializacao de areas que usam muitas listas.
    ClassManagerStorage.clearExpiredByPrefix(STORAGE_PREFIX, DEFAULT_STORAGE);
  }

  /**
   * @description Limpa todos os contextos.
   */
  function clearAllContexts() {
    contexts.value = {};
    ClassManagerStorage.clearByPrefix(STORAGE_PREFIX, DEFAULT_STORAGE);
  }

  /**
   * @description Adiciona um item no inicio de um contexto de lista.
   * @param pContextId O ID do contexto.
   * @param pItem O item a ser adicionado.
   */
  function prependItem<TItem extends object = object>(pContextId: string, pItem: TItem) {
    const context = getContext<TItem>(pContextId);
    context.registros = [pItem, ...context.registros];
    context.atualizadoEm = Date.now();
    persistContext(pContextId);
  }

  /**
   * @description Adiciona um item no fim de um contexto de lista.
   * @param pContextId O ID do contexto.
   * @param pItem O item a ser adicionado.
   */
  function appendItem<TItem extends object = object>(pContextId: string, pItem: TItem) {
    const context = getContext<TItem>(pContextId);
    context.registros = [...context.registros, pItem];
    context.atualizadoEm = Date.now();
    persistContext(pContextId);
  }

  /**
   * @description Remove um item de um contexto de lista.
   * @param pContextId O ID do contexto.
   * @param pIdField O campo de identificacao.
   * @param pIdValue O valor de identificacao.
   */
  function removeItem<TItem extends object>(pContextId: string, pIdField: keyof TItem, pIdValue: TItem[keyof TItem]) {
    const context = getContext<TItem>(pContextId);

    context.registros = context.registros.filter((pItem) => pItem[pIdField] !== pIdValue);
    context.atualizadoEm = Date.now();
    persistContext(pContextId);
  }

  /**
   * @description Atualiza um item em um contexto de lista.
   * @param pContextId O ID do contexto.
   * @param pIdField O campo de identificacao.
   * @param pIdValue O valor de identificacao.
   * @param pNewValues Os novos valores.
   */
  function updateItem<TItem extends object>(
    pContextId: string,
    pIdField: keyof TItem,
    pIdValue: TItem[keyof TItem],
    pNewValues: Partial<TItem>,
  ) {
    const context = getContext<TItem>(pContextId);
    const item = context.registros.find((pCurrentItem) => pCurrentItem[pIdField] === pIdValue);

    if (!item) return;

    Object.assign(item, pNewValues);
    context.atualizadoEm = Date.now();
    persistContext(pContextId);
  }

  /**
   * @description Obtem as opcoes de um contexto.
   * @param pContextId O ID do contexto.
   * @returns As opcoes do contexto.
   */
  function getOptions(pContextId: string): TResolvedContextOptions {
    const currentOptions = contextOptions.get(pContextId);

    if (currentOptions) {
      return currentOptions;
    }

    // Fallback para operacoes diretas na store sem initContext previo.
    const resolvedOptions = resolveOptions();
    contextOptions.set(pContextId, resolvedOptions);
    return resolvedOptions;
  }

  /**
   * @description Persiste um contexto de lista.
   * @param pContextId O ID do contexto.
   */
  function persistContext(pContextId: string) {
    const context = contexts.value[pContextId];
    if (!context) return;

    const options = getOptions(pContextId);

    // O TTL renova a cada alteracao relevante do contexto para manter cache por atividade.
    ClassManagerStorage.set(getStorageKey(pContextId), toRaw(context), {
      storage: options.storage,
      expiresInMs: options.cacheTtlMs,
    });
  }

  // Computadas
  const currentContext = computed(() => contexts.value[currentContextId.value] ?? null);

  return {
    contexts,
    currentContextId,
    currentContext,
    initContext,
    getContext,
    getItems,
    getNextEntry,
    getHasMore,
    getLimit,
    getOrder,
    setLimit,
    setOrder,
    addItems,
    replaceItems,
    resetContext,
    removeContext,
    clearExpiredContexts,
    clearAllContexts,
    prependItem,
    appendItem,
    removeItem,
    updateItem,
  };
});
