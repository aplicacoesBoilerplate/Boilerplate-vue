<template>
  <div>
    <h1>Lista de Pokémons</h1>
    <ul>
      <li v-for="pokemon in pokemons" :key="pokemon.name">
        {{ pokemon.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
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
