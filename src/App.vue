<script setup lang="ts">
// Componentes
import SnackbarNotifications from '@/components/Snackbar.vue';
import Navigation from './components/Navigation.vue';

// Vue e Router
import { RouterView, useRoute } from 'vue-router'
import { onUnmounted, watch } from 'vue';

// Lógica de Inatividade
import { gerenciamentoInatividade } from '@/utils/gerenciamentoInatividade';
import { useInatividadeStore } from '@/stores/inatividade';

const route = useRoute();
const inatividadeStore = useInatividadeStore();

let watcherinatividade: gerenciamentoInatividade | null = null;

function startInactivityWatcher() {
    watcherinatividade = new gerenciamentoInatividade(() => {
        if (inatividadeStore.acaoAtualizar) {
            inatividadeStore.acaoAtualizar();
        }
    }, 600000); // 10 minutos

    watcherinatividade.onWarning((remaining) => {
        inatividadeStore.setTempoRestante(remaining);
    });

    watcherinatividade.onReset(() => {
        inatividadeStore.setTempoRestante(null);
    });

    watcherinatividade.start();
}

watch(() => route.path, (newPath) => {
    watcherinatividade?.stop();
    if (newPath !== '/' && newPath !== '/register') {
        startInactivityWatcher();
    }
}, { immediate: true });

onUnmounted(() => {
    watcherinatividade?.stop();
})

</script>

<template>
    <v-app theme="dark">
        <SnackbarNotifications />
        <Navigation v-if="route.path !== '/' && route.path !== '/register'" />

        <v-main>
            <v-container>
                <RouterView v-if="route.path == '/' || route.path == '/register'" />
                <!-- v-if acima evita duplicidade na exibição dos componentes -->
            </v-container>
        </v-main>
    </v-app>
</template>

<style global>
html,
v-main {
    height: 100vh;
    margin: 0;
    padding: 0;
}
</style>
