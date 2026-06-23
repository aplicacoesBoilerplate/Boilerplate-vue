<template>
  <div
    v-bind="itemBindings"
    :class="[
      itemBindings.class,
      'generic-infinite-list-item',
      { 'generic-infinite-list-item--clickable': !!to && !disabled },
    ]"
    :role="to && !disabled ? 'link' : undefined"
    :tabindex="to && !disabled ? 0 : undefined"
    @keydown.enter="handleClick"
    @click="handleClick"
  >
    <slot
      :item="item"
      :selector="itemBindings['data-scroll-selector']"
    />
  </div>
</template>

<script setup lang="ts">
// Ecossistema vue
import { computed, inject } from "vue";
import type { RouteLocationRaw } from "vue-router";

// Contextos
import { genericInfiniteListKey } from "@/components/layout/generic/genericInfiniteList.context";

// Types
type TProps = {
  /** Desabilita comportamento de link mesmo quando a prop to estiver preenchida. */
  disabled?: boolean;
  /** Indice do item na lista; usado como fallback quando itemKey nao estiver disponivel. */
  index?: number;
  /** Registro renderizado pelo slot. */
  item: unknown;
  /** Chave estavel do item usada para montar o seletor de retorno. */
  itemKey?: string | number;
  /** Rota de destino acionada pelo redirect inteligente. */
  to?: RouteLocationRaw;
};
const props = defineProps<TProps>();

type TEmits = {
  click: [event: MouseEvent | KeyboardEvent];
}
const emit = defineEmits<TEmits>();

// Injeção de dependências
const injectedContext = inject(genericInfiniteListKey);
if (!injectedContext) {
  throw new Error(
    "GenericInfiniteListItem deve ser usado dentro de GenericInfiniteList.",
  );
}

const context = injectedContext;

// Funções
/**
 * Lida com o evento de clique no item.
 * @param event O evento de clique.
 */
async function handleClick(event: MouseEvent | KeyboardEvent) {
  emit("click", event);

  if (!props.to || props.disabled) return;

  // O seletor do proprio item e gravado na rota atual antes de sair dela.
  await context.redirectTo(
    props.to,
    String(itemBindings.value["data-scroll-selector"] ?? ""),
  );
}

// Computadas
const itemBindings = computed(() =>
  context.getItemBindings(props.item, props.index ?? 0, props.itemKey),
);
</script>

<style scoped>
.generic-infinite-list-item {
  scroll-margin-block: calc(var(--layout-app-bar-height, 64px) + 16px);
}
.generic-infinite-list-item--clickable {
  cursor: pointer;
}
</style>
