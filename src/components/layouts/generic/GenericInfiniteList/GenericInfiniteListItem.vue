<template>
  <div
    v-bind="vinculosItem"
    :class="[
      vinculosItem.class,
      'generic-infinite-list-item',
      { 'generic-infinite-list-item--clickable': !!to && !disabled },
    ]"
    :role="to && !disabled ? 'link' : undefined"
    :tabindex="to && !disabled ? 0 : undefined"
    @keydown.enter="clicar"
    @click="clicar"
  >
    <slot
      :item="item"
      :selector="vinculosItem['data-scroll-selector']"
    />
  </div>
</template>

<script setup lang="ts">
// Ecossistema vue
import { computed, inject } from 'vue';

import type { RouteLocationRaw } from 'vue-router';

// Contextos
import { genericInfiniteListKey } from '@/components/layouts/generic/genericInfiniteList.context';

/**
 * @property {boolean} disabled - Desabilita comportamento de link mesmo quando a props 'to' estiver preenchida.
 * @property {number} index - Indice do item na lista; usado como fallback quando itemKey nao estiver disponivel.
 * @property {unknown} item - Registro renderizado pelo slot.
 * @property {string | number} itemKey - Chave estavel do item usada para montar o seletor de retorno.
 * @property {RouteLocationRaw} to - Rota de destino acionada pelo redirect inteligente.
 */
type TProps = {
  disabled?: boolean;
  index?: number;
  item: unknown;
  itemKey?: string | number;
  to?: RouteLocationRaw;
};
const props = defineProps<TProps>();

type TEmits = {
  click: [event: MouseEvent | KeyboardEvent];
};
const emits = defineEmits<TEmits>();

// Injeção de dependências
const injectedContext = inject(genericInfiniteListKey);
if (!injectedContext) {
  throw new Error('GenericInfiniteListItem deve ser usado dentro de GenericInfiniteList.');
}
const context = injectedContext;

// Funções

/**
 * @description Lida com o evento de clique no item.
 * @param {MouseEvent | KeyboardEvent} pEvent - O evento de clique.
 */
async function clicar(pEvent: MouseEvent | KeyboardEvent): Promise<void> {
  emits('click', pEvent);

  if (!props.to || props.disabled) return;

  // O seletor do proprio item é gravado na rota atual antes de sair dela.
  await context.redirecionarPara(props.to, String(vinculosItem.value['data-scroll-selector'] ?? ''));
}

// Computadas
const vinculosItem = computed(() => context.obterVinculosItem(props.item, props.index ?? 0, props.itemKey));
</script>

<style scoped>
.generic-infinite-list-item {
  scroll-margin-block: calc(var(--layout-app-bar-height, 64px) + 16px);
}

.generic-infinite-list-item--clickable {
  cursor: pointer;
}
</style>
