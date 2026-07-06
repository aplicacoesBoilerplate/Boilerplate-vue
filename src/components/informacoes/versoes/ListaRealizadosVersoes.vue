<template>
  <v-col
    cols="12"
    md="9"
  >
    <v-timeline
      align="start"
      density="compact"
      side="end"
    >
      <v-timeline-item
        v-for="versao in versoes"
        :key="`${versao.numero}-${versao.data}`"
        :dotColor="versao.numero === versaoAtual ? 'success' : 'primary'"
        size="small"
      >
        <template #opposite>
          <v-chip
            :color="versao.numero === versaoAtual ? 'success' : 'primary'"
            size="small"
            variant="tonal"
          >
            {{ versao.numero === versaoAtual ? 'Atual' : versao.data }}
          </v-chip>
        </template>

        <v-expansion-panels
          v-model="paineisAbertos"
          variant="accordion"
        >
          <v-expansion-panel
            :value="versao.numero"
            class="border"
            rounded="lg"
          >
            <v-expansion-panel-title
              class="py-3"
              color="surface"
            >
              <div class="d-flex flex-wrap align-center ga-2">
                <span class="text-h6 font-weight-bold">v{{ versao.numero }}</span>
                <span class="text-caption text-medium-emphasis">{{ versao.data }}</span>

                <v-chip
                  color="secondary"
                  size="x-small"
                  variant="tonal"
                >
                  {{ versao.totalItens }} item(ns)
                </v-chip>

                <v-chip
                  :color="versao.numero === versaoAtual ? 'success' : 'primary'"
                  size="x-small"
                  variant="tonal"
                >
                  {{ versao.numero === versaoAtual ? 'Atual' : 'Registrada' }}
                </v-chip>
              </div>
            </v-expansion-panel-title>

            <v-expansion-panel-text>
              <v-sheet
                class="pa-1"
                color="surface"
              >
                <v-row
                  v-if="versao.secoes.length"
                  density="comfortable"
                >
                  <v-col
                    v-for="secao in versao.secoes"
                    :key="`${versao.numero}-${secao.titulo}`"
                    cols="12"
                    lg="4"
                  >
                    <v-sheet
                      class="border rounded pa-3 h-100"
                      color="surface"
                    >
                      <div class="d-flex align-center ga-2 mb-2">
                        <v-icon
                          :icon="secao.icone"
                          :color="secao.cor"
                          size="small"
                        />
                        <span class="text-subtitle-2 font-weight-bold">{{ secao.titulo }}</span>

                        <v-chip
                          :color="secao.cor"
                          size="x-small"
                          variant="tonal"
                        >
                          {{ secao.itens.length }}
                        </v-chip>
                      </div>

                      <v-list
                        class="pa-0"
                        bg-color="transparent"
                        density="compact"
                      >
                        <v-list-item
                          v-for="item in secao.itens"
                          :key="item"
                          class="px-0"
                        >
                          <template #prepend>
                            <v-icon
                              icon="mdi-check-circle-outline"
                              :color="secao.cor"
                              size="x-small"
                            />
                          </template>

                          <v-list-item-title class="text-body-2 text-wrap">
                            {{ item }}
                          </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-sheet>
                  </v-col>
                </v-row>

                <div
                  v-else
                  class="text-body-2 text-medium-emphasis"
                >
                  Nenhum item detalhado foi encontrado para esta versão.
                </div>
              </v-sheet>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-timeline-item>
    </v-timeline>
  </v-col>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed } from 'vue';

// Types e Interfaces
import type { TPropsListaRealizadosVersoes } from '@/models/components/IVersaoChangelog';

// Props
const props = defineProps<TPropsListaRealizadosVersoes>();

// Reativas - Model
const paineisAbertos = defineModel<string[]>('paineisAbertos', {
  default: () => [],
});

// Computadas
const versaoMaisRecente = computed(() => props.versoes[0]?.numero);

// Inicializa somente a versão mais recente aberta sem sobrescrever escolhas futuras do usuário.
if (paineisAbertos.value.length === 0 && versaoMaisRecente.value) {
  paineisAbertos.value = [versaoMaisRecente.value];
}
</script>
