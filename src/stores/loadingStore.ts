import { defineStore } from "pinia";
import { ref } from "vue";

export const loadingStore = defineStore('loading', () => {
  const inLoading = ref(false)
  return { inLoading }
})
