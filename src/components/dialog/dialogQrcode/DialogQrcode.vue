<template>
  <v-dialog v-model="dialog.show" max-width="400" max-height="1000">
    <v-card>
      <v-card-title class="d-flex justify-center mt-5">
        <v-icon>mdi-cellphone-wireless</v-icon>
        Conectar ao WhatsApp
      </v-card-title>
      <v-card-text class="d-flex justify-center">
        <v-list dense>
          <v-list-item>
            <img :src="dialog.qrcode" />
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text color="red-lighten-1" @click="toggleDialog">Fechar</v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">

const dialog = defineModel<{show: boolean, qrcode: string}>('qrcode', {
  required: true
})

function toggleDialog() {
  dialog.value.show = !dialog.value.show
}

</script>
