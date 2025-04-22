<template>
  <div>
    <h1>Lista de Pokémons</h1>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const pokemons = ref([])

onMounted(async () => {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20')
    const data = await response.json()
    pokemons.value = data.results
  } catch (error) {
    console.error('Erro ao buscar Pokémons:', error)
  }
})
</script>
