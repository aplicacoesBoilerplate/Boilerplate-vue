<template>
  <v-tabs
    v-model="abaAtual"
    color="primary"
    density="compact"
  >
    <v-tab
      value="dados"
      rounded="ts-xl be-xl"
    >
      <v-icon
        icon="mdi-card-account-details-outline"
        start
      />
      Dados
    </v-tab>
    <v-tab
      value="permissoes"
      rounded="ts-xl be-xl"
    >
      <v-icon
        icon="mdi-shield-key-outline"
        start
      />
      Permissões
    </v-tab>
    <v-tab
      value="usuarios"
      rounded="ts-xl be-xl"
    >
      <v-icon
        icon="mdi-account-switch-outline"
        start
      />
      Usuários
    </v-tab>
  </v-tabs>
</template>

<script setup lang="ts">
export type TAbas = 'dados' | 'permissoes' | 'usuarios';
const abaAtual = defineModel<TAbas>('abaAtual', { required: true, default: 'dados' });
</script>
