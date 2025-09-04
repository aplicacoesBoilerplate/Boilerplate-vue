<template>
  <div>
    <h3 class="font-weight-bold pl-3 mb-3">
      <v-icon>mdi-chart-donut-variant</v-icon>
      Autorizações por saída
    </h3>

    <v-row dense v-for="(saidaAutorizacao, index) in relatorioGerado" :key="index">
      <v-col cols="12">
        <p class="d-flex justify-center"> #{{ saidaAutorizacao.idSaida }} Funcionario: {{ saidaAutorizacao.nomeFuncionario }}</p>
        <p class="d-flex justify-center"> Data solicitação: {{ saidaAutorizacao.dataSolicitacaoSaida }} - {{ saidaAutorizacao.statusSaida }}</p>
      </v-col>

      <v-col cols="4">
        <p>Responsável: #{{ saidaAutorizacao.idFuncionarioResponsavelSaida }} {{ saidaAutorizacao.nomeFuncionarioResponsavelSaida }}</p>
      </v-col>

      <v-col cols="4">
        <p>Funcionario:</p>
        <p>Registro: {{ saidaAutorizacao.numeroRegistroFuncionario }} {{ saidaAutorizacao.nomeFuncionario }}</p>
        <p>Setor: {{ saidaAutorizacao.setorFuncionario }}</p>
      </v-col>

      <v-col cols="4">
        <p>Motivo: #{{ saidaAutorizacao.motivoSaida }} {{ saidaAutorizacao.descricaoMotivo }}</p>
        <p>Categoria: #{{ saidaAutorizacao.categoriaMotivo }}</p>
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
              <td>{{ saidaAutorizacao.dataPrevisaoSaidaFuncionario }}</td>
            </tr>
            <tr>
              <td>Data saída</td>
              <td>{{ saidaAutorizacao.dataSaidaFuncionario }}</td>
            </tr>
            <tr>
              <td>Prev. retorno</td>
              <td>{{ saidaAutorizacao.confirmaRetorno ? saidaAutorizacao.dataPrevisaoChegadaFuncionario : 'SEM RETORNO' }}</td>
            </tr>
            <tr>
              <td>Data retorno</td>
              <td>{{ saidaAutorizacao.confirmaRetorno && saidaAutorizacao.dataChegadaFuncionario ? saidaAutorizacao.dataChegadaFuncionario : 'RETORNO PENDENTE' }}</td>
            </tr>
            <tr>
              <td>Data aprovação da saída</td>
              <td>{{ saidaAutorizacao.dataAprovacaoSaida ?? 'APROVAÇÃO PENDENTE' }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-col>

      <v-col cols="12">
        <p>Observação: {{ saidaAutorizacao.observacaoSaida }}</p>
      </v-col>

      <v-col cols="12">
        <p>Quadro de autorizações:</p>
        <v-table fixed-header>
          <thead>
            <tr>
              <th>Responsável</th>
              <th>Autorização</th>
              <th>Observação</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(autorizacao) in saidaAutorizacao.autorizacoes" :key="autorizacao.idAutorizacao">
              <td>#{{ autorizacao.idFuncionarioAutorizacao }} {{ autorizacao. nomeResponsavel }}</td>
              <td>{{ autorizacao.dataAutorizacao }}
                <span :class="autorizacao.aprovacaoSaida ? 'green-darken-2' : 'red-darken-2'">
                  - {{ autorizacao.aprovacaoSaida ? 'APROVADA' : 'NEGADA' }}
                </span>
              </td>
              <td>{{ autorizacao.observacaoAutorizacao }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-col>

      <v-divider />
    </v-row>
  </div>
</template>

<script setup lang="ts">
import type { SaidasComAutorizacoes } from '@/models/saidasModels/saidasModels';

const relatorioGerado = defineModel<SaidasComAutorizacoes[]>('dados')

</script>
