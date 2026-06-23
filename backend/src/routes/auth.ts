import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { query } from '../database/connection';

const router = Router();

const registroSchema = z.object({
  nome: z.string().min(2).max(150),
  email: z.string().email().max(150),
  senha: z.string().min(6).max(100),
  telefone: z.string().max(20).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  senha: z.string(),
});

router.post('/registro', async (req: Request, res: Response) => {
  try {
    const data = registroSchema.parse(req.body);
    const senha_hash = await bcrypt.hash(data.senha, 10);

    const result = await query(
      `INSERT INTO usuarios (nome, email, senha_hash, telefone)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nome, email, telefone, created_at`,
      [data.nome, data.email, senha_hash, data.telefone || null]
    );

    const usuario = result.rows[0];
    const token = jwt.sign(
      { usuarioId: usuario.id, tipo: 'motociclista' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({ usuario, token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Dados inválidos', detalhes: error.errors });
    }
    if ((error as any)?.code === '23505') {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);

    const result = await query(
      'SELECT id, nome, email, senha_hash, telefone FROM usuarios WHERE email = $1',
      [data.email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    const usuario = result.rows[0];
    const senhaValida = await bcrypt.compare(data.senha, usuario.senha_hash);

    if (!senhaValida) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    const token = jwt.sign(
      { usuarioId: usuario.id, tipo: 'motociclista' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    const { senha_hash, ...usuarioSemSenha } = usuario;
    res.json({ usuario: usuarioSemSenha, token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Dados inválidos', detalhes: error.errors });
    }
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
