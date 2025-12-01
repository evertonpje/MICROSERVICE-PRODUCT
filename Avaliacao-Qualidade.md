Documentação Técnica do Projeto (Microservices)
Este documento resume a stack tecnológica, arquitetura, configuração de banco de dados e estratégias de consistência utilizadas no ecossistema de microsserviços (Catalog, Auth, Checkout).

1. Linguagem e Ferramentas
Base: Node.js com TypeScript.
Gerenciamento de Pacotes: npm.
Bibliotecas Principais:
typescript (Linguagem)
ts-node (Execução direta de TS)
ts-jest (Testes unitários e de integração)
Evidência: Verificado via package.json e extensão de arquivos *.ts.

2. Configuração e Execução
Instalação
Em cada pasta de serviço, execute via terminal (PowerShell/Bash):
Bash
npm install

Comandos de Execução
Ambiente
Comando
Descrição
Desenvolvimento
npm run dev
Usa nodemon para hot-reload (ex: Catalog).
Produção/Start
npm start
Executa diretamente via ts-node (ex: src/main_api.ts).
Teste Local (SQLite)
npm run start:sqlite
(Catalog) Define DB=sqlite e DB_FILE.

Variáveis de Ambiente Importantes
DB: Define o driver de banco (Padrão: postgres).
DB_FILE: Define o caminho do arquivo ou :memory: para SQLite.

3. Arquitetura de Software
Estilo: Microservices.
Design Interno: Hexagonal / Clean Architecture.
Estrutura de Pastas
A separação de responsabilidades segue estritamente as camadas para facilitar testes e desacoplamento:
src/domain: Entidades de negócio (Core).
src/application: Casos de uso (Use Cases) e Factories de Use Cases.
src/infra: Adaptadores e implementações concretas.
Adapters: Database, HTTP, Factory, Repository, Presenter.
Inicialização e Injeção de Dependência
O entry-point (main_api.ts) é responsável por compor o grafo de dependências:
Instancia Adaptadores de DB (Postgres/SQLite).
Instancia RepositoryFactory (Abstração do acesso a dados).
Instancia UsecaseFactory.
Inicia o Servidor HTTP (Express ou Hapi) e conecta os Controllers.
Nota: O uso do padrão Factory (DatabaseRepositoryFactory, UsecaseFactory) blinda o domínio contra acoplamento direto com o Banco de Dados ou Framework Web.

4. Banco de Dados
Adaptadores Suportados
PostgreSQL (via pg-promise):
Classe: PgPromiseAdapter.
Atenção: A string de conexão está hardcoded (postgres://postgres:123456@localhost:5432/app). Necessário refatorar para ENV vars.
SQLite (via sqlite3):
Classe: SqliteAdapter.
Modos: Arquivo físico ou :memory:.
Script de Setup: initSqliteSchema(connection) cria tabelas e seeds iniciais automaticamente.
Como rodar localmente
Opção A (Recomendada para Dev): Usar SQLite definindo DB=sqlite.
Opção B (Postgres): Subir container Docker na porta 5432, banco app, user postgres, senha 123456.

5. Funcionalidades por Serviço
📦 Catalog
Responsabilidade: Listagem e detalhe de produtos.
Principais Endpoints: GET /products, GET /products/:id.
Testes Relevantes: GetProducts.test.ts, ProductRepositoryDatabase.test.ts.
🔐 Auth
Responsabilidade: Autenticação e Criação de contas.
Principais Endpoints: Signup, Verify.
Componentes Chave: TokenGenerator, validação de senha.
🛒 Checkout
Responsabilidade: Orquestração de pedidos.
Fluxo: Processamento de itens, cálculo de frete, validação de cupom.
Testes Relevantes: Checkout.test.ts, ValidateCoupon.test.ts.

6. Testes Automatizados
Framework: Jest + ts-jest.
Execução
Na pasta do serviço:
Bash
npm test

Cobertura e Estratégia
Unitários: Testam regras de negócio nas Entidades (ex: Product.test.ts, Password.test.ts).
Integração: Testam a API REST e persistência real/mockada (ver pasta test/integration).
A arquitetura permite testar Use Cases isoladamente injetando repositórios fake ou em memória.

7. Qualidade de Código (Linting)
Frontend: Possui ESLint configurado.
Backend: ⚠️ Não possui configuração de Linter.
Recomendação: Instalar eslint, @typescript-eslint e prettier em cada microsserviço e adicionar script npm run lint no package.json.


8. Estratégia Avançada: Transações Distribuídas
Como o sistema não possui transações ACID distribuídas entre os serviços (Catalog, Auth, Checkout), recomenda-se a seguinte abordagem de Consistência Eventual:
Recomendações de Implementação
Padrão Outbox + CDC (Change Data Capture):
Salve o evento na mesma transação do banco de dados local (tabela outbox).
Um worker lê essa tabela e publica no Broker (ex: RabbitMQ).
Sagas (Coreografia ou Orquestração):
Gerenciar o ciclo de vida do pedido. Se Pagamento falhar, disparar evento de compensação para estornar Estoque.
Resiliência:
Garantir processamento Idempotente nos consumidores (para suportar retries sem duplicar pedidos).
Utilizar ack/nack manuais nas filas.


