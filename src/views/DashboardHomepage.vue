<template>
  <div>
    <h1>Dashboard Homepage</h1>
  </div>
  <v-bttn @click="onCLickBuscar()">BUSCAR</v-bttn>

  <v-btn @click="onClickLimparFiltros()">Limpar Filtros</v-btn>
  <PokemonsList />
</template>

<script setup lang="ts">
import PokemonsList from '@/components/PokemonsList.vue';


//#region Produtos
// Eventos
async function onCLickBuscar() {
  //Validar

  await buscar()
}


async function onClickLimparFiltros() {
  //Limpar
  buscar()

  const buscarArray = await new Promise((resolve) => {
    resolve(true)
  })



  //Navegar ate a tela X
  // - 1
  // - 2 - await
  // - 3 - await Promise
  // - 4


}


async function buscar() {
  ///
}

//#endregion


//#region Usuarios


//#endregion




</script>
