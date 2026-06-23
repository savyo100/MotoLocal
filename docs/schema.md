# Schema — MotoLocal

## Modelo de Dados

### concessionarias

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID (PK) | Identificador único |
| nome | VARCHAR(150) | Nome da concessionária |
| cnpj | VARCHAR(18) | CNPJ único |
| telefone | VARCHAR(20) | Telefone de contato |
| email | VARCHAR(150) | Email de contato |
| endereco | TEXT | Endereço completo |
| latitude | DECIMAL(10,7) | Latitude (PostGIS) |
| longitude | DECIMAL(10,7) | Longitude (PostGIS) |
| marca | VARCHAR(50) | Honda, Yamaha, etc. |
| horario_abertura | TIME | Horário de abertura |
| horario_fechamento | TIME | Horário de fechamento |
| foto_url | TEXT | URL da foto de capa |
| destaque | BOOLEAN | Anúncio patrocinado |
| media_preco | DECIMAL(10,2) | Preço médio dos serviços |
| score | DECIMAL(3,2) | Score de confiança (0-5) |
| tempo_estimado_medio | INT | Minutos estimados |
| ativa | BOOLEAN | Se está ativa na plataforma |
| created_at | TIMESTAMPTZ | Data de criação |
| updated_at | TIMESTAMPTZ | Data de atualização |

### servicos

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID (PK) | Identificador único |
| concessionaria_id | UUID (FK) | Referência à concessionária |
| nome | VARCHAR(100) | Nome do serviço |
| tipo | ENUM | revisao_completa, oleo, freios, suspensao, eletrica, pneus |
| descricao | TEXT | Descrição detalhada |
| preco | DECIMAL(10,2) | Preço do serviço |
| tempo_estimado | INT | Minutos estimados |
| disponivel | BOOLEAN | Se está disponível |
| created_at | TIMESTAMPTZ | Data de criação |
| updated_at | TIMESTAMPTZ | Data de atualização |

### usuarios (motociclistas)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID (PK) | Identificador único |
| nome | VARCHAR(150) | Nome completo |
| email | VARCHAR(150) | Email único |
| senha_hash | VARCHAR(255) | Hash da senha |
| telefone | VARCHAR(20) | Telefone |
| cep | VARCHAR(9) | CEP para geolocalização |
| latitude | DECIMAL(10,7) | Latitude do usuário |
| longitude | DECIMAL(10,7) | Longitude do usuário |
| created_at | TIMESTAMPTZ | Data de criação |
| updated_at | TIMESTAMPTZ | Data de atualização |

### agendamentos

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID (PK) | Identificador único |
| usuario_id | UUID (FK) | Referência ao usuário |
| concessionaria_id | UUID (FK) | Referência à concessionária |
| servico_id | UUID (FK) | Referência ao serviço |
| data | DATE | Data agendada |
| horario | TIME | Horário agendado |
| status | ENUM | pendente, confirmado, concluido, cancelado |
| observacao | TEXT | Observação do usuário |
| created_at | TIMESTAMPTZ | Data de criação |
| updated_at | TIMESTAMPTZ | Data de atualização |

### reviews

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID (PK) | Identificador único |
| usuario_id | UUID (FK) | Referência ao usuário |
| concessionaria_id | UUID (FK) | Referência à concessionária |
| agendamento_id | UUID (FK) | Referência ao agendamento (verificação) |
| nota | INT | 1 a 5 |
| comentario | TEXT | Comentário opcional |
| created_at | TIMESTAMPTZ | Data de criação |

### favoritos

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID (PK) | Identificador único |
| usuario_id | UUID (FK) | Referência ao usuário |
| concessionaria_id | UUID (FK) | Referência à concessionária |
| created_at | TIMESTAMPTZ | Data de criação |

### promocoes

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID (PK) | Identificador único |
| concessionaria_id | UUID (FK) | Referência à concessionária |
| titulo | VARCHAR(200) | Título da promoção |
| descricao | TEXT | Descrição |
| desconto_percentual | INT | Percentual de desconto |
| data_inicio | DATE | Início da validade |
| data_fim | DATE | Fim da validade |
| ativa | BOOLEAN | Se está ativa |
| created_at | TIMESTAMPTZ | Data de criação |
| updated_at | TIMESTAMPTZ | Data de atualização |

## Relacionamentos

```
usuario 1---N agendamento N---1 concessionaria
usuario 1---N review N---1 concessionaria
usuario 1---N favorito N---1 concessionaria
concessionaria 1---N servico
concessionaria 1---N promocao
agendamento 1---1 review (verificado)
```

## Requisitos Funcionais (RF)

| ID | Descrição | Prioridade |
|----|-----------|------------|
| RF01 | Mapa interativo com marcadores de concessionárias por score | Alta |
| RF02 | Geolocalização automática ou busca por CEP | Alta |
| RF03 | Filtro por tipo de serviço (revisão, óleo, freios, etc.) | Alta |
| RF04 | Filtro por marca (Honda, Yamaha) | Alta |
| RF05 | Perfil da concessionária com reviews, fotos, preço médio | Alta |
| RF06 | Agendamento online (data, horário, serviço) | Alta |
| RF07 | Reviews verificados (só após agendamento concluído) | Alta |
| RF08 | Compartilhar localização com concessionária | Média |
| RF09 | Favoritar concessionárias | Média |
| RF10 | Ver promoções ativas na região | Média |
| RF11 | Cadastro de perfil da concessionária | Alta |
| RF12 | Painel de agendamentos para concessionária | Alta |
| RF13 | Confirmação de conclusão de serviço | Alta |
| RF14 | Relatórios de demanda e serviços | Média |
| RF15 | Gestão de agenda (disponibilidade, horários) | Média |

## Requisitos Não Funcionais (RNF)

| ID | Descrição |
|----|-----------|
| RNF01 | Responsivo (mobile-first) |
| RNF02 | PWA com modo offline limitado |
| RNF03 | Geolocalização com precisão de 10m |
| RNF04 | Autenticação JWT |
| RNF05 | Senhas hasheadas com bcrypt |
| RNF06 | API REST com rate limiting |
| RNF07 | Score de concessionária atualizado em tempo real |
| RNF08 | Mapa carrega em menos de 3s |
| RNF09 | CORS configurado para segurança |
