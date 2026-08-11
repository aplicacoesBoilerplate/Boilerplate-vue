# Correção do drawer de ações do GenericView

## Contexto

O `GenericView.vue` agrupa ações de cabeçalho no `BtnActionDrawer.vue`. Na tela de usuários, a ação personalizada de alternar gráficos continua visível quando o drawer está fechado.

## Causa raiz

O slot nomeado `list-header-actions` possui dois outlets no `GenericView.vue`: um diretamente no cabeçalho e outro dentro do `BtnActionDrawer`. O Vue renderiza o conteúdo fornecido em cada outlet. Assim, uma cópia do botão de gráficos fica fora do drawer e não participa do seu estado aberto ou fechado.

## Requisitos

- Quando fechado, o drawer deve exibir somente seu botão principal.
- Quando aberto por hover ou pelo estado forçado, deve exibir todas as ações agrupadas.
- Ações personalizadas, gráficos, exportação e criação devem permanecer funcionais.
- O conteúdo de `list-header-actions` deve ser renderizado uma única vez.
- A correção não deve alterar o contrato público do `BtnActionDrawer`.

## Desenho

O `GenericView` continuará responsável por reunir as ações do cabeçalho, enquanto o `BtnActionDrawer` continuará responsável apenas pela apresentação e transição aberta/fechada.

O outlet externo de `list-header-actions` será removido. O único outlet permanecerá dentro do conteúdo expansível do drawer. A condição que cria o drawer passará a considerar todas as fontes de ações efetivas:

- slot `list-header-actions`;
- gráfico habilitado;
- exportação habilitada com serviço configurado;
- novo registro habilitado com slot ativador disponível.

Não haverá mudança em `BtnActionDrawer.vue`, pois seu `v-if` já remove o conteúdo expansível quando não há hover nem abertura forçada.

## Fluxo de estado

1. `GenericView` detecta se existe ao menos uma ação configurada.
2. O drawer é montado e recebe todas as ações em seu slot padrão.
3. Fechado, somente o botão principal permanece renderizado visualmente.
4. Em hover ou abertura forçada, o `v-expand-x-transition` mostra o grupo de ações.
5. Cada ação conserva seus eventos e permissões atuais.

## Casos de borda

- Sem ações configuradas, o drawer não deve ser montado.
- Um slot personalizado sem ações nativas ainda deve criar o drawer.
- Exportação isolada deve criar o drawer somente quando o serviço existir.
- `exibirNovoRegistro="false"` não deve criar um drawer vazio apenas porque existe um slot ativador.

## Testes

Será criado um teste de regressão com Playwright para verificar o fluxo real:

1. abrir a tela com `GenericView` e ação de gráfico;
2. confirmar que, fechado, o botão de gráfico não está visível e o botão principal está;
3. mover o ponteiro sobre o drawer e confirmar que o botão de gráfico aparece;
4. retirar o ponteiro e confirmar que o botão volta a ficar oculto;
5. validar que não existem duas instâncias visíveis da ação.

Também serão executados ESLint direcionado, type-check e build do frontend.

## Fora de escopo

- Alterar ícones, cores ou animações do drawer.
- Refatorar outras ações do cabeçalho.
- Modificar regras de permissão ou o comportamento dos gráficos.
