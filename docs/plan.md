# Plano Técnico — MotoLocal

## 1. Arquitetura do Sistema

```
┌─────────────────────────────────────────────────┐
│                    FRONTEND                      │
│          React + Vite + TypeScript               │
│          Tailwind CSS + Leaflet.js               │
│          PWA (Service Worker)                    │
├─────────────────────────────────────────────────┤
│                    API REST                      │
│         Node.js + Express + TypeScript           │
│         JWT Auth + bcrypt + rate-limit           │
├─────────────────────────────────────────────────┤
│              BANCO DE DADOS                      │
│         PostgreSQL + PostGIS                     │
│         (Render PostgreSQL gratuito)             │
└─────────────────────────────────────────────────┘
```

## 2. Estrutura de Diretórios

```
MotoLocal/
├── docs/
│   ├── constitution.md
│   ├── schema.md
│   ├── plan.md
│   └── tasks.md
├── frontend/
│   ├── public/
│   │   └── manifest.json       # PWA manifest
│   ├── src/
│   │   ├── components/
│   │   │   ├── Map.tsx          # Mapa Leaflet
│   │   │   ├── SearchBar.tsx    # Busca por CEP/local
│   │   │   ├── FilterPanel.tsx  # Filtros (serviço, marca)
│   │   │   ├── CardConcessionaria.tsx
│   │   │   ├── PerfilConcessionaria.tsx
│   │   │   ├── FormAgendamento.tsx
│   │   │   └── ReviewCard.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Concessionaria.tsx
│   │   │   ├── Agendamento.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Cadastro.tsx
│   │   │   └── Dashboard.tsx     # Painel da concessionária
│   │   ├── hooks/
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── concessionarias.ts
│   │   │   ├── servicos.ts
│   │   │   ├── agendamentos.ts
│   │   │   ├── reviews.ts
│   │   │   ├── favoritos.ts
│   │   │   └── promocoes.ts
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   ├── models/
│   │   ├── database/
│   │   │   └── migrations/
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## 3. Rotas da API

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | /api/auth/registro | Cadastro usuário | — |
| POST | /api/auth/login | Login (JWT) | — |
| GET | /api/concessionarias | Listar (com filtros) | — |
| GET | /api/concessionarias/:id | Perfil completo | — |
| POST | /api/concessionarias | Cadastrar (parceiro) | JWT |
| PUT | /api/concessionarias/:id | Atualizar perfil | JWT |
| GET | /api/concessionarias/:id/servicos | Serviços | — |
| GET | /api/servicos/tipos | Tipos disponíveis | — |
| POST | /api/agendamentos | Criar agendamento | JWT |
| GET | /api/agendamentos | Meus agendamentos | JWT |
| PUT | /api/agendamentos/:id | Atualizar status | JWT |
| GET | /api/concessionarias/:id/reviews | Reviews | — |
| POST | /api/reviews | Criar review | JWT |
| POST | /api/favoritos | Favoritar | JWT |
| GET | /api/favoritos | Listar favoritos | JWT |
| DELETE | /api/favoritos/:id | Remover favorito | JWT |
| GET | /api/promocoes | Promoções ativas | — |
| GET | /api/concessionarias/:id/relatorios | Relatórios | JWT |

## 4. Estratégia de Geolocalização

1. Usuário permite geolocalização do browser → coordenadas precisas
2. Se negar → busca por CEP (Nominatim para converter em lat/lng)
3. Query espacial: `SELECT * FROM concessionarias WHERE ST_DWithin(location, user_point, 50000)` (50km raio)
4. Leaflet exibe marcadores com cor baseada no score (verde >4, amarelo 3-4, vermelho <3)

## 5. Score de Confiança

Fórmula:
```
score = (media_reviews * 0.6) + (taxa_conclusao * 0.2) + (tempo_resposta * 0.2)
```
- `media_reviews`: Média de notas (0-5)
- `taxa_conclusao`: % de agendamentos concluídos
- `tempo_resposta`: Tempo médio para responder agendamentos

## 6. Plano de Implementação (Fases)

| Fase | Duração | Entregas |
|------|---------|----------|
| 1 — Setup | Dia 1 | Repositório, configuração inicial, banco |
| 2 — Auth | Dia 1-2 | Registro/login JWT, middleware |
| 3 — API Concessionárias | Dia 2-3 | CRUD, geolocalização, filtros |
| 4 — Mapa | Dia 3-4 | Leaflet, marcadores, busca CEP |
| 5 — Agendamentos | Dia 4-5 | CRUD, painel, status |
| 6 — Reviews | Dia 5 | Sistema de avaliação verificada |
| 7 — Extras | Dia 6 | Favoritos, promoções, dashboard |
| 8 — Deploy | Dia 7 | GitHub, Vercel, Render, teste |
