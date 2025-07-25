<template>
  {{ dados }}
</template>

<script setup lang="ts">
import type { UsuarioConsulta } from '@/models/usersModels/UsuariosModels';

const dados = defineModel<UsuarioConsulta>('blocoresponsaveis')

</script>
