// Ecossistema
import { computed, type ComputedRef, type Ref } from 'vue';
import { type RouteRecordRaw, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

// Mapeamentos
import {
  ACOES_API_REDIRECIONAMENTO_INICIAL_RBAC,
  MAPEAMENTO_ROTAS_API_RBAC,
  montarAcaoEndpointApiRbac,
  montarChavePermissaoRbac,
  RECURSO_PERMISSAO_API_RBAC,
  RECURSO_PERMISSAO_ROTAS_RBAC,
} from '@/models/model/core/rbac/rbac.api';
import { ACOES_API_RBAC } from '@/models/model/core/rbac/rbac.types';
import type {
  IMapeamentoRotaApiRbac,
  IPermissaoCargoRbac,
  IRedirecionamentoInicialRbac,
  TAcaoApiRbac,
  TComportamentoPadraoPermissao,
} from '@/models/model/core/rbac/rbac.types';

/**
 * @description Representa um item da árvore de rotas achatada com seus metadados de permissões.
 * @property {string} chave - Nome ou path da rota usada como identificador de permissão.
 * @property {string} titulo - Título descritivo traduzido da rota.
 * @property {string} icone - Ícone representativo da rota.
 * @property {number} nivel - Nível de profundidade da rota no menu (0 para raiz, 1 para filho, etc).
 * @property {string[]} pais - Lista ordenada com as chaves das rotas pais.
 * @property {string[]} filhos - Lista de chaves das rotas filhas diretas.
 * @property {string[]} descendentes - Lista de chaves de todas as rotas descendentes na árvore.
 * @property {IMapeamentoRotaApiRbac} recursoApi - Mapeamento das ações e endpoints da API associados à rota.
 */
export interface IItemPermissaoRota {
  chave: string;
  titulo: string;
  icone: string;
  nivel: number;
  pais: string[];
  filhos: string[];
  descendentes: string[];
  recursoApi?: IMapeamentoRotaApiRbac;
}

/**
 * @description Representa um nó da árvore de rotas estruturado antes do achatamento.
 * @property {TNoRota[]} filhos - Lista de nós filhos.
 */
export type TNoRota = Omit<IItemPermissaoRota, 'filhos' | 'descendentes'> & {
  filhos: TNoRota[];
};

/**
 * @description Estrutura de retorno do composable de controle de permissões.
 */
export type TUseControlePermissoesCargoReturn = {
  rotasPermissao: ComputedRef<IItemPermissaoRota[]>;
  mapaRotas: ComputedRef<Map<string, IItemPermissaoRota>>;
  permissaoLiberada: (pRecurso: string, pAcao: string) => boolean;
  permissaoRotaLiberada: (pRota: IItemPermissaoRota) => boolean;
  acaoApiDisponivel: (pRota: IItemPermissaoRota, pAcao: TAcaoApiRbac) => boolean;
  acaoApiLiberada: (pRota: IItemPermissaoRota, pAcao: TAcaoApiRbac) => boolean;
  isAcaoApiDesabilitada: (pRota: IItemPermissaoRota, pAcao: TAcaoApiRbac) => boolean;
  obterDescricaoAcaoApi: (pAcao: TAcaoApiRbac) => string;
  obterSiglaAcaoApi: (pAcao: TAcaoApiRbac) => string;
  obterDescricaoPermissaoGeral: (pPermissao: string) => string;
  definirPermissao: (pRecurso: string, pAcao: string, pLiberado: boolean) => void;
  atualizarPermissaoRota: (pItem: IItemPermissaoRota, pLiberado: boolean) => void;
  atualizarPermissaoAcaoRota: (pItem: IItemPermissaoRota, pAcao: TAcaoApiRbac, pLiberado: boolean) => void;
  obterPermissoesComRedirecionamentoInicialLiberado: (
    pPermissoesAtuais: IPermissaoCargoRbac[],
    pRedirecionamento: IRedirecionamentoInicialRbac,
  ) => IPermissaoCargoRbac[];
};

/**
 * @description Composable para centralizar as lógicas e regras de negócio do controle de permissões de cargos.
 * @param pPermissoes - Referência reativa para o array de permissões do cargo.
 * @param pComportamentoPadrao - Comportamento padrão aplicado quando não houver regra explícita.
 * @returns {TUseControlePermissoesCargoReturn} Métodos e propriedades computadas de permissões.
 */
export function useControlePermissoesCargo(
  pPermissoes: Ref<IPermissaoCargoRbac[]>,
  pComportamentoPadrao: Ref<TComportamentoPadraoPermissao> | ComputedRef<TComportamentoPadraoPermissao>,
): TUseControlePermissoesCargoReturn {
  const router = useRouter();
  const { t } = useI18n();

  const SEPARADOR_CHAVE_PERMISSAO = '::';

  // Computadas
  const padraoLiberado = computed(() => pComportamentoPadrao.value === 'liberar');

  const rotasPermissao = computed<IItemPermissaoRota[]>(() => {
    return achatarNosRotas(montarNosRotas(router.options.routes));
  });

  const mapaRotas = computed(() => {
    return new Map(rotasPermissao.value.map((pRota) => [pRota.chave, pRota]));
  });

  // Funções Auxiliares de Árvore

  /**
   * @description Monta a árvore hierárquica de nós de rotas.
   * @param pRotas - Lista de rotas do roteador.
   * @param pNivel - Nível atual na hierarquia.
   * @param pPais - Lista de chaves das rotas superiores.
   * @returns {TNoRota[]} Lista de nós estruturados.
   */
  function montarNosRotas(pRotas: readonly RouteRecordRaw[], pNivel = 0, pPais: string[] = []): TNoRota[] {
    return pRotas
      .filter((pRota) => !pRota.meta?.hidden)
      .map((pRota) => {
        const chave = obterChaveRota(pRota);
        const filhos = montarNosRotas(pRota.children ?? [], pNivel + 1, [...pPais, chave]);

        return {
          chave,
          titulo: obterTituloRota(pRota),
          icone: String(pRota.meta?.icon ?? 'mdi-routes'),
          nivel: pNivel,
          pais: pPais,
          recursoApi: MAPEAMENTO_ROTAS_API_RBAC[chave],
          filhos,
        };
      });
  }

  /**
   * @description Achata uma lista de nós hierárquicos de rotas em um array linear.
   * @param pNos - Nós de rotas para achatar.
   * @returns {IItemPermissaoRota[]} Lista achatada de itens de permissão.
   */
  function achatarNosRotas(pNos: TNoRota[]): IItemPermissaoRota[] {
    return pNos.flatMap((pNo) => {
      const filhos = achatarNosRotas(pNo.filhos);

      return [
        {
          chave: pNo.chave,
          titulo: pNo.titulo,
          icone: pNo.icone,
          nivel: pNo.nivel,
          pais: pNo.pais,
          filhos: pNo.filhos.map((pFilho) => pFilho.chave),
          descendentes: filhos.map((pFilho) => pFilho.chave),
          recursoApi: pNo.recursoApi,
        },
        ...filhos,
      ];
    });
  }

  /**
   * @description Resolve a chave única de uma rota.
   * @param pRota - Configuração da rota.
   * @returns {string} Chave da rota.
   */
  function obterChaveRota(pRota: RouteRecordRaw): string {
    return String(pRota.name ?? pRota.path);
  }

  /**
   * @description Obtém o título traduzido de uma rota.
   * @param pRota - Configuração da rota.
   * @returns {string} Título da rota.
   */
  function obterTituloRota(pRota: RouteRecordRaw): string {
    const titulo = pRota.meta?.title;

    if (typeof titulo === 'string') {
      return t(titulo);
    }

    return String(pRota.name ?? pRota.path);
  }

  // Funções de Gerenciamento do Mapa de Permissões

  /**
   * @description Cria um mapa a partir do array atual de permissões para facilitação e performance.
   * @returns {Map<string, boolean>} Mapa com chaves estáveis de permissões.
   */
  function criarMapaPermissoes(): Map<string, boolean> {
    return new Map(
      pPermissoes.value.map((pPermissao) => [
        obterChavePermissao(pPermissao.recurso, pPermissao.acao),
        pPermissao.liberado,
      ]),
    );
  }

  /**
   * @description Gera a chave string estável de uma permissão.
   * @param pRecurso - Recurso da permissão.
   * @param pAcao - Ação da permissão.
   * @returns {string} Chave estável.
   */
  function obterChavePermissao(pRecurso: string, pAcao: string): string {
    return `${pRecurso}${SEPARADOR_CHAVE_PERMISSAO}${pAcao}`;
  }

  /**
   * @description Insere ou atualiza uma permissão lógica dentro de um mapa.
   * @param pMapaPermissoes - Mapa de permissões.
   * @param pRecurso - Recurso da permissão.
   * @param pAcao - Ação da permissão.
   * @param pLiberado - Status de liberação.
   */
  function definirPermissaoNoMapa(
    pMapaPermissoes: Map<string, boolean>,
    pRecurso: string,
    pAcao: string,
    pLiberado: boolean,
  ): void {
    pMapaPermissoes.set(obterChavePermissao(pRecurso, pAcao), pLiberado);
  }

  /**
   * @description Consulta o status de uma permissão dentro do mapa, aplicando fallback ao comportamento padrão.
   * @param pMapaPermissoes - Mapa de permissões.
   * @param pRecurso - Recurso da permissão.
   * @param pAcao - Ação da permissão.
   * @returns {boolean} Status de liberação.
   */
  function permissaoLiberadaNoMapa(pMapaPermissoes: Map<string, boolean>, pRecurso: string, pAcao: string): boolean {
    return pMapaPermissoes.get(obterChavePermissao(pRecurso, pAcao)) ?? padraoLiberado.value;
  }

  /**
   * @description Aplica as alterações contidas em um mapa de volta para a referência reativa de permissões do cargo.
   * @param pMapaPermissoes - Mapa modificado.
   */
  function aplicarMapaPermissoes(pMapaPermissoes: Map<string, boolean>): void {
    pPermissoes.value = Array.from(pMapaPermissoes.entries()).map(([pChave, pLiberado]) => {
      const [recurso, acao] = pChave.split(SEPARADOR_CHAVE_PERMISSAO);

      return {
        recurso,
        acao,
        liberado: pLiberado,
      };
    });
  }

  // Funções Públicas de Consulta

  /**
   * @description Verifica se uma ação genérica de um recurso está liberada.
   * @param pRecurso - Recurso da permissão.
   * @param pAcao - Ação da permissão.
   * @returns {boolean} True se liberado.
   */
  function permissaoLiberada(pRecurso: string, pAcao: string): boolean {
    const permissao = pPermissoes.value.find((pPerm) => pPerm.recurso === pRecurso && pPerm.acao === pAcao);
    return permissao?.liberado ?? padraoLiberado.value;
  }

  /**
   * @description Verifica se uma rota está liberada diretamente ou por algum filho descendente ativo.
   * @param pRota - Item de rota.
   * @returns {boolean} True se liberado.
   */
  function permissaoRotaLiberada(pRota: IItemPermissaoRota): boolean {
    if (permissaoLiberada(RECURSO_PERMISSAO_ROTAS_RBAC, pRota.chave)) {
      return true;
    }
    return pRota.descendentes.some((pDescendente) => permissaoLiberada(RECURSO_PERMISSAO_ROTAS_RBAC, pDescendente));
  }

  /**
   * @description Verifica se uma ação semântica de API está cadastrada no mapeamento do recurso.
   * @param pRota - Item de rota.
   * @param pAcao - Ação da API.
   * @returns {boolean} True se disponível.
   */
  function acaoApiDisponivel(pRota: IItemPermissaoRota, pAcao: TAcaoApiRbac): boolean {
    return Boolean(pRota.recursoApi?.acoes[pAcao]?.length);
  }

  /**
   * @description Verifica se todos os endpoints de uma ação de API estão com status de liberação ativo.
   * @param pRota - Item de rota.
   * @param pAcao - Ação da API.
   * @returns {boolean} True se liberado.
   */
  function acaoApiLiberada(pRota: IItemPermissaoRota, pAcao: TAcaoApiRbac): boolean {
    const endpoints = pRota.recursoApi?.acoes[pAcao] ?? [];

    if (!endpoints.length) {
      return false;
    }

    return endpoints.every((pEndpoint) =>
      permissaoLiberada(RECURSO_PERMISSAO_API_RBAC, montarAcaoEndpointApiRbac(pEndpoint)),
    );
  }

  /**
   * @description Regra de negócio para desabilitar o checkbox de uma ação na interface.
   * @param pRota - Item de rota.
   * @param pAcao - Ação da API a ser verificada.
   * @returns {boolean} True se desabilitada.
   */
  function isAcaoApiDesabilitada(pRota: IItemPermissaoRota, pAcao: TAcaoApiRbac): boolean {
    // 1. Se a ação não estiver disponível mapeada para a rota, fica desabilitada.
    if (!acaoApiDisponivel(pRota, pAcao)) {
      return true;
    }

    // 2. Se for a ação de 'consultar' (leitura), ela ficará desabilitada se qualquer
    // outra ação de escrita (gravar, editar ou remover) estiver ativada, para forçar a leitura ativa.
    if (pAcao === 'consultar') {
      const possuiEscrita =
        acaoApiLiberada(pRota, 'gravar') || acaoApiLiberada(pRota, 'editar') || acaoApiLiberada(pRota, 'remover');

      return possuiEscrita;
    }

    return false;
  }

  // Tradutores de Rótulo

  /**
   * @description Retorna a descrição traduzida de uma ação de API.
   * @param pAcao - Ação semântica.
   * @returns {string} Descrição amigável.
   */
  function obterDescricaoAcaoApi(pAcao: TAcaoApiRbac): string {
    return t(`forms.controlePermissoesCargo.rotas.acoes.${pAcao}`);
  }

  /**
   * @description Retorna a sigla de exibição da ação.
   * @param pAcao - Ação semântica.
   * @returns {string} Sigla de exibição (C, G, E, R).
   */
  function obterSiglaAcaoApi(pAcao: TAcaoApiRbac): string {
    const siglas: Record<TAcaoApiRbac, string> = {
      consultar: 'C',
      gravar: 'G',
      editar: 'E',
      remover: 'R',
    };
    return siglas[pAcao];
  }

  /**
   * @description Retorna a tradução da descrição de uma permissão geral.
   * @param pPermissao - Valor estável da permissão geral.
   * @returns {string} Descrição traduzida.
   */
  function obterDescricaoPermissaoGeral(pPermissao: string): string {
    return t(`forms.controlePermissoesCargo.funcionalidades.itens.${pPermissao}`);
  }

  // Funções de Atualização Ativas

  /**
   * @description Altera a permissão de uma rota em cascata para seus descendentes e pais.
   * @param pRota - Rota que está sofrendo alteração.
   * @param pLiberado - Novo status de liberação da rota.
   */
  function atualizarPermissaoRota(pRota: IItemPermissaoRota, pLiberado: boolean): void {
    const mapaPermissoes = criarMapaPermissoes();
    const rotasAfetadas = [pRota, ...pRota.descendentes.map((pChave) => mapaRotas.value.get(pChave))].filter(
      (pRotaAtual): pRotaAtual is IItemPermissaoRota => Boolean(pRotaAtual),
    );

    // Atualiza a rota e todos os descendentes
    rotasAfetadas.forEach((pRotaAtual) => {
      definirPermissaoNoMapa(mapaPermissoes, RECURSO_PERMISSAO_ROTAS_RBAC, pRotaAtual.chave, pLiberado);
      atualizarPermissoesApiDaRotaNoMapa(mapaPermissoes, pRotaAtual, pLiberado);
    });

    // Se liberada, força liberação das rotas pais para manter o caminho ativo
    if (pLiberado) {
      pRota.pais.forEach((pPai) => {
        definirPermissaoNoMapa(mapaPermissoes, RECURSO_PERMISSAO_ROTAS_RBAC, pPai, true);
      });
    } else {
      // Se bloqueada, sincroniza o estado das rotas pais pelo estado dos outros filhos restantes
      sincronizarPaisPeloEstadoDosFilhos(mapaPermissoes, pRota.pais);
    }

    aplicarMapaPermissoes(mapaPermissoes);
  }

  /**
   * @description Altera o status de liberação de uma ação semântica e seus endpoints de API.
   * @param pRota - Rota contendo a ação.
   * @param pAcao - Ação a ser alterada (consultar, gravar, etc).
   * @param pLiberado - Novo status de liberação.
   */
  function atualizarPermissaoAcaoRota(pRota: IItemPermissaoRota, pAcao: TAcaoApiRbac, pLiberado: boolean): void {
    const endpoints = pRota.recursoApi?.acoes[pAcao] ?? [];

    if (!endpoints.length) {
      return;
    }

    const mapaPermissoes = criarMapaPermissoes();
    definirPermissaoAcaoApiNoMapa(mapaPermissoes, pRota, pAcao, pLiberado);

    if (pLiberado) {
      // Força a liberação da própria rota e de seus pais
      definirPermissaoNoMapa(mapaPermissoes, RECURSO_PERMISSAO_ROTAS_RBAC, pRota.chave, true);
      pRota.pais.forEach((pPai) => definirPermissaoNoMapa(mapaPermissoes, RECURSO_PERMISSAO_ROTAS_RBAC, pPai, true));

      // Regra de negócio: Se habilitou ação de escrita, força a liberação de 'consultar'
      if (pAcao !== 'consultar') {
        definirPermissaoAcaoApiNoMapa(mapaPermissoes, pRota, 'consultar', true);
      }
    }

    aplicarMapaPermissoes(mapaPermissoes);
  }

  /**
   * @description Sincroniza e força as permissões da API de uma rota inteira.
   * @param pMapaPermissoes - Mapa em modificação.
   * @param pRota - Rota afetada.
   * @param pLiberado - Status de liberação aplicado.
   */
  function atualizarPermissoesApiDaRotaNoMapa(
    pMapaPermissoes: Map<string, boolean>,
    pRota: IItemPermissaoRota,
    pLiberado: boolean,
  ): void {
    if (!pRota.recursoApi) {
      return;
    }

    if (pLiberado) {
      // Por padrão, se a rota é liberada, força liberação de 'consultar' (leitura mínima)
      definirPermissaoAcaoApiNoMapa(pMapaPermissoes, pRota, 'consultar', true);
      return;
    }

    // Se a rota for bloqueada, bloqueia todas as ações dela
    ACOES_API_RBAC.forEach((pAcao) => definirPermissaoAcaoApiNoMapa(pMapaPermissoes, pRota, pAcao, false));
  }

  /**
   * @description Define o status de todos os endpoints vinculados a uma ação no mapa de permissões.
   * @param pMapaPermissoes - Mapa de permissões.
   * @param pRota - Rota contendo o recurso mapeado.
   * @param pAcao - Ação semântica.
   * @param pLiberado - Status de liberação.
   */
  function definirPermissaoAcaoApiNoMapa(
    pMapaPermissoes: Map<string, boolean>,
    pRota: IItemPermissaoRota,
    pAcao: TAcaoApiRbac,
    pLiberado: boolean,
  ): void {
    const endpoints = pRota.recursoApi?.acoes[pAcao] ?? [];

    endpoints.forEach((pEndpoint) => {
      definirPermissaoNoMapa(
        pMapaPermissoes,
        RECURSO_PERMISSAO_API_RBAC,
        montarAcaoEndpointApiRbac(pEndpoint),
        pLiberado,
      );
    });
  }

  /**
   * @description Sincroniza recursivamente o estado das rotas pais. Bloqueia pais que não tenham mais nenhum filho liberado.
   * @param pMapaPermissoes - Mapa de permissões.
   * @param pPais - Chaves das rotas pais.
   */
  function sincronizarPaisPeloEstadoDosFilhos(pMapaPermissoes: Map<string, boolean>, pPais: string[]): void {
    [...pPais].reverse().forEach((pPai) => {
      const rotaPai = mapaRotas.value.get(pPai);

      if (!rotaPai) {
        return;
      }

      const possuiFilhoLiberado = rotaPai.descendentes.some((pDescendente) =>
        permissaoLiberadaNoMapa(pMapaPermissoes, RECURSO_PERMISSAO_ROTAS_RBAC, pDescendente),
      );

      definirPermissaoNoMapa(pMapaPermissoes, RECURSO_PERMISSAO_ROTAS_RBAC, pPai, possuiFilhoLiberado);
    });
  }

  // Redirecionamento Inicial e Sincronização

  /**
   * @description Garante que a rota inicial configurada de redirecionamento não fique bloqueada para o cargo.
   * @param pPermissoesAtuais - Lista atual de permissões do cargo.
   * @param pRedirecionamento - Configuração atual de redirecionamento inicial.
   * @returns {IPermissaoCargoRbac[]} Permissões atualizadas com as liberações de rota e leitura aplicadas.
   */
  function obterPermissoesComRedirecionamentoInicialLiberado(
    pPermissoesAtuais: IPermissaoCargoRbac[],
    pRedirecionamento: IRedirecionamentoInicialRbac,
  ): IPermissaoCargoRbac[] {
    if (!pRedirecionamento.name) {
      return pPermissoesAtuais;
    }

    let permissoesAlteradas = false;

    // Converte permissões atuais em um mapa com a estrutura do modelo
    const mapaPermissoes = new Map(
      pPermissoesAtuais.map((pPermissao) => [
        montarChavePermissaoRbac(pPermissao.recurso, pPermissao.acao),
        { ...pPermissao },
      ]),
    );

    const rota = obterRotaPermissaoCargo(router.options.routes, pRedirecionamento.name);
    const chavesRotas = rota ? [...rota.pais, rota.chave] : [pRedirecionamento.name];
    const recursoApi = MAPEAMENTO_ROTAS_API_RBAC[pRedirecionamento.name];

    // Libera a rota de redirecionamento e todos os seus pais para permitir o carregamento do menu
    chavesRotas.forEach((pChaveRota) => {
      permissoesAlteradas =
        definirPermissaoLiberadaNoMapaRedirecionamento(mapaPermissoes, RECURSO_PERMISSAO_ROTAS_RBAC, pChaveRota) ||
        permissoesAlteradas;
    });

    // Libera por padrão as ações básicas de redirecionamento inicial (geralmente consultar e gravar)
    ACOES_API_REDIRECIONAMENTO_INICIAL_RBAC.forEach((pAcaoApi) => {
      recursoApi?.acoes[pAcaoApi]?.forEach((pEndpoint) => {
        permissoesAlteradas =
          definirPermissaoLiberadaNoMapaRedirecionamento(
            mapaPermissoes,
            RECURSO_PERMISSAO_API_RBAC,
            montarAcaoEndpointApiRbac(pEndpoint),
          ) || permissoesAlteradas;
      });
    });

    return permissoesAlteradas ? Array.from(mapaPermissoes.values()) : pPermissoesAtuais;
  }

  /**
   * @description Define uma permissão específica como activa no mapa temporário para a sincronização de redirecionamento.
   * @param pMapaPermissoes - Mapa de objetos de permissão.
   * @param pRecurso - Recurso da permissão.
   * @param pAcao - Ação da permissão.
   * @returns {boolean} True se houve alteração (permissão não estava ativa).
   */
  function definirPermissaoLiberadaNoMapaRedirecionamento(
    pMapaPermissoes: Map<string, IPermissaoCargoRbac>,
    pRecurso: string,
    pAcao: string,
  ): boolean {
    const chavePermissao = montarChavePermissaoRbac(pRecurso, pAcao);
    const permissaoAtual = pMapaPermissoes.get(chavePermissao);

    if (permissaoAtual?.liberado) {
      return false;
    }

    pMapaPermissoes.set(chavePermissao, {
      recurso: pRecurso,
      acao: pAcao,
      liberado: true,
    });

    return true;
  }

  /**
   * @description Resolve recursivamente a rota do roteador e seu relacionamento hierárquico.
   * @param pRotas - Configurações de rotas.
   * @param pNomeRota - Nome técnico da rota procurada.
   * @param pPais - Lista acumulada de chaves superiores.
   * @returns {{ chave: string, pais: string[] } | undefined} Relacionamento hierárquico resolvido ou undefined.
   */
  function obterRotaPermissaoCargo(
    pRotas: readonly RouteRecordRaw[],
    pNomeRota: string,
    pPais: string[] = [],
  ): { chave: string; pais: string[] } | undefined {
    for (const rota of pRotas) {
      const chave = String(rota.name ?? rota.path);

      if (chave === pNomeRota) {
        return {
          chave,
          pais: pPais,
        };
      }

      const rotaFilha = obterRotaPermissaoCargo(rota.children ?? [], pNomeRota, [...pPais, chave]);

      if (rotaFilha) {
        return rotaFilha;
      }
    }

    return undefined;
  }

  /**
   * @description Define/adiciona o status de liberação de uma permissão avulsa direta (ex: permissões gerais).
   * @param pRecurso - Nome do recurso.
   * @param pAcao - Ação do recurso.
   * @param pLiberado - Status de liberação.
   */
  function definirPermissao(pRecurso: string, pAcao: string, pLiberado: boolean): void {
    const permissoesAtualizadas = pPermissoes.value.filter(
      (pPermissao) => !(pPermissao.recurso === pRecurso && pPermissao.acao === pAcao),
    );

    permissoesAtualizadas.push({
      recurso: pRecurso,
      acao: pAcao,
      liberado: pLiberado,
    });

    pPermissoes.value = permissoesAtualizadas;
  }

  return {
    rotasPermissao,
    mapaRotas,
    permissaoLiberada,
    permissaoRotaLiberada,
    acaoApiDisponivel,
    acaoApiLiberada,
    isAcaoApiDesabilitada,
    obterDescricaoAcaoApi,
    obterSiglaAcaoApi,
    obterDescricaoPermissaoGeral,
    definirPermissao,
    atualizarPermissaoRota,
    atualizarPermissaoAcaoRota,
    obterPermissoesComRedirecionamentoInicialLiberado,
  };
}
