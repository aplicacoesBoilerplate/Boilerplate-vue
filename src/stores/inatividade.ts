import { defineStore } from "pinia";
import { ref } from "vue";

export const useInatividadeStore = defineStore("inatividade", () => {
    const tempoRestante = ref<number | null>(null);
    const acaoAtualizar = ref<(() => Promise<void>) | null>(null);

    function setTempoRestante(tempo: number | null) {
        tempoRestante.value = tempo;
    }

    function setAcaoAtualizar(acao: (() => Promise<void>) | null) {
        acaoAtualizar.value = acao;
    }

    return {
        tempoRestante,
        acaoAtualizar,
        setTempoRestante,
        setAcaoAtualizar,
    };
});
