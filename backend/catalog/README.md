# Architecture

```bash
.
├── application
│   ├── factory
│   │   └── RepositoryFactory.ts
│   ├── repository
│   │   └── ProductRepository.ts
│   └── usecase
│       ├── GetProducts.ts
│       └── GetProduct.ts
├── domain
│   └── entity
│       ├── DigitalProduct.ts
│       └── Product.ts
├── infra
│   ├── database
│   │   ├── DatabaseConnection.ts
│   │   ├── PgPromiseAdapter.ts
│   │   ├── SqliteAdapter.ts
│   │   └── sqlite_init.ts
│   ├── factory
│   │   ├── DatabaseRepositoryFactory.ts
│   │   └── UsecaseFactory.ts
│   ├── http
│   │   ├── ExpressAdapter.ts
│   │   ├── HapiAdapter.ts
│   │   ├── HttpController.ts
│   │   ├── HttpServer.ts
│   │   └── openapi.ts
│   ├── presenter
│   │   ├── CsvPresenter.ts
│   │   ├── JsonPresenter.ts
│   │   └── Presenter.ts
│   └── repository
│       ├── ProductRepositoryDatabase.ts
│       └── ProductRepositorySqlite.ts
└── main_api.ts

```

## Como rodar a aplicação

Pré-requisitos:

### 1) Instalar dependências

```bash
npm install
```

### 2) Banco de dados SQLite

Um arquivo `catalog.sqlite` será criado na raiz do projeto e a tabela `product` será inicializada automaticamente com um registro de exemplo.

```bash
# subir com SQLite
npm run start:sqlite

# ou manualmente via variáveis de ambiente
DB=sqlite DB_FILE=./catalog.sqlite npm start
```

O servidor sobe na porta `3001` (Express por padrão). Endpoints:

-   GET http://localhost:3001/products — lista produtos
-   GET http://localhost:3001/products/:idProduct — busca um produto

Para `GET /products`, envie o header `Content-Type` como:

-   `application/json` para JSON
-   `text/csv` para CSV

Observações:

-   O repositório para SQLite usa tabela `product` (sem schema).
-   Para usar ao Postgres, basta usar `npm start`/`npm run dev` sem `DB=sqlite`.

### Documentação Swagger

Após subir o servidor (Postgres ou SQLite), acesse:

```
http://localhost:3001/docs
```

Endpoints documentados:

-   `GET /products`
-   `GET /products/{idProduct}`

Para CSV em `/products` inclua `Content-Type: text/csv` (caso contrário retorna JSON). A página do Swagger mostra o formato JSON.

### 3) Testes

```bash
npm test
```

### Alternativa: rodar com Postgres

### 1) Banco de dados (opcional via Docker)

Se não tiver um PostgreSQL local com o banco `app`:

```bash
# Subir Postgres no Docker
docker run -d --name postgres \
	-e POSTGRES_PASSWORD=123456 \
	-e POSTGRES_DB=app \
	-p 5432:5432 postgres:16

# Criar schema e tabela esperados pela aplicação
docker exec -i postgres psql -U postgres -d app <<'SQL'
create schema if not exists cccat11;
create table if not exists cccat11.product (
	id_product integer primary key,
	description text not null,
	price numeric not null,
	width integer,
	height integer,
	length integer,
	weight numeric
);
insert into cccat11.product (id_product, description, price, width, height, length, weight)
values (1, 'Product A', 1000, 100, 30, 10, 3)
on conflict (id_product) do nothing;
SQL
```

Obs.: A URL do banco está fixa em `src/infra/database/PgPromiseAdapter.ts`. Ajuste se necessário.

### 2) Rodar o servidor

```bash
# modo desenvolvimento (auto-reload)
npm run dev

# ou modo simples
npm start
```

O servidor sobe na porta `3001` (Express por padrão). Endpoints:

-   GET http://localhost:3001/products — lista produtos
-   GET http://localhost:3001/products/:idProduct — busca um produto

Para `GET /products`, envie o header `Content-Type` como:

-   `application/json` para JSON
-   `text/csv` para CSV

### 3) Testes

```bash
npm test
```

Os testes de integração acessam o banco definido acima.
