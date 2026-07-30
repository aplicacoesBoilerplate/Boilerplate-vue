<template>
  <v-container
    class="fill-height py-4"
    fluid
  >
    <v-card
      class="w-100 d-flex flex-column"
      minHeight="calc(100vh - 112px)"
      elevation="4"
      rounded="lg"
    >
      <v-card-title class="d-flex flex-wrap align-center ga-3">
        <v-icon
          icon="mdi-information-outline"
          color="primary"
        />
        <span>{{ t('components.systemInfoView.titulo') }}</span>

        <v-chip
          color="primary"
          size="small"
          variant="tonal"
        >
          v{{ versaoAtual }}
        </v-chip>
      </v-card-title>

      <v-card-text class="d-flex flex-column flex-grow-1">
        <v-tabs
          v-model="abaAtual"
          color="primary"
          density="compact"
        >
          <v-tab
            value="geral"
            rounded="ts-xl be-xl"
          >
            <v-icon
              icon="mdi-view-dashboard-outline"
              start
            />
            {{ t('components.systemInfoView.abas.geral') }}
          </v-tab>

          <v-tab
            value="versoes"
            rounded="ts-xl be-xl"
          >
            <v-icon
              icon="mdi-source-branch"
              start
            />
            {{ t('components.systemInfoView.abas.versoes') }}
          </v-tab>
        </v-tabs>

        <v-window
          v-model="abaAtual"
          class="pt-5 flex-grow-1"
        >
          <v-window-item value="geral">
            <InfoGeral />
          </v-window-item>

          <v-window-item value="versoes">
            <Versoes
              :totalAlteracoes="totalAlteracoes"
              :versaoAtual="versaoAtual"
              :versaoMaisRecenteChangelog="versaoMaisRecenteChangelog"
              :versoes="versoes"
            />
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

// Types e Interfaces
import type {
  TAbaSistema,
  TMetadadosSecaoChangelog,
  TSecaoChangelog,
  TVersaoChangelog,
} from '@/models/components/IVersaoChangelog';

// Componentes
import InfoGeral from '@/components/common/informacoes/InfoGeral.vue';
import Versoes from '@/components/common/informacoes/versoes/Versoes.vue';

// Utils
import { CFormatters } from '@/classes/Utils/CFormatters';

// Dados locais
import changelog from '../../CHANGELOG.md?raw';
import packageJson from '../../package.json';

// Reativas
const abaAtual = ref<TAbaSistema>('geral');

// Composables
const { locale, t } = useI18n();

// Funções

/**
 * Extrai as versões do changelog em ordem cronológica inversa via Regex
 * @param pConteudo Conteúdo do arquivo CHANGELOG.md
 * @returns Array de versões do changelog
 */
function extrairVersoesChangelog(pConteudo: string): TVersaoChangelog[] {
  const regexVersao = /^## \[?([^\]\s]+)\]?.*?\((\d{4}-\d{2}-\d{2})\)\s*\n([\s\S]*?)(?=^## |^# Changelog|(?![\s\S]))/gm;
  const secoesVersao = [...pConteudo.matchAll(regexVersao)];

  return secoesVersao.map((pSecao) => {
    const secoes = extrairSecoesChangelog(pSecao[3]);

    return {
      numero: pSecao[1],
      data: CFormatters.formatarDataHora(pSecao[2], locale.value),
      secoes,
      totalItens: secoes.reduce((pTotal, pSecaoChangelog) => pTotal + pSecaoChangelog.itens.length, 0),
    };
  });
}

/**
 * Extrai as seções de uma versão do changelog via Regex
 * @param pBloco Bloco de texto contendo o changelog de uma versão
 * @returns Array de seções do changelog
 */
function extrairSecoesChangelog(pBloco: string): TSecaoChangelog[] {
  const regexSecao = /^###\s+(.+?)\s*\n([\s\S]*?)(?=^### |^## |^# Changelog|(?![\s\S]))/gm;

  return [...pBloco.matchAll(regexSecao)]
    .map((pSecao) => {
      const itens = extrairItensSecao(pSecao[2]);
      const metadados = mapearSecaoChangelog(pSecao[1]);

      return {
        ...metadados,
        itens,
      };
    })
    .filter((pSecao) => pSecao.itens.length > 0);
}

/**
 * Extrai os itens de uma seção do changelog via Regex
 * @param pBloco Bloco de texto contendo o changelog de uma seção
 * @returns Array de itens do changelog
 */
function extrairItensSecao(pBloco: string): string[] {
  return pBloco
    .split('\n')
    .filter((pLinha) => pLinha.trim().startsWith('* '))
    .map((pLinha) => limparLinhaChangelog(pLinha))
    .filter(Boolean);
}

/**
 * Mapeia o título de uma seção do changelog para metadados
 * @param pTitulo Título da seção
 * @returns Metadados da seção
 */
function mapearSecaoChangelog(pTitulo: string): TMetadadosSecaoChangelog {
  const tituloNormalizado = pTitulo.toLowerCase();

  if (tituloNormalizado.includes('breaking')) {
    return {
      titulo: t('components.systemInfoView.secoesChangelog.mudancasIncompativeis'),
      icone: 'mdi-alert-outline',
      cor: 'warning',
    };
  }

  if (tituloNormalizado.includes('feature')) {
    return {
      titulo: t('components.systemInfoView.secoesChangelog.funcionalidades'),
      icone: 'mdi-star-plus-outline',
      cor: 'primary',
    };
  }

  if (tituloNormalizado.includes('bug')) {
    return {
      titulo: t('components.systemInfoView.secoesChangelog.correcoes'),
      icone: 'mdi-bug-check-outline',
      cor: 'error',
    };
  }

  return {
    titulo: limparTituloSecao(pTitulo),
    icone: 'mdi-format-list-checks',
    cor: 'secondary',
  };
}

/**
 * Limpa uma linha do changelog, removendo marcadores e links
 * @param pLinha Linha do changelog a ser limpa
 * @returns Linha limpa do changelog
 */
function limparLinhaChangelog(pLinha: string): string {
  return pLinha
    .replace(/^\*\s+/, '')
    .replace(/\s+\(\[[^\]]+\]\([^)]+\)\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim();
}

/**
 * Limpa o título de uma seção do changelog, removendo caracteres especiais
 * @param pTitulo Título da seção
 * @returns Título limpo da seção
 */
function limparTituloSecao(pTitulo: string): string {
  return pTitulo
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Computadas
const versaoAtual = computed(() => packageJson.version);

const versoes = computed<TVersaoChangelog[]>(() => extrairVersoesChangelog(changelog));
const versaoMaisRecenteChangelog = computed(() => versoes.value[0]);
const totalAlteracoes = computed(() => versoes.value.reduce((pTotal, pVersao) => pTotal + pVersao.totalItens, 0));
</script>
