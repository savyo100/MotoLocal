# MotoLocal

Plataforma de Localização de Confiabilidade de Concessionárias para Motociclistas.

## Stack

- **Frontend**: React + Vite + TypeScript + Tailwind CSS + Leaflet.js
- **Backend**: Node.js + Express + TypeScript
- **Banco**: PostgreSQL + PostGIS
- **Mapa**: OpenStreetMap (gratuito)

## Estrutura

```
MotoLocal/
├── docs/
│   ├── constitution.md    # Regras de tecnologia
│   ├── schema.md          # Especificação de dados
│   ├── plan.md            # Plano técnico
│   └── tasks.md           # Roadmap de tarefas
├── frontend/              # Aplicação React
├── backend/               # API REST
└── README.md
```

## Como rodar

### Backend

```bash
cd backend
cp .env.example .env  # Configure DATABASE_URL e JWT_SECRET
npm install
npm run migrate       # Cria as tabelas no banco
npm run dev           # Inicia em http://localhost:3001
```

### Frontend

```bash
cd frontend
npm install
npm run dev           # Inicia em http://localhost:5173
```

## Cobertura Regional

O MotoLocal cobre **todo o Norte do Piauí**, com foco em:

- **Piripiri** (centro da região) 🏍️
- Teresina
- Parnaíba
- Barras
- Esperantina
- Pedro II
- Piracuruca
- Campo Maior
- Batalha
- Brasileira

Raio de busca padrão: **100 km** para encontrar concessionárias nas cidades vizinhas.

## Funcionalidades

- Mapa interativo com Leaflet + OpenStreetMap
- Geolocalização automática ou busca por CEP
- Filtro por tipo de serviço e marca
- Perfil completo da concessionária com reviews
- Agendamento online
- Reviews verificados (só após conclusão do serviço)
- Favoritos
- Promoções ativas
- Painel do usuário (agendamentos + favoritos)

## Deploy (Produção)

### URLs

- **Frontend:** https://moto-local-front.vercel.app
- **Backend:** https://motolocal-backend.onrender.com
- **Health Check:** https://motolocal-backend.onrender.com/api/health

### Variáveis de Ambiente (Render)

| Variável | Valor |
|----------|-------|
| `PORT` | `10000` |
| `DATABASE_URL` | URL do Neon PostgreSQL |
| `JWT_SECRET` | Chave secreta JWT |
| `FRONTEND_URL` | `https://moto-local-front.vercel.app` |

### Rodar Localmente

```bash
# Backend
cd backend
cp .env.example .env  # Configure DATABASE_URL e JWT_SECRET
npm install
npm run migrate
npm run dev           # http://localhost:3001

# Frontend
cd frontend
npm install
npm run dev           # http://localhost:5173
```
