/* eslint-disable @typescript-eslint/no-explicit-any */
// Models
import type { VTextField } from 'vuetify/components';

import { CTradutor } from '@/classes/Utils/CTradutor';

export type TVuetifyRule = NonNullable<InstanceType<typeof VTextField>['$props']['rules']>[number];
type TRuleFactory = (...args: any[]) => TVuetifyRule;

/**
 * @description Configurações para validação de regras de data.
 *
 * @property {boolean} ignorarComparacaoHora - Define se a comparação ignora horas (Padrão: true).
 * @property {string} mensagemErro - Mensagem exibida caso a regra falhe.
 */
interface IDateRuleOptions {
  ignorarComparacaoHora?: boolean;
  mensagemErro?: string;
}

/**
 * @description Conjunto de regras personalizadas para a propriedade rules de v-inputs do vuetify. As rules satisfazem TVuetifyRule.
 */
export const rulesPersonalizadas = {
  /**
   * @description Verifica se o valor do input é estritamente igual ao valor de comparação.
   * Útil para confirmação de senha ou validação de e-mails iguais.
   *
   * @param pCompararCom String estática ou função que retorna o valor a ser comparado.
   * @param pMensagemErro Mensagem exibida caso a validação falhe.
   * @returns Boolean ou mensagem justificando o motivo de estar inválido.
   */
  equals: (pCompararCom: string | (() => string), pMensagemErro: string = 'Os valores não coincidem') => {
    return (pValor: any) => pValor === (typeof pCompararCom === 'function' ? pCompararCom() : pCompararCom) || pMensagemErro;
  },

  /**
   * @description Verifica se o valor do input está contido dentro de uma lista de valores permitidos.
   *
   * @param pValoresValidos Array contendo as opções válidas.
   * @param pMensagemErro Mensagem exibida caso a validação falhe.
   * @returns Boolean ou mensagem justificando o motivo de estar inválido.
   */
  includes: (pValoresValidos: string[], pMensagemErro: string = 'Preencha o valor com uma das opções válida') => {
    return (pValor: any) => pValoresValidos.includes(pValor) || pMensagemErro;
  },

  /**
   * @description Valida se a data informada no input é posterior ou igual a uma data de referência.
   *
   * @param pCompararCom Data de referência (string, objeto Date ou função que os retorne).
   * @param pOptions Configurações da validação (ignorar hora e mensagem customizada).
   * @returns Boolean ou mensagem justificando o motivo de estar inválido.
   */
  dateAfter: (pCompararCom: string | Date | (() => string | Date), pOptions: IDateRuleOptions = {}) => {
    const { ignorarComparacaoHora = true, mensagemErro = 'Data não permitida' } = pOptions;

    return (pValor: any) => {
      if (!pValor) return true;

      const lComparacao = typeof pCompararCom === 'function' ? pCompararCom() : pCompararCom;

      const lValorInputDate = new Date(pValor);
      const lValorComparacaoDate = new Date(lComparacao);

      if (isNaN(lValorInputDate.getTime())) return CTradutor.traduzir('common.messages.invalidDate');
      if (isNaN(lValorComparacaoDate.getTime())) return CTradutor.traduzir('common.messages.invalidComparisonDate');

      if (ignorarComparacaoHora) {
        lValorInputDate.setHours(0, 0, 0, 0);
        lValorComparacaoDate.setHours(0, 0, 0, 0);
      }

      return lValorInputDate >= lValorComparacaoDate || mensagemErro;
    };
  },
} satisfies Record<string, TRuleFactory>;
