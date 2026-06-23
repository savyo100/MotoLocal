# Constituição do Projeto MotoLocal

## Artigo I — Stack Tecnológico

- **Frontend**: React.js com Vite, TypeScript, Tailwind CSS
- **Mapa**: Leaflet.js + OpenStreetMap (gratuito, sem API key)
- **Backend**: Node.js com Express e TypeScript
- **Banco de Dados**: PostgreSQL + PostGIS (geolocalização)
- **Geocodificação**: Nominatim (gratuito)
- **Hospedagem**: Vercel (frontend) + Render (backend)
- **Versionamento**: Git + GitHub

## Artigo II — Princípios de Arquitetura

1. **Mobile-first**: Todo layout deve ser responsivo, priorizando telas pequenas
2. **PWA**: Deve funcionar offline parcialmente (cache de mapa e dados básicos)
3. **API REST**: Backend expõe API RESTful com respostas JSON
4. **Separação de concerns**: Frontend e backend em diretórios independentes
5. **Componentização**: UI dividida em componentes React reutilizáveis

## Artigo III — Padrões de Código

1. TypeScript estrito em frontend e backend
2. Nomes de arquivos em kebab-case
3. Componentes React em PascalCase
4. Funções e variáveis em camelCase
5. Rotas Express em minúsculas com hífens

## Artigo IV — Banco de Dados

1. PostGIS habilitado para queries geoespaciais
2. Tabelas no plural com snake_case
3. Chave primária sempre `id` (UUID)
4. Timestamps `created_at` e `updated_at` em toda tabela
5. Índices geoespaciais para coordenadas

## Artigo V — Qualidade

1. Testes obrigatórios para toda funcionalidade nova
2. Commits semânticos (feat:, fix:, docs:, refactor:)
3. Code review antes de merge na main
4. Variáveis de ambiente para configurações sensíveis

## Artigo VI — Entregáveis

1. `docs/constitution.md` — Regras de tecnologia
2. `docs/schema.md` — Especificação de dados
3. `docs/plan.md` — Plano técnico de implementação
4. `docs/tasks.md` — Roadmap de tarefas
5. Código fonte completo no GitHub
6. Deploy funcionando (frontend + backend)
