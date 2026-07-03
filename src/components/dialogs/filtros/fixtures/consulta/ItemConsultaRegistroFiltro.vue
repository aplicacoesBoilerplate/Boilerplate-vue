<template>
  <v-list-item
    :active="selecionado"
    class="border rounded mb-2 px-3 py-2"
    color="primary"
    lines="one"
    link
    variant="tonal"
    @click="emit('selecionar', registro)"
  >
    <template #prepend>
      <v-icon
        :class="selecionado ? 'text-primary' : 'text-medium-emphasis'"
        icon="mdi-check-circle-outline"
        size="24"
      />
    </template>

    <v-list-item-title class="text-body-2 font-weight-medium">
      {{ descricaoRegistro }} - {{valorRegistro}}
    </v-list-item-title>
  </v-list-item>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { computed } from 'vue';

// Classes
import { CFormatters } from '@/classes/Utils/CFormatters';

type TRegistroConsulta = Record<string, unknown>;

type TProps = {
  /**
   * Atributo usado para exibir a descrição principal do registro.
   */
  atributoDescricao: string;
  /**
   * Atributo usado como valor aplicado no filtro.
   */
  atributoValor: string;
  /**
   * Registro retornado pela consulta auxiliar.
   */
  registro: TRegistroConsulta;
  /**
   * Define se o registro está selecionado no filtro atual.
   */
  selecionado: boolean;
};
const props = defineProps<TProps>();

type TEmits = {
  selecionar: [registro: TRegistroConsulta];
};
const emit = defineEmits<TEmits>();

// Computadas
const descricaoRegistro = computed(() => CFormatters.formatarGenerico(props.registro[props.atributoDescricao]));
const valorRegistro = computed(() => CFormatters.formatarGenerico(props.registro[props.atributoValor]));
</script>
