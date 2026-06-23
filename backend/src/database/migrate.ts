import { pool } from './connection';

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await client.query('CREATE EXTENSION IF NOT EXISTS "postgis"');

    await client.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        nome VARCHAR(150) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        senha_hash VARCHAR(255) NOT NULL,
        telefone VARCHAR(20),
        cep VARCHAR(9),
        latitude DECIMAL(10,7),
        longitude DECIMAL(10,7),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS concessionarias (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        nome VARCHAR(150) NOT NULL,
        cnpj VARCHAR(18) UNIQUE NOT NULL,
        telefone VARCHAR(20),
        email VARCHAR(150),
        endereco TEXT NOT NULL,
        latitude DECIMAL(10,7) NOT NULL,
        longitude DECIMAL(10,7) NOT NULL,
        marca VARCHAR(50),
        horario_abertura TIME,
        horario_fechamento TIME,
        foto_url TEXT,
        destaque BOOLEAN DEFAULT false,
        media_preco DECIMAL(10,2),
        score DECIMAL(3,2) DEFAULT 0,
        tempo_estimado_medio INT,
        ativa BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS servicos (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        concessionaria_id UUID NOT NULL REFERENCES concessionarias(id) ON DELETE CASCADE,
        nome VARCHAR(100) NOT NULL,
        tipo VARCHAR(30) NOT NULL CHECK (tipo IN ('revisao_completa','oleo','freios','suspensao','eletrica','pneus')),
        descricao TEXT,
        preco DECIMAL(10,2) NOT NULL,
        tempo_estimado INT,
        disponivel BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS agendamentos (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
        concessionaria_id UUID NOT NULL REFERENCES concessionarias(id) ON DELETE CASCADE,
        servico_id UUID NOT NULL REFERENCES servicos(id) ON DELETE CASCADE,
        data DATE NOT NULL,
        horario TIME NOT NULL,
        status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente','confirmado','concluido','cancelado')),
        observacao TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
        concessionaria_id UUID NOT NULL REFERENCES concessionarias(id) ON DELETE CASCADE,
        agendamento_id UUID UNIQUE NOT NULL REFERENCES agendamentos(id) ON DELETE CASCADE,
        nota INT NOT NULL CHECK (nota >= 1 AND nota <= 5),
        comentario TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS favoritos (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
        concessionaria_id UUID NOT NULL REFERENCES concessionarias(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(usuario_id, concessionaria_id)
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS promocoes (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        concessionaria_id UUID NOT NULL REFERENCES concessionarias(id) ON DELETE CASCADE,
        titulo VARCHAR(200) NOT NULL,
        descricao TEXT,
        desconto_percentual INT,
        data_inicio DATE NOT NULL,
        data_fim DATE NOT NULL,
        ativa BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_concessionarias_coords ON concessionarias (latitude, longitude);
      CREATE INDEX IF NOT EXISTS idx_servicos_tipo ON servicos (tipo);
      CREATE INDEX IF NOT EXISTS idx_agendamentos_status ON agendamentos (status);
      CREATE INDEX IF NOT EXISTS idx_agendamentos_usuario ON agendamentos (usuario_id);
      CREATE INDEX IF NOT EXISTS idx_agendamentos_concessionaria ON agendamentos (concessionaria_id);
      CREATE INDEX IF NOT EXISTS idx_reviews_concessionaria ON reviews (concessionaria_id);
    `);

    console.log('Migrações executadas com sucesso!');
  } catch (error) {
    console.error('Erro na migração:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
