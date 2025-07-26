<template>
  <div>
    <h3 class="font-weight-bold pl-3 mb-3">
      <v-icon>mdi-chart-donut-variant</v-icon>
      Saídas
    </h3>

    <v-row dense v-for="(saida, index) in relatorioGerado" :key="index">
      <v-col cols="12">
        <p class="d-flex justify-center"> #{{ saida.idSaida }} Funcionario: {{ saida.nomeFuncionario }}</p>
        <p class="d-flex justify-center"> Data solicitação: {{ saida.dataSolicitacaoSaida }} - {{ saida.statusSaida }}</p>
      </v-col>

      <v-col cols="4">
        <p>Responsável: #{{ saida.idFuncionarioResponsavelSaida }} {{ saida.nomeFuncionarioResponsavelSaida }}</p>
      </v-col>

      <v-col cols="4">
        <p>Funcionario:</p>
        <p>Registro: {{ saida.numeroRegistroFuncionario }} {{ saida.nomeFuncionario }}</p>
        <p>Setor: {{ saida.setorFuncionario }}</p>
      </v-col>

      <v-col cols="4">
        <p>Motivo: #{{ saida.motivoSaida }} {{ saida.descricaoMotivo }}</p>
        <p>Categoria: #{{ saida.categoriaMotivo }} {{ saida. }}</p>
      </v-col>

      <v-col cols="12">
        <p>Quadro de horários:</p>
        <v-table fixed-header>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Horário</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Prev. saída</td>
              <td>{{ saida.dataPrevisaoSaidaFuncionario }}</td>
            </tr>
            <tr>
              <td>Data saída</td>
              <td>{{ saida.dataSaidaFuncionario }}</td>
            </tr>
            <tr>
              <td>Prev. retorno</td>
              <td>{{ saida.confirmaRetorno ? saida.dataPrevisaoChegadaFuncionario : 'SEM RETORNO' }}</td>
            </tr>
            <tr>
              <td>Data retorno</td>
              <td>{{ saida.confirmaRetorno && saida.dataChegadaFuncionario ? saida.dataChegadaFuncionario : 'RETORNO PENDENTE' }}</td>
            </tr>
            <tr>
              <td>Data aprovação da saída</td>
              <td>{{ saida.dataAprovacaoSaida ?? 'APROVAÇÃO PENDENTE' }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-col>

      <v-col cols="12">
        <p>Observação: {{ saida.observacaoSaida }}</p>
      </v-col>

      <v-divider />
    </v-row>
  </div>
</template>

<script setup lang="ts">
import type { SaidaConsulta } from '@/models/saidasModels/saidasModels';

const relatorioGerado = defineModel<SaidaConsulta[]>('blocoresponsaveis')

</script>
