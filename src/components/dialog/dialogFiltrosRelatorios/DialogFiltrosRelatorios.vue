<template>
  <v-dialog v-model="exibir" max-width="1000">
    <v-form ref="formRef" v-model="formIsValid" @submit.prevent="submitForm()">
      <v-card prepend-icon="" title="Filtros para gerar relatório">
        <v-tabs

          bg-color="primary"
        >
          <!--      v-model="tab"-->
          <v-tab value="one">Item One</v-tab>
          <v-tab value="two">Item Two</v-tab>
          <v-tab value="three">Item Three</v-tab>
        </v-tabs>

        <v-card-text>
          <v-tabs-window>
            <!--        v-model="tab"-->
            <v-tabs-window-item value="one">
              One
            </v-tabs-window-item>

            <v-tabs-window-item value="two">
              Two
            </v-tabs-window-item>

            <v-tabs-window-item value="three">
              Three
            </v-tabs-window-item>
          </v-tabs-window>
        </v-card-text>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup lang="ts">

// Classes
import type { DialogFiltrosRelatoriosClass } from "@/components/dialog/dialogFiltrosRelatorios/ClassDialogFiltrosRelatorios.ts";

// Vue
import {computed, ref} from "vue";

const formRef = ref()
const formIsValid = (false)

interface Props {
  modelValue: DialogFiltrosRelatoriosClass
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: DialogFiltrosRelatoriosClass): void
  // (e: 'operacao-concluida'): void
}>()

const filtros = computed(() => props.modelValue)
const dialogFiltrosRelatorios = computed(() => props.modelValue)
const exibir = computed({
  get: () => dialogFiltrosRelatorios.value.show,
  set: (val) => dialogFiltrosRelatorios.value.show = val
})


function submitForm() {

}

</script>

<style scoped>

</style>
