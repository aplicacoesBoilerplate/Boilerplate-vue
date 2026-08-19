<template>
  <v-virtual-scroll
    :items="linhasIcones"
    :itemHeight="160"
    class="grade-icones-material-design h-100"
  >
    <template #default="{ item: linhaIcones, index }">
      <div
        :key="index"
        :style="{ gridTemplateColumns: `repeat(${quantidadeColunas}, minmax(0, 1fr))` }"
        class="grade-icones-material-design__linha"
      >
        <v-btn
          v-for="icone in linhaIcones"
          :key="icone.valor"
          :aria-label="t('forms.seletorIconeMaterialDesign.selecionarAriaLabel', { icone: icone.nome })"
          :class="{ 'grade-icones-material-design__card--selecionado': icone.valor === iconeSelecionado }"
          :color="icone.valor === iconeSelecionado ? 'primary' : undefined"
          class="grade-icones-material-design__card"
          variant="tonal"
          @click="emits('selecionar', icone.valor)"
        >
          <span class="grade-icones-material-design__corpo">
            <v-icon
              :icon="icone.valor"
              size="64"
            />
          </span>
          <span
            :title="icone.valor"
            class="grade-icones-material-design__rodape"
          >
            <span class="grade-icones-material-design__nome">{{ icone.nome }}</span>
          </span>
        </v-btn>
      </div>
    </template>
  </v-virtual-scroll>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDisplay } from 'vuetify';

// Types e Interfaces
import type { IIconeMaterialDesign } from '@/models/components/IIconeMaterialDesign';

/**
 * @property {IIconeMaterialDesign[]} icones - Icones que devem ser exibidos na grade.
 * @property {string} iconeSelecionado - Valor normalizado do ícone selecionado.
 */
type TProps = {
  icones: IIconeMaterialDesign[];
  iconeSelecionado?: string;
};
const props = withDefaults(defineProps<TProps>(), {
  iconeSelecionado: '',
});

type TEmits = {
  selecionar: [pValorIcone: string];
};
const emits = defineEmits<TEmits>();

// Composables
const { t } = useI18n();
const { mdAndUp, lgAndUp, xlAndUp } = useDisplay();

// Computadas
const quantidadeColunas = computed(() => {
  if (xlAndUp.value) return 8;
  if (lgAndUp.value) return 6;
  if (mdAndUp.value) return 4;
  return 2;
});

const linhasIcones = computed(() => {
  const linhas: IIconeMaterialDesign[][] = [];

  for (let indice = 0; indice < props.icones.length; indice += quantidadeColunas.value) {
    linhas.push(props.icones.slice(indice, indice + quantidadeColunas.value));
  }

  return linhas;
});
</script>

<style src="@/styles/components/GradeIconesMaterialDesign.scss" scoped lang="scss"></style>
