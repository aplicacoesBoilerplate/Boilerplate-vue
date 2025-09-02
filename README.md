# 👋 Olá! Seja bem-vindo ao meu repositório!

#### 📚 Este repositório contém o frontend de uma aplicação voltada para o controle de saídas esporádicas de funcionários em uma empresa.

---

<details>
  <summary><h2>📌 Fonte - <em>Dir.: src </em></h2></summary>

## 🛠 Separação dos arquivos e suas responsabilidade

Este projeto utiliza conceitos de **CSR e SPA** aplicados com o framework **VueJs** na versão 3. <br>
Foram aplicados utilização do **cliclo de vida** do componente, **método de renderização pelo cliente**, **composition API**, **comunicação entre componentes usando defineModel**. <br>
Além disso também temos os **services** capazes de se comunicar com o [backend](https://gitlab.com/controle.saida/backend) **via axios**, classes de **diretivas customizadas** para tratamento do formato de dados em inputs, storages com o **Pinia**, <br>
roteamento com o **Vue router**, classes utilitárias com diversas funcionalidades como:
- Tratamento de formatação de data;
- gerenciamento de inatividade do usuário;
- Remover atributos indefinidos;
- Gerador de arquivos PDF para salvar emissões de relatórios;
- Rules para definir todas as restrições em inputs.

---

### 📋 Estrutura

Os componentes com a terminação `View` seriam em um cenário fechado os componentes pais. <br>
Enquanto os componentes no diretório <em>src/components</em> são os componentes filhos que podem ser reaproveitados em vários componentes pais ou até mesmo em outros filhos.<br>

### 🧩 Demais Funções Implementadas

#### ● Redirecionamento inteligente
▶Com base no nível de permissão do usuário eu posso redirecionar ele para uma rota mais relevante as atividades geralmente relacionadas a alguém com a permissão definida.

#### ● Gerador de relatório
▶O backend alimenta um componente complexo com um método que identifica as informações do modelo de relatório selecionado pelo cliente, com base nisso temos as tabelas que podemos emitir filtros, quais os campos, as condições aceitas por cada campo e a lógica de controle dos filtros aplicados para a emissão do relatório.

#### ● Salvar relatório em PDF
▶Existe uma classe utilitária que salva o conteúdo da div de resposta da emissão de relatório e o salva em um arquivo .pdf.

#### ● Integração com uma API não oficial do WhatsApp
▶WppConnect é usado pelo backend para envio de mensagens, mas também temos a possibilidade de: 
- Consulta de status da sessão de conexão com o WhatsApp pelo dashboard (disponível apenas para administradores);
- Abrir Sessão automaticamente se o retorno do statos for "CLOSED";
- Conexão via qrcode.

</details>

<details>
  <summary><h2>📌 Executando o projeto - <em>Localmente</em></h2></summary>

## 🛠 Localmente

O **compose** deste projeto descrito no [backend](https://gitlab.com/controle.saida/backend) já cria uma **orquestração** de 5 containers, entre eles o frontend já está envolvido, mas ainda podemos executar localmente, contanto que a aplicação backend também esteja rodando

#### Crie na raiz do projeo, um arquivo .env:

```dotenv
VITE_API_URL="endereço da API"
VITE_DOMAIN_EMAIL="@GMAIL.COM"
```

#### Depois basta rodar os comandos no prompt:

```cmd
npm install
npm run dev
```

---

</details>
