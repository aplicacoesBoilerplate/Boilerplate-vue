# Agents Context & Skills Configuration

Este arquivo define os papéis, habilidades, padrões e restrições dos agentes de IA, Global para todos os projetos.

O agente deve usar este arquivo para calibrar respostas, sugestões de arquitetura, geração de código, refatorações e revisões técnicas de acordo com os padrões do projeto.

---

# 1. Global Agent Guidelines

Estas regras são globais e devem ser aplicadas por todos os agentes, independentemente da stack, camada ou linguagem utilizada.

## 1.1 Linguagem de comunicação

* Toda comunicação com o usuário deve ser feita em português do Brasil (`pt-BR`).
* Termos técnicos podem ser mantidos em inglês quando forem nomes oficiais de tecnologias, APIs, bibliotecas, padrões ou conceitos amplamente usados pela comunidade.
* As respostas devem priorizar clareza, objetividade e explicação progressiva.
* Quando houver sugestão de código, explicar antes o motivo da abordagem e depois apresentar o exemplo.

---

## 1.2 Nomenclatura global

Os nomes devem ser consistentes, previsíveis e fáceis de localizar no projeto.

### Types

Types devem começar com o prefixo `T`.

```ts
export type TUserFilters = {
  name: string;
};
```

### Interfaces

Interfaces devem começar com o prefixo `I`.

```ts
export interface IUserResponse {
  id: number;
}
```

### Classes

Classes devem começar com o prefixo `C`.

```ts
export class CUserService {
  // ...
}
```

### Constantes

Constantes devem usar `UPPER_CASE`.

```ts
export const DEFAULT_LIMIT = 20;
```

### Atributos, variáveis e métodos

Atributos, variáveis e métodos devem usar `camelCase`.

```ts
const currentUserName = 'Gerson';

function findUserById(pId: number): void {
  // ...
}
```

### Parâmetros e assinaturas de funções

Os parâmetros de funções devem sempre começar com um prefixo `p`, Além disso, as funções sempre devem ter a tipagem forte e explicita, ressalva para as funções genéricas onde o tipo é repassado na chamada.

```ts
function findUserById(pId: number): void {
  // ...
}
```

### Arquivos

O nome do arquivo deve acompanhar o nome do principal export declarado nele.

```ts
// TUserFilters.ts
export type TUserFilters = {
  name: string;
};

// IUserResponse.ts
export interface IUserResponse {
  id: number;
};

// CUserService.ts
export class CUserService {
  // ...
};

// DEFAULT_LIMIT.ts
export const DEFAULT_LIMIT = 20;
```

Quando o arquivo exportar múltiplos itens fortemente relacionados, o nome deve representar o domínio ou responsabilidade principal do arquivo.

```ts
// user.models.ts
export type TUserFilters = {
  name: string;
};

export interface IUserResponse {
  id: number;
};
```

---

## 1.3 Comentários e documentação interna

Comentários devem explicar responsabilidades, contratos e decisões que não sejam imediatamente óbvias.

Evitar comentários que apenas repetem o nome do atributo, método, função, classe, type ou interface.

A documentação de símbolos TypeScript deve usar JSDoc em bloco único imediatamente acima da declaração documentada.

Não documentar atributos individualmente dentro do corpo de `type`, `interface`, DTO, props, emits, models ou exposes. A descrição dos atributos deve ficar no bloco JSDoc do símbolo pai usando `@property`.

### Types, interfaces, DTOs e contratos de objeto

Types, interfaces, DTOs e contratos de objeto devem concentrar a documentação em um único bloco JSDoc acima da declaração.

Para cada atributo documentado, usar `@property {TipoDoAtributo} nomeDoAtributo - Descrição objetiva do atributo.`

```ts
/**
 * @description Contrato de usuário retornado pelo backend.
 * @property {number} id - Identificador único do usuário no backend.
 * @property {string} name - Nome exibido na interface e usado em filtros textuais.
 */
export interface IUserResponse {
  id: number;
  name: string;
}
```

```ts
/**
 * @property {string} atributoDescricao - Atributo usado para exibir a descrição principal do registro.
 * @property {string} atributoValor - Atributo usado como valor aplicado no filtro.
 * @property {TRegistroConsulta} registro - Registro retornado pela consulta auxiliar.
 * @property {boolean} selecionado - Define se o registro está selecionado no filtro atual.
 */
type TProps = {
  atributoDescricao: string;
  atributoValor: string;
  registro: TRegistroConsulta;
  selecionado: boolean;
};
```

### Classes, funções e métodos

Classes, funções e métodos devem ser documentados com JSDoc em bloco único acima da declaração quando representarem responsabilidade pública, contrato reutilizável, regra de negócio ou comportamento que precise ser entendido em revisões futuras.

Usar:

* `@description` para explicar a responsabilidade geral.
* `@param nomeDoParametro Descrição do parâmetro.` para cada parâmetro.
* `@returns Descrição do retorno.` quando a função ou método retornar valor diferente de `void`.

```ts
/**
 * @description Serviço responsável por consultar usuários no backend.
 */
export class CUserService {
  /**
   * @description Busca usuários conforme os filtros informados.
   * @param pFilters Filtros aplicados na consulta de usuários.
   * @returns Lista de usuários retornada pelo backend.
   */
  public static async findAll(pFilters: TUserFilters): Promise<IUserResponse[]> {
    // ...
  }
}
```

```ts
/**
 * @description Normaliza o resultado da consulta auxiliar.
 * @param pResultado Resultado da consulta auxiliar.
 * @returns Resultado normalizado da consulta auxiliar.
 */
function normalizarResultadoConsulta(
  pResultado: IResultadoConsultaRegistrosFiltro<TRegistroConsulta> | TRegistroConsulta[],
): IResultadoConsultaRegistrosFiltro<TRegistroConsulta> {
  if (Array.isArray(pResultado)) {
    return {
      registros: pResultado,
      possuiMais: false,
    };
  }

  return pResultado;
}
```

### Props, emits, models e exposes

Em componentes, props, emits, models e exposes devem ter comentários quando representarem contrato público do componente.

A documentação deve ficar no bloco JSDoc do type/interface correspondente, usando `@property`, e não acima de cada propriedade.

```ts
/**
 * @property {boolean} loading - Define se o botão será exibido em estado de carregamento.
 */
type TProps = {
  loading: boolean;
};
```

```ts
/**
 * @property {[]} save - Emitido quando o usuário confirma a ação principal.
 */
type TEmits = {
  save: [];
};
```

### Decisões não óbvias

Comentários inline devem ser usados apenas para explicar regras de negócio pontuais, decisões arquiteturais, workarounds e comportamentos que podem gerar dúvida em revisões futuras.

```ts
// Usa o último item como cursor porque a paginação do endpoint é invertida.
const nextEntry = items.value.at(-1)?.id;
```

---

## 1.4 Organização de imports

Imports devem ficar no topo do arquivo, agrupados por responsabilidade e separados por uma linha em branco.

Cada grupo deve ser identificado por comentário.

Ordem global recomendada:

```ts
// Ecossistema
import { ref, computed } from 'vue';

// Stores
import { useUserStore } from '@/stores/useUserStore';

// Constantes
import { DEFAULT_LIMIT } from '@/constants/DEFAULT_LIMIT';

// Types e Interfaces
import type { TUserFilters } from '@/models/TUserFilters';
import type { IUserResponse } from '@/models/IUserResponse';

// Composables
import { useUsers } from '@/composables/useUsers';

// Utils
import { normalizeText } from '@/utils/normalizeText';

// Services
import { CUserService } from '@/services/CUserService';

// Componentes
import BaseButton from '@/components/base/BaseButton.vue';

// Outros
import dayjs from 'dayjs';
```

A nomenclatura dos grupos pode variar conforme a stack, mas a separação por responsabilidade deve ser mantida.

---

## 1.5 Tipagem forte

* Evitar `any`.
* Tipar parâmetros, retornos, callbacks, eventos e estruturas de dados.
* Retornos `void` também devem ser declarados quando melhorarem a clareza da assinatura.
* Types, interfaces, classes e enums reutilizáveis devem ser centralizados em diretórios próprios.
* Tipos locais só devem permanecer no arquivo quando forem exclusivos daquele contexto.

```ts
export class CUserService {
  public static async findAll(filters: TUserFilters): Promise<IUserResponse[]> {
    // ...
  }
}
```

---

## 1.6 Separação de responsabilidades

Cada camada deve ter uma responsabilidade clara.

* Services devem executar integrações externas, chamadas HTTP ou comunicação com infraestrutura.
* Services não devem manipular estado visual, snackbar, navegação ou comportamento de tela.
* Camadas próximas da UI podem lidar com loading, snackbar, redirecionamentos e mensagens para o usuário.
* Components, pages ou controllers não devem concentrar regras reutilizáveis quando elas puderem ser extraídas.
* Stores devem conter estado compartilhado, não detalhes de componentes específicos.
* Utils e formatters devem conter funções puras ou transformações reutilizáveis.

---

## 1.7 DRY e reutilização

Aplicar o princípio de DRY em:

* componentes;
* services;
* classes;
* funções;
* composables;
* stores;
* utils;
* formatters;
* mixins SCSS;
* validações;
* DTOs;
* models.

Sempre que uma regra se repetir ou puder ser reaproveitada, avaliar extração para uma camada mais apropriada.

---

# 2. TypeScript Guidelines

Estas regras se aplicam a arquivos TypeScript em qualquer camada do projeto.

## 2.1 Types e interfaces

* Usar `type` para composições, unions, assinaturas locais e estruturas flexíveis.
* Usar `interface` para contratos de objetos, DTOs, responses e estruturas que representem entidades.
* Todos os atributos devem usar `camelCase`.
* Exportar types e interfaces reutilizáveis.

```ts
export type TOrderDirection = 'asc' | 'desc';

/**
 * @description Parâmetros usados para consultas paginadas.
 * @property {string} nextEntry - Cursor usado para buscar a próxima página.
 * @property {number} limit - Quantidade máxima de registros retornados.
 * @property {TOrderDirection} order - Direção de ordenação aplicada na consulta.
 */
export interface IPaginatedRequest {
  nextEntry?: string;
  limit: number;
  order: TOrderDirection;
}
```

---

## 2.2 Classes

Classes devem iniciar com `C`.

```ts
/**
 * @description Classe utilitária responsável por formatar valores para exibição.
 */
export class CFormatters {
  /**
   * @description Formata um valor booleano para texto legível na interface.
   * @param pValue Valor booleano que será formatado.
   * @returns Texto correspondente ao valor booleano informado.
   */
  public static boolean(pValue: boolean): string {
    return pValue ? 'Sim' : 'Não';
  }
}
```

Classes utilitárias devem preferir métodos estáticos quando não houver necessidade real de instância.

---

## 2.3 Constantes

Constantes devem usar `UPPER_CASE`.

```ts
export const STORAGE_THEME_KEY = 'invoice:theme';
```

Quando uma constante representar uma coleção de opções, manter o nome em `UPPER_CASE`.

```ts
export const ORDER_DIRECTIONS = ['asc', 'desc'] as const;
```

---

# 3. Architecture Guidelines

Estas regras orientam a separação de responsabilidades entre camadas.

## 3.1 Services

Services devem ser encapsulados em classes quando representarem uma responsabilidade clara de integração ou domínio.

Quando a classe de service for responsável por requisições, seus métodos devem ser estáticos, evitando instanciar classes sem necessidade.

```ts
export class CUserService {
  public static async findAll(pFilters: TUserFilters): Promise<IUserResponse[]> {
    try {
      const response = await http.get<IUserResponse[]>('/users', {
        params: pFilters,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
```

Services devem:

* ter assinatura clara de parâmetros e retornos;
* capturar erro apenas para repassar quando necessário;
* não exibir snackbar;
* não navegar entre rotas;
* não manipular estado visual;
* não conhecer componentes;
* não concentrar tratamento de UX.

---

## 3.2 Requisições paginadas

Métodos com muitos parâmetros devem receber um objeto tipado.

```ts
/**
 * @description Parâmetros usados para consultar usuários de forma paginada.
 * @property {string} nextEntry - Cursor usado para buscar a próxima página.
 * @property {number} limit - Quantidade máxima de usuários retornados.
 * @property {TOrderDirection} order - Direção da ordenação.
 * @property {string} filter - Filtro textual aplicado sobre os usuários.
 */
export interface IUserPaginatedRequest {
  nextEntry?: string;
  limit: number;
  order: TOrderDirection;
  filter?: string;
}
```

Evitar métodos com assinaturas extensas.

```ts
// Evitar
findAll(nextEntry, limit, order, filter, status, createdAt);

// Preferir
findAll(params: IUserPaginatedRequest);
```

---

## 3.3 Formatters

Formatadores de dados devem ser centralizados em uma classe própria.

```ts
/**
 * @description Classe utilitária responsável por formatar valores para exibição.
 */
export class CFormatters {
  /**
   * @description Formata uma data para exibição.
   * @param pValue Data que será formatada.
   * @returns Data formatada para exibição.
   */
  public static date(pValue: string): string {
    // ...
  }

  /**
   * @description Formata um valor booleano para texto legível na interface.
   * @param pValue Valor booleano que será formatado.
   * @returns Texto correspondente ao valor booleano informado.
   */
  public static boolean(pValue: boolean): string {
    return pValue ? 'Sim' : 'Não';
  }
}
```

A classe de formatadores deve conter tratamentos reutilizáveis para datas, valores booleanos, moeda, números, documentos e outros valores recorrentes do sistema.

---

# 4. Frontend Agent — Vue 3 + Vuetify

## 4.1 Role

Desenvolvedor Frontend especialista em Progressive Web Apps, Vue 3, Vuetify, TypeScript, SCSS e interfaces reativas.

---

## 4.2 Skills & Stack

* Vue.js 3 com Composition API e `<script setup>`.
* Vuetify.
* TypeScript.
* SCSS.
* PWA com Service Workers e configuração de ícones no manifest.
* Pinia para estado compartilhado.
* Vue Router para navegação.

---

## 4.3 Guidelines específicas de Vue

### Estrutura do `<script setup>`

O `<script setup>` deve seguir uma ordem clara, separada por comentários.

Ordem recomendada:

```ts
// Types e Interfaces
/**
 * @property {boolean} loading - Define se o componente está em estado de carregamento.
 */
type TProps = {
  loading: boolean;
};

/**
 * @property {[]} save - Emitido quando o usuário confirma a ação principal.
 */
type TEmits = {
  save: [];
};

// Props
const props = defineProps<TProps>();

// Emits
const emit = defineEmits<TEmits>();

// Constantes
const DEFAULT_DELAY = 300;

// Reativas - Model
const model = defineModel<boolean>();

// Reativas - Ref
const search = ref('');

// Computadas
const canSubmit = computed(() => !props.loading && search.value.length > 0);

// Funções
function handleSave(): void {
  emit('save');
}

// Observadores
watch(search, () => {
  // ...
});

// Lifecycle Hooks
onMounted(() => {
  // ...
});

// Expose
defineExpose({
  handleSave,
});
```

Quando forem usados `defineModel` e `ref` no mesmo arquivo, separar como:

```ts
// Reativas - Model
const selectedId = defineModel<number | null>();

// Reativas - Ref
const loading = ref(false);
```

Quando houver apenas um tipo de reatividade, usar apenas:

```ts
// Reativas
const loading = ref(false);
```

---

## 4.4 Props e emits

`defineProps` e `defineEmits` devem ser declarados logo abaixo dos seus respectivos tipos.

Props devem vir antes de emits.

```ts
/**
 * @property {string} label - Texto exibido no botão.
 */
type TProps = {
  label: string;
};

const props = defineProps<TProps>();

/**
 * @property {[]} click - Emitido quando o usuário aciona o botão.
 */
type TEmits = {
  click: [];
};

const emit = defineEmits<TEmits>();
```

Eventos emitidos devem representar intenções de negócio, não detalhes de implementação.

Preferir:

```ts
emit('save');
emit('cancel');
```

Evitar:

```ts
emit('clickButton');
emit('closeModalButton');
```

---

## 4.5 Componentes

* Priorizar a criação de componentes reutilizáveis.
* Componentes Base devem ser genéricos e não conhecer regras de negócio.
* Quando um componente começar a depender de entidades específicas, deve ser promovido para componente de domínio.
* Componentes reutilizáveis devem ter comentário curto explicando sua responsabilidade geral.
* Slots principais devem ter seu efeito esperado documentado quando o comportamento não for óbvio.

---

## 4.6 Vuetify

* Priorizar componentes nativos do Vuetify antes de criar wrappers, grids manuais ou CSS estrutural próprio.
* Wrappers só devem existir quando encapsularem comportamento real, como loading, permissões, defaults, requisições ou regras reutilizáveis.
* Não sugerir bibliotecas de componentes de terceiros que fujam da base do Vuetify.
* Componentes de layout devem usar `useDisplay` e demais composables do Vuetify para responsividade sempre que possível.
* Hotkeys devem usar o composable `useHotkey` do Vuetify e ser registradas condicionalmente para desktop.
* Em mobile, evitar processamento e elementos visuais de atalhos que não agreguem à experiência.

---

## 4.7 Layout

* Manter o `App.vue` mínimo, preferencialmente apenas com `v-app` e `RouterView`.
* Qualquer tag estrutural adicional no `App.vue` deve ser debatida antes.
* Layouts devem controlar estrutura, responsividade, scroll e disposição macro da tela.
* Pages e components não devem compensar problemas estruturais com repetições de `d-flex`, paddings ou wrappers desnecessários.
* O scroll principal da aplicação deve ficar em `v-main` ou na área scrollable definida pelo layout.
* O scroll principal não deve ficar em `body`, `html` ou wrappers arbitrários.
* Controles de layout devem ter funções distintas entre desktop e mobile, evitando botões redundantes.

---

## 4.8 SCSS

* Arquivos SCSS de componentes devem ficar em arquivo separado com o mesmo nome do componente.
* O arquivo `.vue` deve importar o SCSS via tag `<style>` com `src`.
* O atributo `lang` deve respeitar a extensão do arquivo.
* Quando o estilo for local, usar `scoped`.

```vue
<style src="./MeuComponente.scss" scoped lang="scss"></style>
```

* Scrollbars devem ser discretas, com trilho transparente, sem botões de controle e definidas por mixins SCSS reutilizáveis.
* Estilizações de hover, active e estados interativos devem usar tokens ou paleta do Vuetify para manter compatibilidade com temas claro/escuro.

---

## 4.9 Pinia e estado compartilhado

Stores devem conter apenas estado compartilhado da aplicação.

Exemplos adequados:

* preferências do usuário;
* tema;
* idioma;
* estado persistente de layout;
* parâmetros globais de filtros;
* paginação compartilhada;
* comunicação entre componentes fora da hierarquia familiar;
* micro cache de listas genéricas.

Stores não devem:

* conhecer componentes;
* manipular detalhes de UI local;
* realizar chamadas HTTP diretamente quando a lógica puder ser encapsulada em composables;
* concentrar regras que pertençam a services, utils ou formatters.

Preferir actions pequenas e específicas.

---

## 4.10 Composables

Composables devem conter lógica reutilizável de estado ou comportamento.

Podem ser responsáveis por:

* preparar parâmetros para services;
* tratar erros;
* disparar snackbar;
* redirecionar para rotas como not found ou forbidden;
* controlar loading;
* encapsular regras reutilizáveis de UX;
* reutilizar formatadores em templates.

Não realizar chamadas HTTP diretamente em componentes quando a lógica puder ser encapsulada em composables.

Fluxo preferencial:

```txt
Component -> Store -> Composable -> Service
```

Responsabilidades:

* `Service`: realiza a chamada e repassa erros.
* `Composable`: trata parâmetros, erros e UX.
* `Store`: mantém estado compartilhado e orquestra dados persistentes.
* `Component`: usa dados e ações, mantendo o template limpo.

---

## 4.11 Reatividade e performance

* Evitar watchers quando uma computed resolver o problema.
* Evitar computed encadeadas desnecessariamente.
* Evitar renderização de listas sem `key`.
* Priorizar lazy loading para rotas e componentes pesados.
* Ao manipular estágios de UI, respeitar as regras de paginação do domínio.
* Em paginação invertida, usar o último índice da lista quando ele representar o cursor correto.

---

## 4.12 Loading e lock de requisições

Toda requisição acionada pela interface deve possuir lock para evitar disparos duplicados.

O lock deve ser visualmente perceptível para o usuário.

* Processos principais podem usar loading no botão, skeleton, progress ou overlay contextual.
* Processos em segundo plano devem mostrar algum feedback discreto.
* Loadings de segundo plano não devem bloquear a interação da tela inteira, salvo quando houver justificativa clara.

---

## 4.13 PWA

* Garantir responsividade nativa e suporte a dispositivos móveis.
* Configurar corretamente ícones no manifest.
* Ter atenção especial a `icon` e `badge` em notificações web push.
* Service Workers devem ser tratados com cuidado, especialmente em atualização, cache e notificações.

---

## 4.14 Navegação

* Itens de navegação devem ser derivados das rotas e seus metadados sempre que possível.
* Rotas com `children` devem suportar grupos recursivos.
* Metadados de rotas podem conter título, ícone, hotkey e regras de exibição.
* Preferências de usuário, como tema e estado persistente de layout, devem viver em stores Pinia e ser persistidas por utilitários centralizados de storage.
* Não espalhar acesso direto ao `localStorage` dentro de componentes.

---

# 5. Backend Agent — Java + Spring Boot

## 5.1 Role

Desenvolvedor Backend especialista em Java, Spring Boot, APIs REST, segurança, persistência, integrações e arquitetura em camadas.

---

## 5.2 Guidelines iniciais

* Controllers devem lidar com entrada e saída HTTP.
* Services devem conter regras de aplicação.
* Repositories devem lidar com persistência.
* DTOs devem representar contratos externos da API.
* Entities devem representar persistência e domínio conforme o desenho do projeto.
* Evitar regras de negócio diretamente em controllers.
* Evitar queries espalhadas fora das camadas responsáveis.
* Tipar contratos com clareza.
* Manter nomes consistentes entre DTOs, services, repositories e entidades.
* Não misturar responsabilidade de infraestrutura com regra de negócio.
* Tratamento de exceções deve ser centralizado quando possível.
