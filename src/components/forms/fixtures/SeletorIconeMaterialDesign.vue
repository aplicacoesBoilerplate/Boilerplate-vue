<template>
  <v-combobox
    v-model="sufixoIcone"
    :counter="counter"
    :density="density"
    :hideDetails="hideDetails"
    :hint="hint"
    :items="ICONES_MATERIAL_DESIGN"
    :label="label"
    :prependInnerIcon="iconeNormalizadoAtual"
    :returnObject="false"
    :rules="rules"
    :variant="variant"
    itemTitle="sufixo"
    itemValue="valor"
    prefix="mdi-"
    autocomplete="off"
    spellcheck="false"
    clearable
  >
    <template #append>
      <v-tooltip
        text="Visitar a página com todos os ícones aceitos"
        location="bottom"
      >
        <template #activator="{ props }">
          <v-icon
            v-bind="props"
            icon="mdi-search-web"
            @click.stop="consultarPaginaIcones"
          />
        </template>
      </v-tooltip>
    </template>

    <template #item="{ props: itemProps, item }">
      <v-list-item
        v-bind="itemProps"
        :subtitle="item.raw.sufixo"
        :title="item.raw.titulo"
      >
        <template #prepend>
          <v-icon
            :icon="item.raw.valor"
            size="small"
          />
        </template>
      </v-list-item>
    </template>
  </v-combobox>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed } from 'vue';
import type { ValidationRule } from 'vuetify';

/**
 * @property {number} counter - Quantidade máxima de caracteres exibida no contador.
 * @property {'default' | 'comfortable' | 'compact'} density - Densidade visual aplicada ao combobox.
 * @property {boolean | 'auto'} hideDetails - Controla a exibição de detalhes do campo.
 * @property {string} hint - Texto auxiliar exibido abaixo do campo.
 * @property {string} label - Rótulo exibido no campo.
 * @property {readonly TRegraValidacao[]} rules - Regras de validação aplicadas pelo formulário.
 * @property {'underlined' | 'outlined' | 'filled' | 'solo' | 'solo-inverted' | 'solo-filled' | 'plain'} variant - Variante visual do Vuetify.
 */
type TProps = {
  counter?: number;
  density?: 'default' | 'comfortable' | 'compact';
  hideDetails?: boolean | 'auto';
  hint?: string;
  label?: string;
  rules?: readonly ValidationRule[];
  variant?: 'underlined' | 'outlined' | 'filled' | 'solo' | 'solo-inverted' | 'solo-filled' | 'plain';
};

/**
 * @property {string} sufixo - Nome sem prefixo, usado como valor visível no campo.
 * @property {string} titulo - Nome amigável exibido na lista visual.
 * @property {string} valor - Valor completo usado pelo v-icon.
 */
type TItemIconeMaterialDesign = {
  sufixo: string;
  titulo: string;
  valor: string;
};

const props = withDefaults(defineProps<TProps>(), {
  counter: 60,
  density: 'compact',
  hideDetails: false,
  hint: 'Selecione ou pesquise um ícone.',
  label: 'Ícone',
  rules: () => [],
  variant: 'outlined',
});

// Reativas - Model
const icone = defineModel<string>({ default: '' });

// Constantes
const ICONE_PADRAO = 'mdi-shield-account-outline';
const ICONES_MATERIAL_DESIGN: TItemIconeMaterialDesign[] = [
  criarItemIcone('shield-account-outline', 'Escudo de conta'),
  criarItemIcone('shield-key-outline', 'Escudo com chave'),
  criarItemIcone('shield-crown-outline', 'Escudo administrativo'),
  criarItemIcone('account', 'Conta'),
  criarItemIcone('account-tie', 'Conta executiva'),
  criarItemIcone('account-key-outline', 'Conta com chave'),
  criarItemIcone('account-cog-outline', 'Conta com configurações'),
  criarItemIcone('account-group-outline', 'Grupo de contas'),
  criarItemIcone('account-supervisor-outline', 'Supervisor'),
  criarItemIcone('badge-account-outline', 'Crachá de conta'),
  criarItemIcone('card-account-details-outline', 'Detalhes de conta'),
  criarItemIcone('briefcase-account-outline', 'Conta profissional'),
  criarItemIcone('lock-outline', 'Bloqueio'),
  criarItemIcone('lock-open-outline', 'Bloqueio aberto'),
  criarItemIcone('key-outline', 'Chave'),
  criarItemIcone('cog-outline', 'Configuração'),
  criarItemIcone('view-dashboard-outline', 'Painel'),
  criarItemIcone('database-outline', 'Banco de dados'),
  criarItemIcone('chart-box-outline', 'Gráfico'),
  criarItemIcone('file-document-outline', 'Documento'),
  criarItemIcone('package-variant-closed', 'Pacote'),
  criarItemIcone('cart-outline', 'Carrinho'),
  criarItemIcone('cash-multiple', 'Financeiro'),
  criarItemIcone('email-outline', 'E-mail'),
  criarItemIcone('phone-outline', 'Telefone'),
];

// Funções
function consultarPaginaIcones() {
  window.open('https://pictogrammers.com/library/mdi/', '_blank');
}

function criarItemIcone(pSufixo: string, pTitulo: string): TItemIconeMaterialDesign {
  return {
    sufixo: pSufixo,
    titulo: pTitulo,
    valor: normalizarIcone(pSufixo),
  };
}

function normalizarIcone(pValor: unknown): string {
  const sufixo = obterSufixoIcone(pValor);
  return sufixo ? `mdi-${sufixo}` : '';
}

function obterSufixoIcone(pValor: unknown): string {
  return String(obterValorIcone(pValor) ?? '')
    .trim()
    .replace(/^mdi[\s:-]*/i, '')
    .replace(/^mdi-/i, '')
    .replace(/\s+/g, '-')
    .replace(/^-+/, '')
    .toLowerCase();
}

function obterValorIcone(pValor: unknown): unknown {
  if (typeof pValor !== 'object' || pValor === null) {
    return pValor;
  }

  const itemIcone = pValor as Partial<TItemIconeMaterialDesign>;

  return itemIcone.sufixo ?? itemIcone.valor ?? '';
}

// Computadas
const sufixoIcone = computed<string | null>({
  get: () => obterSufixoIcone(icone.value),
  set: (pValor) => {
    icone.value = normalizarIcone(pValor);
  },
});

const iconeNormalizadoAtual = computed(() => normalizarIcone(sufixoIcone.value) || ICONE_PADRAO);
</script>
