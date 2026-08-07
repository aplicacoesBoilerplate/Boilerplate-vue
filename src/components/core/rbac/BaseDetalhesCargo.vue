<template>
  <v-menu
    v-model="menu"
    :closeOnContentClick="false"
    location="top start"
    origin="top start"
    transition="scale-transition"
  >
    <template #activator="{ props }">
      <slot
        :props="props"
        name="activator"
      >
        <v-chip
          v-bind="props"
          link
          pill
        >
          <v-avatar start>
            <v-img :src="avatar" />
          </v-avatar>

          <v-list-item-title>{{ titulo }}</v-list-item-title>
        </v-chip>
      </slot>
    </template>

    <v-card width="450">
      <v-list bgColor="black">
        <v-list-item>
          <template #prepend>
            <slot name="avatar-prepend-card">
              <v-avatar :image="avatar" />
            </slot>
          </template>

          <v-list-item-title>{{ titulo }}</v-list-item-title>
          <v-list-item-subtitle>{{ subtitulo }}</v-list-item-subtitle>

          <template #append>
            <v-list-item-action>
              <v-btn
                variant="text"
                icon
                @click="menu = false"
              >
                <v-icon icon="mdi-close-circle" />
              </v-btn>
            </v-list-item-action>
          </template>
        </v-list-item>
      </v-list>

      <v-list bgColor="blue-grey-darken-4">
        <slot
          :fechar="fecharMenu"
          name="content"
        >
          <v-list-item
            prependIcon="mdi-briefcase"
            link
          >
            <v-list-item-subtitle>{{ subtitulo }}</v-list-item-subtitle>
          </v-list-item>
        </slot>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
// Ecossistema Vue
import { ref } from 'vue';

/**
 * @description Propriedade do componente que recebe a implementação da exibição dos detalhes de um cargo.
 * @property {string} avatar - Imagem usada pelo activator padrão e pelo cabeçalho do card.
 * @property {string} titulo - Título principal exibido no resumo e nos detalhes.
 * @property {string} subtitulo - Texto auxiliar exibido abaixo do título.
 */
type TProps = {
  avatar?: string;
  titulo: string;
  subtitulo?: string;
};
defineProps<TProps>();

// Reativas
const menu = ref(false);

// Funções
function fecharMenu(): void {
  menu.value = false;
}
</script>
