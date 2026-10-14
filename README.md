# 🧙‍♂️ MTG Manager API

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Fastify](https://img.shields.io/badge/Fastify-5.x-black.svg)](https://fastify.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-6.x-2D3748.svg)](https://www.prisma.io/)
[![Zod](https://img.shields.io/badge/Zod-4.x-3E67B1.svg)](https://zod.dev/)
[![Clean Architecture](https://img.shields.io/badge/Architecture-Clean%20Architecture-green.svg)](#arquitetura)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Projeto Final de Backend & Arquitetura de Software**  
> **Instituição:** Universidade Federal Fluminense (UFF) — Instituto de Ciência e Tecnologia (ICT) / RCM  
> **Docente:** Prof. Carlos Eduardo Cardoso  
> **Autor:** Bernardo Lannes (`bernardolannes2003@gmail.com`)

---

## 📌 Visão Geral do Sistema

A **MTG Manager API** é uma aplicação backend moderna desenvolvida com o ecossistema **Node.js**, **TypeScript (strict mode)** e **Fastify**. O objetivo do sistema é permitir que **Jogadores (Planeswalkers)** realizem cadastros, gerenciem suas coleções e construam seus decks com validações de regras oficiais de Magic: The Gathering, integrando dados reais da **Scryfall API** para validação de atributos oficiais e persistência relacional com **PostgreSQL + Prisma ORM**.

O projeto aplica princípios rigorosos de **Clean Architecture**, **SOLID**, **Padrões de Projeto**, **Validação com Zod** e **Tratamento Global de Erros**.

---

## 🏛️ Arquitetura do Sistema (Clean Architecture)

```text
src/
├── domain/                    # 🟢 Camada de Domínio (Entidades e Regras de Negócio)
│   ├── entities/
│   │   ├── card.entity.ts     # Entidade Card (atributos e invariantes de MTG)
│   │   └── player.entity.ts   # Entidade Player com regras de deck (limite 60 cartas e máx 4 cópias)
│   ├── repositories/
│   │   ├── card.repository.interface.ts    # ICardRepository
│   │   └── player.repository.interface.ts  # IPlayerRepository
│   ├── gateways/
│   │   └── scryfall.gateway.interface.ts   # IScryfallGateway
│   ├── errors/
│   │   └── domain.error.ts    # AppError base e exceções especializadas
│   └── index.ts
│
├── application/               # 🔵 Camada de Aplicação (Casos de Uso e DTOs)
│   ├── dtos/
│   │   ├── card.dto.ts        # DTOs de Cartas e CardMapper
│   │   └── player.dto.ts      # DTOs de Jogador/Deck e PlayerMapper
│   ├── use-cases/
│   │   ├── search-scryfall.use-case.ts     # Consulta Scryfall API
│   │   ├── create-player.use-case.ts       # Criação de jogador
│   │   ├── add-card-to-deck.use-case.ts    # Adição de carta ao deck com regras de negócio
│   │   ├── get-player-deck.use-case.ts     # Listagem do deck ativo
│   │   ├── list-cards.use-case.ts
│   │   ├── get-card-by-id.use-case.ts
│   │   ├── create-card.use-case.ts
│   │   ├── update-card.use-case.ts
│   │   └── delete-card.use-case.ts
│   └── index.ts
│
├── infrastructure/            # 🟠 Camada de Infraestrutura (Prisma, Scryfall, In-Memory)
│   ├── database/
│   │   └── prisma.client.ts   # Singleton do PrismaClient
│   ├── providers/
│   │   └── scryfall.provider.ts # Implementação de IScryfallGateway via Fetch API
│   ├── repositories/
│   │   ├── in-memory-card.repository.ts
│   │   ├── in-memory-player.repository.ts
│   │   ├── prisma-card.repository.ts      # Persistência relacional de cartas
│   │   └── prisma-player.repository.ts    # Persistência relacional de jogadores e decks
│   └── index.ts
│
└── main/                      # 🔴 Camada Principal (Fastify, Zod, OpenAPI e Factories)
    ├── config/
    │   └── app.ts             # Fastify, Swagger, CORS e Global Error Handler (AppError/Zod)
    ├── controllers/
    │   ├── card.controller.ts
    │   ├── player.controller.ts
    │   └── scryfall.controller.ts
    ├── factories/
    │   ├── repository.factory.ts # Factory para alternância transparente In-Memory / Prisma
    │   ├── card.factory.ts
    │   ├── player.factory.ts
    │   └── scryfall.factory.ts
    ├── routes/
    │   ├── card.routes.ts
    │   ├── player.routes.ts   # Rotas de jogadores e decks
    │   └── scryfall.routes.ts # Rotas de consulta à Scryfall API
    ├── schemas/
    │   ├── openapi.schemas.ts # Documentação Swagger / OpenAPI 3.0
    │   └── zod/schemas.ts     # Schemas Zod para validação rigorosa de payloads
    ├── validators/
    │   └── zod.validator.ts   # Helper de execução Zod
    └── server.ts              # Ponto de entrada da aplicação
```

---

## 🗄️ Banco de Dados & Docker (PostgreSQL + Prisma)

O projeto inclui configuração pronta para **PostgreSQL + Prisma ORM**:

### Subir o PostgreSQL via Docker (Opcional)
```bash
docker compose up -d
```

### Migrações e Prisma Client
```bash
# Copie o arquivo de variáveis de ambiente
cp .env.example .env

# Gere os tipos do Prisma Client
npx prisma generate

# Sincronize o banco de dados
npx prisma db push
```

> **Nota de Portabilidade:** O sistema possui alternância transparente de repositórios via `repository.factory.ts`. Se `USE_PRISMA=true`, utiliza o `PrismaCardRepository` e `PrismaPlayerRepository` conectados ao PostgreSQL; caso contrário, roda imediatamente com os repositórios `InMemory` sem necessidade de banco externo.

---

## 🚀 Como Executar o Projeto

```bash
# 1. Instalar dependências
npm install

# 2. Modo Desenvolvimento (com hot reload e path aliases)
npm run dev

# 3. Build de Produção
npm run build

# 4. Verificação de Lint (0 erros)
npm run lint

# 5. Formatação com Prettier
npm run format
```

---

## 📚 Documentação Interativa (Swagger UI)

Acesse a documentação interativa em:  
👉 **[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

---

## 📡 Endpoints da API

### 1. Integração com a Scryfall API Oficial
- **`GET /api/v1/scryfall/search?name=Black Lotus`**
  - Consulta a Scryfall pública oficial em tempo real e retorna o DTO formatado com imagem, CMC, tipo, texto e atributos.

### 2. Gerenciamento de Jogadores
- **`POST /api/v1/players`**
  - Cadastro de novo jogador no banco de dados com validação de formato de e-mail e nome.
  - **Body (Validado com Zod):**
  ```json
  {
    "name": "Bernardo Lannes",
    "email": "bernardo@planeswalker.com"
  }
  ```

### 3. Montagem de Decks (com Regras de Negócio de MTG)
- **`POST /api/v1/players/:playerId/deck/cards`**
  - Adiciona uma carta ao deck do jogador.
  - **Body (Validado com Zod):**
  ```json
  {
    "cardName": "Counterspell",
    "quantity": 4
  }
  ```
  - **Regras de Negócio de MTG Validadas:**
    - Busca dados oficiais da carta na Scryfall API.
    - Valida limite do deck (máx. 60 cartas no deck ativo).
    - Valida limite de cópias (máx. 4 cópias de cartas não-terreno básico).
    - Terrenos básicos (*Plains, Island, Swamp, Mountain, Forest, Wastes*) são isentos da regra de 4 cópias.
    - Persiste a carta no banco de dados associada ao jogador e ao seu deck.

### 4. Consulta do Deck Ativo
- **`GET /api/v1/players/:playerId/deck`**
  - Retorna o deck completo com total de cartas, quantidades e objetos de carta formatados.

### 5. Catálogo Local de Cartas
- `GET /api/v1/cards` — Lista cartas do catálogo local com filtros via `req.query` (`?type=`, `?color=`, `?rarity=`, `?set=`, `?name=`).
- `GET /api/v1/cards/:id` — Busca carta local por ID.
- `POST /api/v1/cards` — Cadastro manual no catálogo local.
- `PUT /api/v1/cards/:id` — Atualização no catálogo local.
- `DELETE /api/v1/cards/:id` — Remoção do catálogo local.

---

## 🗓️ Roteiro das Entregas (Checkpoints)

- [x] **Entrega 1:** Clean Architecture, Repositório In-Memory, Contrato REST e Swagger.
- [x] **Entrega 2:** Persistência Relacional (PostgreSQL + Prisma ORM), Validação com Zod, Integração Scryfall API Gateway, Regras de Negócio de Construção de Decks e Middleware Global de Erros (`AppError`).
- [ ] **Entrega 3:** Autenticação e Segurança (JWT, bcrypt/argon2, Helmet, CORS, Rate Limiting).
- [ ] **Entrega 4:** Testes Automatizados (Vitest/Supertest), Docker, Docker Compose e CI/CD com GitHub Actions.
