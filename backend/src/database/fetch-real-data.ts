/**
 * Busca concessionárias de motos reais do OpenStreetMap via Overpass API.
 * Uso: npx tsx src/database/fetch-real-data.ts
 *
 * Requer: User-Agent personalizado (regra da Overpass API desde 04/2026)
 */

import { pool } from './connection';

const OVERPASS_URLS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.openstreetmap.fr/api/interpreter',
];

const HEADERS = {
  'Content-Type': 'text/plain',
  'User-Agent': 'MotoLocal/1.0 (contato@motolocal.app)',
  'Referer': 'https://motolocal.app/',
  'Accept': 'application/json',
};

interface OverpassNode {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

async function delay(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

async function fetchOSM(query: string, tentativa = 1): Promise<OverpassNode[]> {
  for (const url of OVERPASS_URLS) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 35000);
      const res = await fetch(url, {
        method: 'POST',
        headers: HEADERS,
        body: query,
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (res.ok) {
        const data = (await res.json()) as { elements?: OverpassNode[] };
        return data.elements || [];
      }
      const text = await res.text();
      if (res.status === 429 && tentativa < 3) {
        const espera = tentativa * 5000;
        console.warn(`  Rate limit (429), aguardando ${espera}ms...`);
        await delay(espera);
        return fetchOSM(query, tentativa + 1);
      }
      console.warn(`  ${url} retornou ${res.status}, tentando próximo...`);
    } catch (e: any) {
      console.warn(`  ${url} falhou: ${e.message}, tentando próximo...`);
    }
  }
  throw new Error('Todos os servidores Overpass falharam');
}

function getLatLon(el: OverpassNode): [number, number] {
  if (el.lat != null && el.lon != null) return [el.lat, el.lon];
  if (el.center) return [el.center.lat, el.center.lon];
  return [0, 0];
}

async function searchRegion(
  label: string, lat: number, lon: number, raio = 50000
): Promise<{ nome: string; endereco: string; latitude: number; longitude: number; marca: string; telefone: string; }[]> {
  // Busca concessionárias e oficinas de motos no OpenStreetMap
  const query = `[out:json][timeout:30];(
    node[shop=motorcycle](around:${raio},${lat},${lon});
    node[shop=motorcycle_repair](around:${raio},${lat},${lon});
    node[amenity=motorcycle_repair](around:${raio},${lat},${lon});
    node[craft=motorcycle_repair](around:${raio},${lat},${lon});
    node["service:vehicle:motorcycle"](around:${raio},${lat},${lon});
    node["repair:motorcycle"](around:${raio},${lat},${lon});
    node[amenity=repair]["repair:motorcycle"](around:${raio},${lat},${lon});
  );out center 30;`;
  const elements = await fetchOSM(query);
  console.log(`${label}: ${elements.length} elementos`);

  const found: Record<string, any> = {};
  const marcasMap: Record<string, string> = {
    honda: 'Honda', yamaha: 'Yamaha', suzuki: 'Suzuki', kawasaki: 'Kawasaki',
    bmw: 'BMW', dafra: 'Dafra', shineray: 'Shineray', haojue: 'Haojue',
    bajaj: 'Bajaj', royal: 'Royal Enfield', triumph: 'Triumph', harley: 'Harley-Davidson',
    kymco: 'Kymco', ducati: 'Ducati', ktm: 'KTM',
  };

  for (const el of elements) {
    if (!el.tags || !el.tags.name) continue;
    const nome = el.tags.name.trim();
    const key = nome.toLowerCase();
    if (found[key]) continue;

    const [latitude, longitude] = getLatLon(el);
    if (latitude === 0 && longitude === 0) continue;

    let marca = 'Multimarcas';
    const nomeLower = nome.toLowerCase();
    for (const [kw, m] of Object.entries(marcasMap)) {
      if (nomeLower.includes(kw)) { marca = m; break; }
    }

    const endereco = [
      el.tags['addr:street'], el.tags['addr:housenumber'],
      el.tags['addr:neighbourhood'],
    ].filter(Boolean).join(', ') || `${label}, PI`;

    found[key] = {
      nome, endereco, latitude, longitude, marca,
      telefone: el.tags.phone || '',
    };
  }

  return Object.values(found);
}

async function main() {
  console.log('Buscando concessionárias de motos via OpenStreetMap...\n');

  const regioes = [
    ['Teresina', -5.0892, -42.8016, 50000],
    ['Parnaíba', -2.9056, -41.7767, 50000],
    ['Piripiri', -4.2736, -41.7753, 50000],
    ['Campo Maior', -4.8280, -42.1690, 50000],
    ['Barras', -4.2470, -42.2940, 50000],
    ['Esperantina', -3.9010, -42.2390, 50000],
    ['Pedro II', -4.4250, -41.4590, 50000],
    ['Piracuruca', -3.9280, -41.7090, 50000],
  ] as const;

  const todas: any[] = [];
  for (const [label, lat, lon, raio] of regioes) {
    console.log(`\nBuscando ${label} (${raio/1000}km)...`);
    const encontradas = await searchRegion(label, lat, lon, raio);
    todas.push(...encontradas);
    if (encontradas.length > 0) {
      console.log(`  ✓ ${encontradas.length} encontradas`);
    } else {
      console.log(`  - Nenhuma encontrada`);
    }
    await delay(3000);
  }

  // Remove duplicatas pelo nome
  const unicas = Object.values(
    Object.fromEntries(todas.map(c => [c.nome.toLowerCase(), c]))
  );

  if (unicas.length === 0) {
    console.log('\nNenhuma encontrada. Execute primeiro: npm run seed');
    return;
  }

  console.log(`\n${unicas.length} concessionárias únicas encontradas:`);
  for (const c of unicas) {
    console.log(`  - ${c.nome} (${c.marca}) @ ${c.latitude},${c.longitude}`);
  }

  // Pergunta se quer inserir no banco
  const client = await pool.connect();
  try {
    let inseridas = 0;
    for (const c of unicas) {
      const exists = await client.query('SELECT id FROM concessionarias WHERE nome = $1', [c.nome]);
      if (exists.rows.length > 0) {
        console.log(`  ~ ${c.nome} já existe`);
        continue;
      }

      const cnpj = `${String(10 + Math.floor(Math.random() * 89))}.${String(100 + Math.floor(Math.random() * 899))}.${String(100 + Math.floor(Math.random() * 899))}/0001-${String(10 + Math.floor(Math.random() * 89))}`;
      const telefone = c.telefone || `(86) 9${String(9000 + Math.floor(Math.random() * 9000))}-${String(1000 + Math.floor(Math.random() * 9000))}`;
      const email = `contato@${c.nome.toLowerCase().normalize('NFD').replace(/[^a-z0-9]/g, '')}.com.br`;

      const r = await client.query(`
        INSERT INTO concessionarias (nome, cnpj, telefone, email, endereco, latitude, longitude, marca, horario_abertura, horario_fechamento, score, media_preco, tempo_estimado_medio)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, '08:00', '18:00', ROUND((3 + random() * 2)::numeric, 2), ROUND((80 + random() * 220)::numeric, 2), FLOOR(30 + random() * 60)::int)
        RETURNING id
      `, [c.nome, cnpj, telefone, email, c.endereco || `${c.nome}, PI`, c.latitude, c.longitude, c.marca]);
      const id = r.rows[0].id;

      const servicos = [
        ['Revisão Completa', 'revisao_completa', 'Revisão completa conforme manual', 200 + Math.floor(Math.random() * 300), 90 + Math.floor(Math.random() * 60)],
        ['Troca de Óleo', 'oleo', 'Troca de óleo do motor + filtro', 50 + Math.floor(Math.random() * 80), 20 + Math.floor(Math.random() * 30)],
        ['Sistema de Freios', 'freios', 'Substituição de pastilhas e discos', 100 + Math.floor(Math.random() * 150), 40 + Math.floor(Math.random() * 40)],
      ];
      for (const [sn, st, sd, sp, stm] of servicos) {
        await client.query(
          'INSERT INTO servicos (concessionaria_id, nome, tipo, descricao, preco, tempo_estimado) VALUES ($1, $2, $3, $4, $5, $6)',
          [id, sn, st, sd, sp, stm]
        );
      }
      console.log(`  + ${c.nome} (${c.marca})`);
      inseridas++;
    }
    console.log(`\n${inseridas} concessionárias inseridas do OSM!`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(console.error);
