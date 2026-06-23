import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { query } from '../database/connection';
import { authMiddleware } from '../middleware/auth';

const router = Router();

const reviewSchema = z.object({
  agendamento_id: z.string().uuid(),
  nota: z.number().int().min(1).max(5),
  comentario: z.string().max(1000).optional(),
});

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const data = reviewSchema.parse(req.body);

    const agendamento = await query(
      `SELECT * FROM agendamentos WHERE id = $1 AND usuario_id = $2 AND status = 'concluido'`,
      [data.agendamento_id, req.usuario!.usuarioId]
    );

    if (agendamento.rows.length === 0) {
      return res.status(400).json({ error: 'Agendamento não encontrado, não concluído ou não pertence ao usuário' });
    }

    const result = await query(
      `INSERT INTO reviews (usuario_id, concessionaria_id, agendamento_id, nota, comentario)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.usuario!.usuarioId, agendamento.rows[0].concessionaria_id, data.agendamento_id, data.nota, data.comentario]
    );

    await query(
      `UPDATE concessionarias SET score = (
        SELECT COALESCE(AVG(nota), 0) FROM reviews WHERE concessionaria_id = $1
      ) WHERE id = $1`,
      [agendamento.rows[0].concessionaria_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Dados inválidos', detalhes: error.errors });
    }
    if ((error as any)?.code === '23505') {
      return res.status(409).json({ error: 'Review já existe para este agendamento' });
    }
    console.error('Erro ao criar review:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.get('/concessionaria/:id', async (req: Request, res: Response) => {
  try {
    const result = await query(
      `SELECT r.*, u.nome AS usuario_nome
       FROM reviews r
       JOIN usuarios u ON u.id = r.usuario_id
       WHERE r.concessionaria_id = $1
       ORDER BY r.created_at DESC`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar reviews:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
