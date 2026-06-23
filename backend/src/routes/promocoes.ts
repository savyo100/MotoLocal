import { Router, Request, Response } from 'express';
import { query } from '../database/connection';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await query(
      `SELECT p.*, c.nome AS concessionaria_nome, c.endereco, c.foto_url
       FROM promocoes p
       JOIN concessionarias c ON c.id = p.concessionaria_id
       WHERE p.ativa = true AND p.data_fim >= CURRENT_DATE
       ORDER BY p.data_fim ASC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar promoções:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
