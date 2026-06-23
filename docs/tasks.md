# Tasks — MotoLocal

## Fase 1: Setup Inicial
- [ ] 1.1 Inicializar repositório Git
- [ ] 1.2 Configurar backend (Node.js + Express + TypeScript)
- [ ] 1.3 Configurar frontend (React + Vite + TypeScript + Tailwind)
- [ ] 1.4 Configurar banco PostgreSQL com PostGIS
- [ ] 1.5 Criar migrations iniciais

## Fase 2: Autenticação
- [ ] 2.1 Model Usuario + migration
- [ ] 2.2 Rota POST /api/auth/registro
- [ ] 2.3 Rota POST /api/auth/login (JWT)
- [ ] 2.4 Middleware de autenticação
- [ ] 2.5 Tela de login (frontend)
- [ ] 2.6 Tela de cadastro (frontend)

## Fase 3: API Concessionárias e Serviços
- [ ] 3.1 Model Concessionaria + migration (com PostGIS)
- [ ] 3.2 Model Servico + migration
- [ ] 3.3 CRUD concessionárias (rotas)
- [ ] 3.4 CRUD serviços (rotas)
- [ ] 3.5 Filtros por tipo de serviço e marca
- [ ] 3.6 Query geoespacial (concessionárias próximas)

## Fase 4: Mapa Interativo (Frontend)
- [ ] 4.1 Componente Mapa com Leaflet + OpenStreetMap
- [ ] 4.2 Marcadores com cor baseada no score
- [ ] 4.3 Busca por geolocalização do browser
- [ ] 4.4 Busca por CEP (Nominatim)
- [ ] 4.5 Componente FilterPanel (serviço, marca)
- [ ] 4.6 Componente CardConcessionaria (popup)
- [ ] 4.7 Tela Home com mapa + filtros

## Fase 5: Agendamentos
- [ ] 5.1 Model Agendamento + migration
- [ ] 5.2 Rotas CRUD agendamentos
- [ ] 5.3 Tela de perfil da concessionária
- [ ] 5.4 Componente FormAgendamento
- [ ] 5.5 Painel de agendamentos (concessionária)
- [ ] 5.6 Confirmação de conclusão de serviço

## Fase 6: Reviews
- [ ] 6.1 Model Review + migration
- [ ] 6.2 Rota POST /api/reviews (verificada por agendamento)
- [ ] 6.3 Exibição de reviews no perfil
- [ ] 6.4 Cálculo do score da concessionária

## Fase 7: Funcionalidades Extras
- [ ] 7.1 Favoritos (model + rota + frontend)
- [ ] 7.2 Promoções (model + rota + frontend)
- [ ] 7.3 Dashboard com relatórios (concessionária)
- [ ] 7.4 PWA (manifest.json + service worker)
- [ ] 7.5 Compartilhar localização

## Fase 8: Deploy
- [ ] 8.1 Configurar Vercel (frontend)
- [ ] 8.2 Configurar Render (backend + PostgreSQL)
- [ ] 8.3 Variáveis de ambiente
- [ ] 8.4 Teste final e ajustes
- [ ] 8.5 Commit final e push no GitHub
