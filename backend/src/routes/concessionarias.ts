import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { query } from '../database/connection';
import { authMiddleware } from '../middleware/auth';

const router = Router();

const distanciaSchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  raio_km: z.coerce.number().min(1).max(200).default(100),
  tipo_servico: z.string().optional(),
  marca: z.string().optional(),
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const params = distanciaSchema.parse(req.query);
    const { latitude, longitude, raio_km, tipo_servico, marca } = params;

    let sql = `
      SELECT DISTINCT c.*,
        (6371 * acos(cos(radians($1)) * cos(radians(c.latitude))
        * cos(radians(c.longitude) - radians($2)) + sin(radians($1))
        * sin(radians(c.latitude)))) AS distancia_km
      FROM concessionarias c
    `;
    const values: any[] = [latitude, longitude];
    let paramIndex = 3;

    if (tipo_servico) {
      sql += ` JOIN servicos s ON s.concessionaria_id = c.id AND s.tipo = $${paramIndex}`;
      values.push(tipo_servico);
      paramIndex++;
    }

    sql += `
      WHERE c.ativa = true
        AND (6371 * acos(cos(radians($1)) * cos(radians(c.latitude))
        * cos(radians(c.longitude) - radians($2)) + sin(radians($1))
        * sin(radians(c.latitude)))) <= $${paramIndex}
    `;
    values.push(raio_km);
    paramIndex++;

    if (marca) {
      sql += ` AND c.marca ILIKE $${paramIndex}`;
      values.push(`%${marca}%`);
      paramIndex++;
    }

    sql += ' ORDER BY distancia_km ASC, c.score DESC';

    const result = await query(sql, values);
    const parsed = result.rows.map((r: any) => ({
      ...r,
      score: Number(r.score) || 0,
      media_preco: r.media_preco != null ? Number(r.media_preco) : null,
      distancia_km: r.distancia_km != null ? Number(r.distancia_km) : null,
    }));
    res.json(parsed);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Parâmetros inválidos', detalhes: error.errors });
    }
    console.error('Erro ao buscar concessionárias:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const result = await query(
      `SELECT c.*,
        (SELECT json_agg(json_build_object(
          'id', s.id, 'nome', s.nome, 'tipo', s.tipo,
          'preco', s.preco, 'tempo_estimado', s.tempo_estimado
        )) FROM servicos s WHERE s.concessionaria_id = c.id AND s.disponivel = true) AS servicos,
        (SELECT json_agg(json_build_object(
          'id', r.id, 'nota', r.nota, 'comentario', r.comentario,
          'criado_em', r.created_at,
          'usuario_nome', u.nome
        ) ORDER BY r.created_at DESC) FROM reviews r
        JOIN usuarios u ON u.id = r.usuario_id
        WHERE r.concessionaria_id = c.id) AS reviews,
        (SELECT COALESCE(AVG(r.nota), 0) FROM reviews r WHERE r.concessionaria_id = c.id) AS media_reviews,
        (SELECT COUNT(*) FROM reviews r WHERE r.concessionaria_id = c.id) AS total_reviews
      FROM concessionarias c
      WHERE c.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Concessionária não encontrada' });
    }

    const row = result.rows[0];
    row.score = Number(row.score) || 0;
    row.media_preco = row.media_preco != null ? Number(row.media_preco) : null;
    row.media_reviews = Number(row.media_reviews) || 0;
    if (row.servicos) {
      row.servicos = row.servicos.map((s: any) => ({ ...s, preco: Number(s.preco) }));
    }
    if (row.reviews) {
      row.reviews = row.reviews.map((r: any) => ({ ...r, nota: Number(r.nota) }));
    }
    res.json(row);
  } catch (error) {
    console.error('Erro ao buscar concessionária:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

const cadastroSchema = z.object({
  nome: z.string().min(2).max(150),
  cnpj: z.string().min(14).max(18),
  telefone: z.string().max(20).optional(),
  email: z.string().email().max(150).optional(),
  endereco: z.string().min(5),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  marca: z.string().max(50).optional(),
  horario_abertura: z.string().optional(),
  horario_fechamento: z.string().optional(),
  foto_url: z.string().url().optional(),
});

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const data = cadastroSchema.parse(req.body);
    const result = await query(
      `INSERT INTO concessionarias (nome, cnpj, telefone, email, endereco, latitude, longitude, marca, horario_abertura, horario_fechamento, foto_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [data.nome, data.cnpj, data.telefone, data.email, data.endereco,
       data.latitude, data.longitude, data.marca, data.horario_abertura,
       data.horario_fechamento, data.foto_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Dados inválidos', detalhes: error.errors });
    }
    if ((error as any)?.code === '23505') {
      return res.status(409).json({ error: 'CNPJ já cadastrado' });
    }
    console.error('Erro ao cadastrar concessionária:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
