import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { query } from '../database/connection';
import { authMiddleware } from '../middleware/auth';

const router = Router();

const agendamentoSchema = z.object({
  concessionaria_id: z.string().uuid(),
  servico_id: z.string().uuid(),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  horario: z.string().regex(/^\d{2}:\d{2}$/),
  observacao: z.string().max(500).optional(),
});

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const data = agendamentoSchema.parse(req.body);
    const result = await query(
      `INSERT INTO agendamentos (usuario_id, concessionaria_id, servico_id, data, horario, observacao)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.usuario!.usuarioId, data.concessionaria_id, data.servico_id, data.data, data.horario, data.observacao]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Dados inválidos', detalhes: error.errors });
    }
    console.error('Erro ao criar agendamento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const result = await query(
      `SELECT a.*, c.nome AS concessionaria_nome, s.nome AS servico_nome, s.preco
       FROM agendamentos a
       JOIN concessionarias c ON c.id = a.concessionaria_id
       JOIN servicos s ON s.id = a.servico_id
       WHERE a.usuario_id = $1
       ORDER BY a.data DESC, a.horario DESC`,
      [req.usuario!.usuarioId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar agendamentos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { status } = z.object({
      status: z.enum(['confirmado', 'concluido', 'cancelado']),
    }).parse(req.body);

    const result = await query(
      `UPDATE agendamentos SET status = $1, updated_at = NOW()
       WHERE id = $2 AND (usuario_id = $3 OR concessionaria_id IN (
         SELECT id FROM concessionarias WHERE id = agendamentos.concessionaria_id
       ))
       RETURNING *`,
      [status, req.params.id, req.usuario!.usuarioId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    if (status === 'concluido') {
      await query(
        `UPDATE concessionarias SET score = (
          SELECT COALESCE(AVG(r.nota), 0)
          FROM reviews r WHERE r.concessionaria_id = $1
        ) WHERE id = $1`,
        [result.rows[0].concessionaria_id]
      );
    }

    res.json(result.rows[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Status inválido', detalhes: error.errors });
    }
    console.error('Erro ao atualizar agendamento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
