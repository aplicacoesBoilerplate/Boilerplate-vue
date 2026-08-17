import { createPinia } from 'pinia';

/** Instância única do Pinia usada pela aplicação e por integrações fora do setup de componentes. */
export const pinia = createPinia();
