<template>
    <v-dialog v-model="isDialogVisible" :max-width="dialog.maxWidth || 400" :max-height="dialog.maxHeight || 800">
        <v-card>
            <v-card-title class="mt-3">
                <span class="text-h6">
                    <slot name="titulo">
                        Título Padrão
                    </slot>
                </span>
            </v-card-title>

            <v-card-text>
                <slot></slot>
            </v-card-text>

            <v-card-actions class="sticky-actions">
                <slot name="acoes">
                    <v-spacer></v-spacer>
                    <v-btn color="red-lighten-1" variant="plain" @click="toggleDialog()">
                        <v-icon class="pt-1">mdi-close</v-icon>
                        Fechar
                    </v-btn>
                    <v-spacer></v-spacer>
                </slot>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const dialog = defineModel<{ visualizar: boolean, maxWidth?: number, maxHeight?: number }>('atributos', {
    required: true
})

const isDialogVisible = computed({
    get() {
        return dialog.value.visualizar;
    },
    set(newValue: boolean) {
        dialog.value = { ...dialog.value, visualizar: newValue };
    }
});

function toggleDialog() {
    dialog.value = { ...dialog.value, visualizar: !dialog.value.visualizar };
}

</script>
