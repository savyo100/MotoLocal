import { pool } from './connection';
import bcrypt from 'bcryptjs';

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('DELETE FROM reviews');
    await client.query('DELETE FROM agendamentos');
    await client.query('DELETE FROM servicos');
    await client.query('DELETE FROM favoritos');
    await client.query('DELETE FROM promocoes');
    await client.query('DELETE FROM concessionarias');
    await client.query('DELETE FROM usuarios');

    const concessionarias = [
      {
        nome: 'CN Motos - Teresina',
        cnpj: '11.222.333/0001-01',
        telefone: '(86) 3025-1000',
        email: 'contato@cnmotos.com.br',
        endereco: 'Av. Dep. Paulo Ferraz, 1940 - Beira Rio, Teresina - PI',
        latitude: -5.0652, longitude: -42.7812,
        marca: 'Honda', score: 4.7, media_preco: 180.00, tempo_estimado_medio: 55,
      },
      {
        nome: 'Japan Motos - Miguel Rosa',
        cnpj: '11.222.333/0001-02',
        telefone: '(86) 3221-4000',
        email: 'contato@japanmotos.com.br',
        endereco: 'Av. Miguel Rosa, 3500 - Centro, Teresina - PI',
        latitude: -5.0850, longitude: -42.8100,
        marca: 'Honda', score: 4.5, media_preco: 195.00, tempo_estimado_medio: 60,
      },
      {
        nome: 'Japan Motos - Centro',
        cnpj: '11.222.333/0001-03',
        telefone: '(86) 3222-5000',
        email: 'centro@japanmotos.com.br',
        endereco: 'Rua Coelho Rodrigues, 1500 - Centro, Teresina - PI',
        latitude: -5.0925, longitude: -42.8050,
        marca: 'Honda', score: 4.3, media_preco: 175.00, tempo_estimado_medio: 50,
      },
      {
        nome: 'Mundo Sam Yamaha - Barão de Gurguéia',
        cnpj: '11.222.333/0001-04',
        telefone: '(86) 3025-2000',
        email: 'barao@mundosam.com.br',
        endereco: 'Av. Barão de Gurguéia, 3333 - Tabuleta, Teresina - PI',
        latitude: -5.0780, longitude: -42.7950,
        marca: 'Yamaha', score: 4.6, media_preco: 210.00, tempo_estimado_medio: 50,
      },
      {
        nome: 'Mundo Sam Yamaha - Centro',
        cnpj: '11.222.333/0001-05',
        telefone: '(86) 3025-3000',
        email: 'centro@mundosam.com.br',
        endereco: 'Rua Paissandú, 7925 - Centro, Teresina - PI',
        latitude: -5.0900, longitude: -42.8000,
        marca: 'Yamaha', score: 4.4, media_preco: 200.00, tempo_estimado_medio: 55,
      },
      {
        nome: 'Mundo Sam Yamaha - João XXIII',
        cnpj: '11.222.333/0001-06',
        telefone: '(86) 3025-4000',
        email: 'joaoxxiii@mundosam.com.br',
        endereco: 'Av. João XXIII, 5325 - Santa Isabel, Teresina - PI',
        latitude: -5.0750, longitude: -42.7850,
        marca: 'Yamaha', score: 4.2, media_preco: 190.00, tempo_estimado_medio: 50,
      },
      {
        nome: 'Jelta Bajaj - Teresina',
        cnpj: '11.222.333/0001-07',
        telefone: '(86) 99947-4373',
        email: 'teresina@jeltabajaj.com.br',
        endereco: 'Av. Frei Serafim, 1909 - Centro, Teresina - PI',
        latitude: -5.0885, longitude: -42.8025,
        marca: 'Bajaj', score: 4.1, media_preco: 160.00, tempo_estimado_medio: 45,
      },
      {
        nome: 'Cajueiro Motos - Teresina',
        cnpj: '11.222.333/0001-08',
        telefone: '(86) 3223-6000',
        email: 'contato@cajueiromotos.com.br',
        endereco: 'Rua Magalhães Filho, 2589 - Aeroporto, Teresina - PI',
        latitude: -5.0575, longitude: -42.7730,
        marca: 'Honda', score: 4.0, media_preco: 170.00, tempo_estimado_medio: 50,
      },
      {
        nome: 'Tem Motos Yamaha',
        cnpj: '11.222.333/0001-09',
        telefone: '(86) 3224-7000',
        email: 'contato@temmotos.com.br',
        endereco: 'Av. Barão de Gurguéia, 1736 - Vermelha, Teresina - PI',
        latitude: -5.0805, longitude: -42.7970,
        marca: 'Yamaha', score: 3.9, media_preco: 185.00, tempo_estimado_medio: 55,
      },
      {
        nome: 'Jelta Bajaj - Parnaíba',
        cnpj: '11.222.333/0001-10',
        telefone: '(86) 3322-8000',
        email: 'parnaiba@jeltabajaj.com.br',
        endereco: 'Av. Leonardo de Carvalho Castelo Branco, 4135 - Reis Veloso, Parnaíba - PI',
        latitude: -2.8980, longitude: -41.7700,
        marca: 'Bajaj', score: 3.8, media_preco: 155.00, tempo_estimado_medio: 45,
      },
      {
        nome: 'Sol Nascente Motos',
        cnpj: '11.222.333/0001-11',
        telefone: '(86) 3322-9000',
        email: 'contato@solnascentemotos.com.br',
        endereco: 'Av. Presidente Vargas, 1200 - Centro, Parnaíba - PI',
        latitude: -2.9050, longitude: -41.7760,
        marca: 'Honda', score: 4.3, media_preco: 175.00, tempo_estimado_medio: 50,
      },
      {
        nome: 'CN Motos - Porto Alegre',
        cnpj: '11.222.333/0001-12',
        telefone: '(86) 3225-8000',
        email: 'portoalegre@cnmotos.com.br',
        endereco: 'Av. Ayrton Senna, 3472 - Porto Alegre, Teresina - PI',
        latitude: -5.0600, longitude: -42.7600,
        marca: 'Honda', score: 4.1, media_preco: 165.00, tempo_estimado_medio: 50,
      },
      // === Piripiri e Região Norte do Piauí ===
      {
        nome: 'Honda Piripiri',
        cnpj: '11.222.333/0001-13',
        telefone: '(86) 3276-2000',
        email: 'vendas@hondapiripiri.com.br',
        endereco: 'Av. Presidente Getúlio Vargas, 850 - Centro, Piripiri - PI',
        latitude: -4.2736, longitude: -41.7753,
        marca: 'Honda', score: 4.5, media_preco: 175.00, tempo_estimado_medio: 50,
      },
      {
        nome: 'Yamaha Piripiri',
        cnpj: '11.222.333/0001-14',
        telefone: '(86) 3276-3000',
        email: 'contato@yamahapiripiri.com.br',
        endereco: 'Rua Senador Joaquim Pires, 420 - Centro, Piripiri - PI',
        latitude: -4.2700, longitude: -41.7780,
        marca: 'Yamaha', score: 4.3, media_preco: 190.00, tempo_estimado_medio: 55,
      },
      {
        nome: 'Moto Center Piripiri',
        cnpj: '11.222.333/0001-15',
        telefone: '(86) 3276-1500',
        email: 'motocenter@piripiri.com.br',
        endereco: 'Av. Deputado João Sampaio, 1120 - Centro, Piripiri - PI',
        latitude: -4.2760, longitude: -41.7720,
        marca: 'Multimarcas', score: 4.0, media_preco: 160.00, tempo_estimado_medio: 45,
      },
      {
        nome: 'Moto Norte Barras',
        cnpj: '11.222.333/0001-16',
        telefone: '(86) 3242-3000',
        email: 'contato@motonortebarras.com.br',
        endereco: 'Rua Governador Pedro de Alcântara, 600 - Centro, Barras - PI',
        latitude: -4.2470, longitude: -42.2940,
        marca: 'Honda', score: 4.2, media_preco: 170.00, tempo_estimado_medio: 50,
      },
      {
        nome: 'Esperantina Motos',
        cnpj: '11.222.333/0001-17',
        telefone: '(86) 3362-2000',
        email: 'vendas@esperantinamotos.com.br',
        endereco: 'Av. Presidente Castelo Branco, 350 - Centro, Esperantina - PI',
        latitude: -3.9010, longitude: -42.2390,
        marca: 'Yamaha', score: 4.1, media_preco: 185.00, tempo_estimado_medio: 55,
      },
      {
        nome: 'Pedro II Moto Center',
        cnpj: '11.222.333/0001-18',
        telefone: '(86) 3275-4000',
        email: 'pedroii@motocenter.com.br',
        endereco: 'Rua Coronel Manoel Francisco, 280 - Centro, Pedro II - PI',
        latitude: -4.4250, longitude: -41.4590,
        marca: 'Multimarcas', score: 3.9, media_preco: 155.00, tempo_estimado_medio: 50,
      },
      {
        nome: 'Piracuruca Motos',
        cnpj: '11.222.333/0001-19',
        telefone: '(86) 3344-3000',
        email: 'piracuruca@hondamotos.com.br',
        endereco: 'Rua Monsenhor José Lopes, 500 - Centro, Piracuruca - PI',
        latitude: -3.9280, longitude: -41.7090,
        marca: 'Honda', score: 4.4, media_preco: 170.00, tempo_estimado_medio: 45,
      },
      {
        nome: 'Campo Maior Moto Center',
        cnpj: '11.222.333/0001-20',
        telefone: '(86) 3252-5000',
        email: 'contato@cmmaior.com.br',
        endereco: 'Av. Demerval Lobão, 920 - Centro, Campo Maior - PI',
        latitude: -4.8280, longitude: -42.1690,
        marca: 'Yamaha', score: 4.2, media_preco: 195.00, tempo_estimado_medio: 55,
      },
      {
        nome: 'Moto Sul Batalha',
        cnpj: '11.222.333/0001-21',
        telefone: '(86) 3245-1000',
        email: 'vendas@motosulbatalha.com.br',
        endereco: 'Av. Getúlio Vargas, 410 - Centro, Batalha - PI',
        latitude: -4.0230, longitude: -42.0780,
        marca: 'Honda', score: 4.0, media_preco: 165.00, tempo_estimado_medio: 50,
      },
      {
        nome: 'Brasileira Motos',
        cnpj: '11.222.333/0001-22',
        telefone: '(86) 3278-1000',
        email: 'brasileira@motos.com.br',
        endereco: 'Rua Principal, 200 - Centro, Brasileira - PI',
        latitude: -4.1330, longitude: -41.7820,
        marca: 'Multimarcas', score: 3.8, media_preco: 150.00, tempo_estimado_medio: 45,
      },
    ];

    const servicosBase = [
      { nome: 'Revisão Completa 5000km', tipo: 'revisao_completa', descricao: 'Revisão completa conforme manual do fabricante', preco_base: 300, tempo_base: 120 },
      { nome: 'Troca de Óleo + Filtro', tipo: 'oleo', descricao: 'Troca de óleo do motor e filtro', preco_base: 80, tempo_base: 30 },
      { nome: 'Revisão de Freios', tipo: 'freios', descricao: 'Substituição de pastilhas e discos de freio', preco_base: 150, tempo_base: 60 },
      { nome: 'Suspensão', tipo: 'suspensao', descricao: 'Revisão geral da suspensão', preco_base: 250, tempo_base: 90 },
      { nome: 'Sistema Elétrico', tipo: 'eletrica', descricao: 'Diagnóstico e reparo do sistema elétrico', preco_base: 120, tempo_base: 45 },
      { nome: 'Troca de Pneus', tipo: 'pneus', descricao: 'Substituição do par de pneus', preco_base: 300, tempo_base: 60 },
    ];

    const ids: string[] = [];
    for (const c of concessionarias) {
      const variacao = () => Math.round((Math.random() - 0.5) * 0.02 * 10000) / 10000;
      const lat = c.latitude + variacao();
      const lon = c.longitude + variacao();

      const r = await client.query(`
        INSERT INTO concessionarias (nome, cnpj, telefone, email, endereco, latitude, longitude, marca, horario_abertura, horario_fechamento, score, media_preco, tempo_estimado_medio, destaque)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, '08:00', '18:00', $9, $10, $11, $12)
        RETURNING id
      `, [c.nome, c.cnpj, c.telefone, c.email, c.endereco, lat, lon, c.marca, c.score, c.media_preco, c.tempo_estimado_medio, c.score >= 4.3]);

      const id = r.rows[0].id;
      ids.push(id);

      // 3 a 5 serviços por concessionária
      const qtd = 3 + Math.floor(Math.random() * 3);
      const escolhidos = [...servicosBase].sort(() => Math.random() - 0.5).slice(0, qtd);
      for (const s of escolhidos) {
        const preco = s.preco_base + Math.floor(Math.random() * 60) - 30;
        const tempo = s.tempo_base + Math.floor(Math.random() * 30) - 15;
        await client.query(
          `INSERT INTO servicos (concessionaria_id, nome, tipo, descricao, preco, tempo_estimado) VALUES ($1, $2, $3, $4, $5, $6)`,
          [id, s.nome, s.tipo, s.descricao, preco, tempo]
        );
      }
      console.log(`  + ${c.nome} (${c.marca})`);
    }

    // Usuário de exemplo
    const senha_hash = await bcrypt.hash('123456', 10);
    await client.query(`
      INSERT INTO usuarios (nome, email, senha_hash, telefone)
      VALUES ('João Motociclista', 'joao@email.com', $1, '(86) 99999-9999')
      ON CONFLICT (email) DO NOTHING
    `, [senha_hash]);

    console.log(`\nSeed concluído com sucesso!`);
    console.log(`  - ${concessionarias.length} concessionárias reais`);
    console.log(`  - Serviços cadastrados`);
    console.log(`  - Usuário: joao@email.com / senha: 123456`);
  } catch (error) {
    console.error('Erro no seed:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
