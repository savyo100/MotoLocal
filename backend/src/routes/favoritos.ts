import { Router, Request, Response } from 'express';
import { query } from '../database/connection';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { concessionaria_id } = req.body;
    if (!concessionaria_id) {
      return res.status(400).json({ error: 'concessionaria_id é obrigatório' });
    }

    const result = await query(
      `INSERT INTO favoritos (usuario_id, concessionaria_id)
       VALUES ($1, $2)
       ON CONFLICT (usuario_id, concessionaria_id) DO NOTHING
       RETURNING *`,
      [req.usuario!.usuarioId, concessionaria_id]
    );

    if (result.rows.length === 0) {
      const existing = await query(
        'SELECT * FROM favoritos WHERE usuario_id = $1 AND concessionaria_id = $2',
        [req.usuario!.usuarioId, concessionaria_id]
      );
      return res.json(existing.rows[0]);
    }

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao favoritar:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const result = await query(
      `SELECT f.*, c.nome, c.endereco, c.score, c.foto_url
       FROM favoritos f
       JOIN concessionarias c ON c.id = f.concessionaria_id
       WHERE f.usuario_id = $1
       ORDER BY f.created_at DESC`,
      [req.usuario!.usuarioId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar favoritos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const result = await query(
      'DELETE FROM favoritos WHERE id = $1 AND usuario_id = $2 RETURNING *',
      [req.params.id, req.usuario!.usuarioId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Favorito não encontrado' });
    }
    res.json({ message: 'Favorito removido' });
  } catch (error) {
    console.error('Erro ao remover favorito:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
