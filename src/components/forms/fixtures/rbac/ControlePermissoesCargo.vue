<template>
  <div class="d-flex flex-column ga-4">
    <div class="d-flex align-center justify-space-between flex-wrap ga-2">
      <div>
        <div class="text-subtitle-1 font-weight-bold">Rotas liberadas</div>
        <div class="text-caption text-medium-emphasis">
          Rotas filhas mantêm a rota pai liberada para preservar a navegação.
        </div>
      </div>

      <v-chip
        :color="padraoLiberado ? 'success' : 'error'"
        :prepend-icon="padraoLiberado ? 'mdi-lock-open-outline' : 'mdi-lock-outline'"
        size="small"
        variant="tonal"
      >
        {{ padraoLiberado ? 'Libera por padrão' : 'Bloqueia por padrão' }}
      </v-chip>
    </div>

    <v-list
      class="pa-0 border rounded"
      density="compact"
    >
      <v-list-item
        v-for="rota in rotasPermissao"
        :key="rota.chave"
        :style="{ paddingLeft: `${16 + rota.nivel * 24}px` }"
      >
        <template #prepend>
          <v-checkbox-btn
            :model-value="permissaoRotaLiberada(rota)"
            color="success"
            density="compact"
            @update:model-value="atualizarPermissaoRota(rota, Boolean($event))"
          />
        </template>

        <template #title>
          <div class="d-flex align-center ga-2">
            <v-icon
              :icon="rota.icone"
              size="small"
            />
            <span>{{ rota.titulo }}</span>
          </div>
        </template>

        <template #subtitle>
          {{ rota.chave }}
        </template>
      </v-list-item>
    </v-list>

    <v-divider />

    <div>
      <div class="text-subtitle-1 font-weight-bold">Permissões gerais</div>
      <div class="text-caption text-medium-emphasis">
        Ações transversais que podem ser usadas por vários recursos.
      </div>
    </div>

    <v-list
      class="pa-0 border rounded"
      density="compact"
    >
      <v-list-item
        v-for="permissao in PERMISSOES_GERAIS_RBAC"
        :key="permissao.valor"
      >
        <template #prepend>
          <v-checkbox-btn
            :model-value="permissaoLiberada(RECURSO_PERMISSAO_GERAL_RBAC, permissao.valor)"
            color="success"
            density="compact"
            @update:model-value="definirPermissao(RECURSO_PERMISSAO_GERAL_RBAC, permissao.valor, Boolean($event))"
          />
        </template>

        <template #title>
          <div class="d-flex align-center ga-2">
            <v-icon
              :icon="permissao.icone"
              size="small"
            />
            <span>{{ permissao.descricao }}</span>
          </div>
        </template>
      </v-list-item>
    </v-list>
  </div>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, type RouteRecordRaw } from 'vue-router';

// Types e Interfaces
import type { IPermissaoCargoRbac, TComportamentoPadraoPermissao } from '@/models/model/rbac/rbac.models';

// Mapeamentos
import {
  PERMISSOES_GERAIS_RBAC,
  RECURSO_PERMISSAO_GERAL_RBAC,
  RECURSO_PERMISSAO_ROTAS_RBAC,
} from '@/models/model/rbac/rbac.models';

type TProps = {
  /**
   * Regra aplicada quando uma permissão ainda não foi configurada explicitamente.
   */
  comportamentoPadrao: TComportamentoPadraoPermissao;
};

type TItemPermissaoRota = {
  chave: string;
  titulo: string;
  icone: string;
  nivel: number;
  pais: string[];
  filhos: string[];
  descendentes: string[];
};

type TNoRota = Omit<TItemPermissaoRota, 'filhos' | 'descendentes'> & {
  filhos: TNoRota[];
};

// Props
const props = defineProps<TProps>();

// Composables
const router = useRouter();
const { t } = useI18n();

// Reativas - Model
const permissoes = defineModel<IPermissaoCargoRbac[]>('permissoes', { required: true });

// Constantes
const SEPARADOR_CHAVE_PERMISSAO = '::';

// Computadas
const padraoLiberado = computed(() => props.comportamentoPadrao === 'liberar');

const rotasPermissao = computed<TItemPermissaoRota[]>(() => {
  return achatarNosRotas(montarNosRotas(router.options.routes));
});

const mapaRotas = computed(() => {
  return new Map(rotasPermissao.value.map((pRota) => [pRota.chave, pRota]));
});

// Funções
function montarNosRotas(
  pRotas: readonly RouteRecordRaw[],
  pNivel = 0,
  pPais: string[] = [],
): TNoRota[] {
  return pRotas
    .filter((pRota) => !pRota.meta?.hidden)
    .map((pRota) => {
      const chave = obterChaveRota(pRota);
      const filhos = montarNosRotas(pRota.children ?? [], pNivel + 1, [...pPais, chave]);

      return {
        chave,
        titulo: obterTituloRota(pRota),
        icone: String(pRota.meta?.icon ?? 'mdi-routes'),
        nivel: pNivel,
        pais: pPais,
        filhos,
      };
    });
}

function achatarNosRotas(pNos: TNoRota[]): TItemPermissaoRota[] {
  return pNos.flatMap((pNo) => {
    const filhos = achatarNosRotas(pNo.filhos);

    return [
      {
        chave: pNo.chave,
        titulo: pNo.titulo,
        icone: pNo.icone,
        nivel: pNo.nivel,
        pais: pNo.pais,
        filhos: pNo.filhos.map((pFilho) => pFilho.chave),
        descendentes: filhos.map((pFilho) => pFilho.chave),
      },
      ...filhos,
    ];
  });
}

function obterChaveRota(pRota: RouteRecordRaw): string {
  return String(pRota.name ?? pRota.path);
}

function obterTituloRota(pRota: RouteRecordRaw): string {
  const titulo = pRota.meta?.title;

  if (typeof titulo === 'string') {
    return t(titulo);
  }

  return String(pRota.name ?? pRota.path);
}

function obterPermissao(pRecurso: string, pAcao: string): IPermissaoCargoRbac | undefined {
  return permissoes.value.find((pPermissao) => pPermissao.recurso === pRecurso && pPermissao.acao === pAcao);
}

function permissaoLiberada(pRecurso: string, pAcao: string): boolean {
  return obterPermissao(pRecurso, pAcao)?.liberado ?? padraoLiberado.value;
}

function permissaoRotaLiberada(pRota: TItemPermissaoRota): boolean {
  if (permissaoLiberada(RECURSO_PERMISSAO_ROTAS_RBAC, pRota.chave)) {
    return true;
  }

  return pRota.descendentes.some((pDescendente) => permissaoLiberada(RECURSO_PERMISSAO_ROTAS_RBAC, pDescendente));
}

function definirPermissao(pRecurso: string, pAcao: string, pLiberado: boolean): void {
  const permissoesAtualizadas = permissoes.value.filter(
    (pPermissao) => !(pPermissao.recurso === pRecurso && pPermissao.acao === pAcao),
  );

  permissoesAtualizadas.push({
    recurso: pRecurso,
    acao: pAcao,
    liberado: pLiberado,
  });

  permissoes.value = permissoesAtualizadas;
}

function atualizarPermissaoRota(pRota: TItemPermissaoRota, pLiberado: boolean): void {
  const mapaPermissoes = criarMapaPermissoes();

  [pRota.chave, ...pRota.descendentes].forEach((pChave) => {
    definirPermissaoNoMapa(mapaPermissoes, RECURSO_PERMISSAO_ROTAS_RBAC, pChave, pLiberado);
  });

  if (pLiberado) {
    pRota.pais.forEach((pPai) => {
      definirPermissaoNoMapa(mapaPermissoes, RECURSO_PERMISSAO_ROTAS_RBAC, pPai, true);
    });
  } else {
    sincronizarPaisPeloEstadoDosFilhos(mapaPermissoes, pRota.pais);
  }

  aplicarMapaPermissoes(mapaPermissoes);
}

function criarMapaPermissoes(): Map<string, boolean> {
  return new Map(
    permissoes.value.map((pPermissao) => [
      obterChavePermissao(pPermissao.recurso, pPermissao.acao),
      pPermissao.liberado,
    ]),
  );
}

function obterChavePermissao(pRecurso: string, pAcao: string): string {
  return `${pRecurso}${SEPARADOR_CHAVE_PERMISSAO}${pAcao}`;
}

function definirPermissaoNoMapa(
  pMapaPermissoes: Map<string, boolean>,
  pRecurso: string,
  pAcao: string,
  pLiberado: boolean,
): void {
  pMapaPermissoes.set(obterChavePermissao(pRecurso, pAcao), pLiberado);
}

function permissaoLiberadaNoMapa(
  pMapaPermissoes: Map<string, boolean>,
  pRecurso: string,
  pAcao: string,
): boolean {
  return pMapaPermissoes.get(obterChavePermissao(pRecurso, pAcao)) ?? padraoLiberado.value;
}

function sincronizarPaisPeloEstadoDosFilhos(
  pMapaPermissoes: Map<string, boolean>,
  pPais: string[],
): void {
  [...pPais].reverse().forEach((pPai) => {
    const rotaPai = mapaRotas.value.get(pPai);

    if (!rotaPai) {
      return;
    }

    const possuiFilhoLiberado = rotaPai.descendentes.some((pDescendente) =>
      permissaoLiberadaNoMapa(pMapaPermissoes, RECURSO_PERMISSAO_ROTAS_RBAC, pDescendente),
    );

    definirPermissaoNoMapa(pMapaPermissoes, RECURSO_PERMISSAO_ROTAS_RBAC, pPai, possuiFilhoLiberado);
  });
}

function aplicarMapaPermissoes(pMapaPermissoes: Map<string, boolean>): void {
  permissoes.value = Array.from(pMapaPermissoes.entries()).map(([pChave, pLiberado]) => {
    const [recurso, acao] = pChave.split(SEPARADOR_CHAVE_PERMISSAO);

    return {
      recurso,
      acao,
      liberado: pLiberado,
    };
  });
}
</script>
