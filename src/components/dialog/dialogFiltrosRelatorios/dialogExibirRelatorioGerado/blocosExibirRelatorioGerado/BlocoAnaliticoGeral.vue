<template>
  <div>
    <h3 class="font-weight-bold pl-3 mb-3">
      <v-icon>mdi-chart-donut-variant</v-icon>
      Saídas por completo
    </h3>

    <!-- Loop pelas saídas -->
    <v-row dense v-for="(saida, indexSaida) in relatorioGerado?.informacoesSaidasComAutorizacoes" :key="indexSaida">
      <v-col cols="12">
        <h4 class="font-weight-bold text-teal-lighten-3">
          Saída #{{ saida.idSaida }} - Funcionário: #{{ saida.numeroRegistroFuncionario }}, {{ saida.nomeFuncionario }},
          {{ saida.setorFuncionario }}
        </h4>
      </v-col>

      <v-col cols="12" class="font-weight-bold text-teal-lighten-3">
        <v-row dense>
          <v-col cols="6">
            <h4>
              Data de solicitação: {{ saida.dataSolicitacaoSaida }}
            </h4>
          </v-col>

          <v-col cols="6" class="d-flex flex-row-reverse pr-5">
            <h4>
              Data de aprovação: {{ saida.dataAprovacaoSaida || '----' }}
            </h4>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" class="font-weight-bold text-teal-lighten-3">
        <v-row dense>
          <v-col cols="4">
            <h4>
              {{ saida.dataSaidaFuncionario != null ? `Data da saída: ${saida.dataSaidaFuncionario}` : `Data da previsão
              de saída: ${saida.dataPrevisaoSaidaFuncionario}` }}
            </h4>
          </v-col>

          <v-col cols="4" class="d-flex flex-row-reverse pr-5">
            <h4>
              {{ saida.dataChegadaFuncionario != null ? `Data do retorno: ${saida.dataChegadaFuncionario}` : `Data da
              previsão de retorno: ${saida.dataPrevisaoChegadaFuncionario}` }}
            </h4>
          </v-col>

          <v-col cols="4" class="d-flex flex-row-reverse pr-5">
            <h4>
              Tempo total ausente: {{ saida.tempoTotalAusente }}
            </h4>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" class="font-weight-bold text-teal-lighten-3">
        <v-row dense>
          <v-col cols="6">
            <h4>
              Motivo #{{ saida.motivoSaida }}: {{ saida.descricaoMotivo }} <br>
            </h4>
          </v-col>

          <v-col cols="6" class="d-flex flex-row-reverse pr-5">
            <h4>
              Categoria #{{ saida.idCategoria }}: {{ saida.descricaoCategoria }}, {{ saida.emergencial ? 'EMERGENCIA' : 'COMUM' }}
            </h4>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" class="font-weight-bold text-teal-lighten-3">
        <v-row dense>
          <v-col cols="6">
            <h4>
              Responsável: #{{ saida.idFuncionarioResponsavelSaida }}: {{ saida.nomeFuncionarioResponsavelSaida }} <br>
            </h4>
          </v-col>

          <v-col cols="6" class="d-flex flex-row-reverse pr-5">
            <h4>
              Status da saída: {{ saida.statusSaida }}
            </h4>
          </v-col>
        </v-row>
      </v-col>

      <!-- Loop pelas autorizações dentro da saída -->
      <v-row v-for="(autorizacao, indexAut) in saida.autorizacoes" :key="indexAut" dense
      class="pl-6 text-light-blue-lighten-3">
        <v-divider />
        <v-col cols="12">
          <h4 class="font-weight-bold">
            Autorizações
          </h4>
        </v-col>

        <v-col cols="4">
          Autorização: {{ autorizacao.idAutorizacao }}
        </v-col>

        <v-col cols="4">
          Responsável: #{{ autorizacao.idFuncionarioAutorizacao }}: {{ autorizacao.nomeResponsavel }} <br>
        </v-col>

        <v-col cols="4">
          <v-row dense>
            <v-col cols="12" v-if="autorizacao.aprovacaoSaida === true" class="text-green-lighten-3">
              Autorizado em: {{ autorizacao.dataAutorizacao }}
            </v-col>

            <v-col cols="12" v-else
              :class="autorizacao.dataAutorizacao == null ? 'text-yellow-lighten-3' : 'text-red-lighten-1'">
              {{ autorizacao.dataAutorizacao == null ? 'Pendente' : `Negado em: ${autorizacao.dataAutorizacao}` }}
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12">
          Observação da autorização: {{ autorizacao.observacaoAutorizacao || '----' }}
        </v-col>

        <v-divider v-if="(indexAut + 1) < saida.autorizacoes.length" />
      </v-row>
      <v-col cols="12" class="font-weight-bold text-teal-lighten-3">
        Observação da saída: {{ saida.observacaoSaida || '----' }}
      </v-col>
      <v-divider />
    </v-row>
  </div>
</template>

<script setup lang="ts">
import type { AnaliticoGeral } from '@/models/relatoriosModels/relatoriosModels';

const relatorioGerado = defineModel<AnaliticoGeral>('dados');
</script>
