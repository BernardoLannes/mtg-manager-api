# 🧙‍♂️ MTG Manager API

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Fastify](https://img.shields.io/badge/Fastify-5.x-black.svg)](https://fastify.dev/)
[![Clean Architecture](https://img.shields.io/badge/Architecture-Clean%20Architecture-green.svg)](#arquitetura)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Projeto Final de Backend & Arquitetura de Software**  
> **Instituição:** Universidade Federal Fluminense (UFF) — Instituto de Ciência e Tecnologia (ICT) / RCM  
> **Docente:** Prof. Carlos Eduardo Cardoso  
> **Autor:** Bernardo Lannes (`bernardolannes2003@gmail.com`)

---

## 📌 Visão Geral

A **MTG Manager API** é uma aplicação backend moderna desenvolvida com **Node.js**, **TypeScript** e **Fastify**, fundamentada nos princípios de **Clean Architecture**, **SOLID** e **Design Patterns**.

O sistema tem como objetivo permitir o gerenciamento de coleções de cartas e construção de decks de **Magic: The Gathering (MTG)**, adaptando os requisitos do projeto com total fidelidade pedagógica aos critérios de avaliação da disciplina.

---

## 🗺️ Mapeamento de Domínio (Adaptação da Especificação)

| Especificação Original (PokéManager) | Adaptação no MTG (MTG Manager API) | Detalhes da Regra de Negócio |
| :--- | :--- | :--- |
| **Pokémon** (Catálogo) | **Carta (*Card*)** | Cartas de Magic com `name`, `manaCost`, `cmc`, `typeLine`, `colors`, `rarity`, `power`/`toughness`, etc. |
| **Catálogo In-Memory** (Entrega 1) | **`InMemoryCardRepository`** | Catálogo local em memória com suporte a filtros dinâmicos via `req.query`. |
| **PokéAPI** (Entrega 2) | **[Scryfall API](https://scryfall.com/docs/api)** | Integração com a API pública oficial da comunidade de Magic: The Gathering. |
| **Treinador** (*Trainer*) | **Planeswalker / Jogador** | Usuário que possui sua coleção de cartas e constrói seus decks. |
| **Time de até 6 Pokémons** | **Deck / Grimório** | Regras de validação de construção de decks (ex: máx. de 4 cópias da mesma carta exceto terrenos básicos). |

---

## 🏛️ Arquitetura do Sistema (Clean Architecture)

O projeto é estruturado em camadas concêntricas e independentes, respeitando estritamente a **Regra de Dependência** (o domínio nunca conhece detalhes externos):

```text
src/
├── domain/                    # 🟢 Camada de Domínio (Entidades e Regras de Negócio)
│   ├── entities/              # Entidade Card com encapsulamento e validações invariantes
│   ├── repositories/          # Interface ICardRepository e tipos de filtro
│   ├── errors/                # Erros de domínio (CardNotFoundError, InvalidCardDataError, etc.)
│   └── index.ts
│
├── application/               # 🔵 Camada de Aplicação (Casos de Uso e Orquestração)
│   ├── dtos/                  # DTOs de entrada, saída e CardMapper
│   ├── use-cases/             # Use cases: List, GetById, Create, Update, Delete
│   └── index.ts
│
├── infrastructure/            # 🟠 Camada de Infraestrutura (Implementações Concretas)
│   ├── repositories/          # InMemoryCardRepository (com seeds clássicas de MTG)
│   └── index.ts
│
└── main/                      # 🔴 Camada Principal (Frameworks, Rotas e Configurações)
    ├── config/                # Instância do Fastify, Swagger, CORS e Global Error Handler
    ├── controllers/           # CardController conectando HTTP aos Use Cases
    ├── factories/             # Composition Root / Injeção de dependências
    ├── routes/                # Definição das rotas Fastify sob /api/v1
    ├── schemas/               # Schemas de validação e OpenAPI 3.0 / Swagger
    └── server.ts              # Ponto de entrada (bootstrap do servidor HTTP)
```

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- **Node.js** v20+ instalado
- **npm** (ou yarn/pnpm)

### Instalação
```bash
# Clone o repositório
git clone https://github.com/BernardoLannes/mtg-manager-api.git
cd MTG_Decks

# Instale as dependências
npm install
```

### Scripts Disponíveis
```bash
# Modo desenvolvimento (com hot reload e suporte aos path aliases)
npm run dev

# Compilação do TypeScript para JavaScript (dist/)
npm run build

# Execução em produção (após build)
npm run start

# Verificação estática com ESLint (sem erros/avisos)
npm run lint

# Correção automática com ESLint
npm run lint:fix

# Formatação de código com Prettier
npm run format
```

---

## 📚 Documentação Interativa (Swagger / OpenAPI 3.0)

Com a aplicação rodando, acesse a interface interativa do Swagger UI em:

👉 **[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

---

## 📡 Endpoints da Entrega 1

Todos os endpoints estão prefixados com `/api/v1`.

### 1. Listar Cartas do Catálogo Local
- **Método & Rota:** `GET /api/v1/cards`
- **Filtros opcionais via query parameters:**
  - `?type=Instant` — Filtra por tipo de carta (Instant, Creature, Artifact, etc.)
  - `?color=U` — Filtra por cor (`W`, `U`, `B`, `R`, `G`)
  - `?rarity=rare` — Filtra por raridade (`common`, `uncommon`, `rare`, `mythic`)
  - `?set=LEA` — Filtra pela edição (ex: LEA - Limited Edition Alpha)
  - `?name=Lotus` — Busca parcial pelo nome da carta
- **Resposta de Sucesso:** `200 OK` (Array de cartas)

### 2. Buscar Carta por ID
- **Método & Rota:** `GET /api/v1/cards/:id`
- **Resposta de Sucesso:** `200 OK`
- **Resposta de Erro:** `404 Not Found` se o ID não existir no catálogo.

### 3. Cadastrar Carta Manualmente
- **Método & Rota:** `POST /api/v1/cards`
- **Corpo da Requisição (JSON):**
```json
{
  "name": "Mox Sapphire",
  "manaCost": "{0}",
  "cmc": 0,
  "typeLine": "Artifact",
  "oracleText": "{T}: Add {U}.",
  "colors": [],
  "rarity": "rare",
  "set": "LEA",
  "imageUrl": "https://cards.scryfall.io/normal/front/e/a/ea494052-e34a-4352-8778-878980b56f1e.jpg"
}
```
- **Resposta de Sucesso:** `201 Created`

### 4. Atualizar Dados de uma Carta
- **Método & Rota:** `PUT /api/v1/cards/:id`
- **Corpo da Requisição (JSON):** Campos opcionais a serem atualizados (`name`, `manaCost`, `typeLine`, `oracleText`, etc.)
- **Resposta de Sucesso:** `200 OK`

### 5. Remover Carta do Catálogo
- **Método & Rota:** `DELETE /api/v1/cards/:id`
- **Resposta de Sucesso:** `204 No Content`

---

## 🃏 Cartas Iniciais Inclusas no Catálogo (Seeds)

Para facilitar a experimentação imediata, o catálogo inicial vem pré-povoado com cartas canônicas:
- **Black Lotus** (`Artifact`, Rara, LEA)
- **Lightning Bolt** (`Instant`, Comum, LEA, Vermelha)
- **Counterspell** (`Instant`, Incomum, LEA, Azul)
- **Birds of Paradise** (`Creature — Bird`, Rara, LEA, Verde)
- **Dark Ritual** (`Instant`, Comum, LEA, Preta)
- **Serra Angel** (`Creature — Angel`, Incomum, LEA, Branca)

---

## 🗓️ Roteiro das Próximas Entregas

- [x] **Entrega 1:** Clean Architecture, Repositório In-Memory, Contrato REST e Swagger.
- [ ] **Entrega 2:** Persistência Relacional com **PostgreSQL + Prisma ORM**, Integração com **Scryfall API Gateway**, Validação avançada com **Zod**, Modelagem de Planeswalkers/Decks e regras de negócio de construção de baralhos.
- [ ] **Entrega 3:** Autenticação e Segurança (JWT, bcrypt/argon2, Helmet, Rate Limiting).
- [ ] **Entrega 4:** Testes Automatizados (Vitest/Supertest), Docker, Docker Compose e CI/CD com GitHub Actions.
