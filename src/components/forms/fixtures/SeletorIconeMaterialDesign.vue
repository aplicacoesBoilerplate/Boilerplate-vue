<template>
  <v-combobox
    v-model="valorCombobox"
    :counter="counter"
    :density="density"
    :hideDetails="hideDetails"
    :hint="hintPadrao"
    :items="iconesMaterialDesign"
    :label="labelPadrao"
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
        :text="t('forms.seletorIconeMaterialDesign.tooltipPaginaIcones')"
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
import { useI18n } from 'vue-i18n';
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

type TValorSeletorIcone = string | TItemIconeMaterialDesign | null;

const props = withDefaults(defineProps<TProps>(), {
  counter: 60,
  density: 'compact',
  hideDetails: false,
  hint: undefined,
  label: undefined,
  rules: () => [],
  variant: 'outlined',
});

// Composables
const { t } = useI18n();

// Reativas - Model
const icone = defineModel<string>({ default: '' });

// Constantes
const ICONE_PADRAO = 'mdi-shield-account-outline';

// Funções
/**
 * Abre a documentação oficial de ícones MDI em uma nova aba.
 */
function consultarPaginaIcones(): void {
  window.open('https://pictogrammers.com/library/mdi/', '_blank');
}

/**
 * Monta a estrutura visual consumida pelo combobox a partir do sufixo do ícone.
 */
function criarItemIcone(pSufixo: string, pTitulo: string): TItemIconeMaterialDesign {
  return {
    sufixo: pSufixo,
    titulo: pTitulo,
    valor: normalizarIcone(pSufixo),
  };
}

/**
 * Garante que qualquer valor digitado ou selecionado seja salvo no formato aceito pelo v-icon.
 */
function normalizarIcone(pValor: unknown): string {
  const sufixo = obterSufixoIcone(pValor);
  return sufixo ? `mdi-${sufixo}` : '';
}

/**
 * Remove prefixos e caracteres incompatíveis para manter somente o nome do ícone.
 */
function obterSufixoIcone(pValor: unknown): string {
  return String(obterValorIcone(pValor) ?? '')
    .trim()
    .replace(/^mdi[\s:-]*/i, '')
    .replace(/^mdi-/i, '')
    .replace(/\s+/g, '-')
    .replace(/^-+/, '')
    .toLowerCase();
}

/**
 * Extrai o valor útil quando o Vuetify retorna um item completo em vez de texto puro.
 */
function obterValorIcone(pValor: unknown): unknown {
  if (typeof pValor !== 'object' || pValor === null) {
    return pValor;
  }

  const itemIcone = pValor as Partial<TItemIconeMaterialDesign>;

  return itemIcone.sufixo ?? itemIcone.valor ?? '';
}

// Computadas
const valorCombobox = computed<TValorSeletorIcone>({
  get: () => obterSufixoIcone(icone.value),
  set: (pValor) => {
    icone.value = normalizarIcone(pValor);
  },
});

const hintPadrao = computed(() => props.hint ?? t('forms.seletorIconeMaterialDesign.hint'));

const labelPadrao = computed(() => props.label ?? t('forms.seletorIconeMaterialDesign.label'));

const iconeNormalizadoAtual = computed(() => normalizarIcone(valorCombobox.value) || ICONE_PADRAO);

const iconesMaterialDesign = computed<TItemIconeMaterialDesign[]>(() => [
  criarItemIcone('shield-account-outline', t('forms.seletorIconeMaterialDesign.icones.escudoConta')),
  criarItemIcone('shield-key-outline', t('forms.seletorIconeMaterialDesign.icones.escudoChave')),
  criarItemIcone('shield-crown-outline', t('forms.seletorIconeMaterialDesign.icones.escudoAdministrativo')),
  criarItemIcone('account', t('forms.seletorIconeMaterialDesign.icones.conta')),
  criarItemIcone('account-tie', t('forms.seletorIconeMaterialDesign.icones.contaExecutiva')),
  criarItemIcone('account-key-outline', t('forms.seletorIconeMaterialDesign.icones.contaChave')),
  criarItemIcone('account-cog-outline', t('forms.seletorIconeMaterialDesign.icones.contaConfiguracoes')),
  criarItemIcone('account-group-outline', t('forms.seletorIconeMaterialDesign.icones.grupoContas')),
  criarItemIcone('account-supervisor-outline', t('forms.seletorIconeMaterialDesign.icones.supervisor')),
  criarItemIcone('badge-account-outline', t('forms.seletorIconeMaterialDesign.icones.crachaConta')),
  criarItemIcone('card-account-details-outline', t('forms.seletorIconeMaterialDesign.icones.detalhesConta')),
  criarItemIcone('briefcase-account-outline', t('forms.seletorIconeMaterialDesign.icones.contaProfissional')),
  criarItemIcone('lock-outline', t('forms.seletorIconeMaterialDesign.icones.bloqueio')),
  criarItemIcone('lock-open-outline', t('forms.seletorIconeMaterialDesign.icones.bloqueioAberto')),
  criarItemIcone('key-outline', t('forms.seletorIconeMaterialDesign.icones.chave')),
  criarItemIcone('cog-outline', t('forms.seletorIconeMaterialDesign.icones.configuracao')),
  criarItemIcone('view-dashboard-outline', t('forms.seletorIconeMaterialDesign.icones.painel')),
  criarItemIcone('database-outline', t('forms.seletorIconeMaterialDesign.icones.bancoDados')),
  criarItemIcone('chart-box-outline', t('forms.seletorIconeMaterialDesign.icones.grafico')),
  criarItemIcone('file-document-outline', t('forms.seletorIconeMaterialDesign.icones.documento')),
  criarItemIcone('package-variant-closed', t('forms.seletorIconeMaterialDesign.icones.pacote')),
  criarItemIcone('cart-outline', t('forms.seletorIconeMaterialDesign.icones.carrinho')),
  criarItemIcone('cash-multiple', t('forms.seletorIconeMaterialDesign.icones.financeiro')),
  criarItemIcone('email-outline', t('forms.seletorIconeMaterialDesign.icones.email')),
  criarItemIcone('phone-outline', t('forms.seletorIconeMaterialDesign.icones.telefone')),
]);
</script>
