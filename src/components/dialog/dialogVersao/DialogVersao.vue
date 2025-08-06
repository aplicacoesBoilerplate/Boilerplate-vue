<template>
  <v-dialog v-model="dialog" max-width="400">
    <v-card>
      <v-card-title class="mt-5">
        <v-icon>mdi-information-variant-circle-outline</v-icon>
        Informações da versão atual
      </v-card-title>
      <v-card-text>
        <v-list dense>
          <v-list-item>
            <template v-slot:prepend>
              <v-list-item-icon>
                <v-icon size="x-large" color="green" class="mr-3">mdi-monitor</v-icon>
              </v-list-item-icon>
            </template>
            <v-list-item-content>
              <v-list-item-title>Versão: {{ versao.version }}</v-list-item-title>
              <v-list-item-subtitle>Atualizado em: {{ versao.updateIn }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text color="indigo-accent-2" @click="toggleDialog">Fechar</v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
// Models
import type { Version } from '@/models/relatoriosModels/relatoriosModels';

// Store
import { useSnackbarStore } from '@/stores/SnackbarStore';

// Service
import { relatoriosServices } from '@/services/relatoriosService';

// Vue
import { onBeforeMount, ref } from 'vue';

const versao = ref<Version>({
  version: '',
  updateIn: ''
})

const dialog = defineModel<boolean>('visualizar', {
  required: true
})

function toggleDialog() {
  dialog.value = !dialog.value
}

async function getVersion() {
  try {
    versao.value = await relatoriosServices.getVersion();
  } catch (error) {
    useSnackbarStore().showSnackbar('Erro ao consultar a versão atual: ' + error, 'red')
    throw error
  }
}

onBeforeMount(async () => {
  await getVersion();
})

</script>
