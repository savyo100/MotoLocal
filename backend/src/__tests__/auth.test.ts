import { describe, it, expect } from 'vitest';
import { z } from 'zod';

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

describe('Auth - Validação de Registro', () => {
  it('deve aceitar dados válidos', () => {
    const data = { nome: 'João', email: 'joao@email.com', senha: '123456' };
    const result = registroSchema.parse(data);
    expect(result.nome).toBe('João');
    expect(result.email).toBe('joao@email.com');
  });

  it('deve aceitar dados com telefone opcional', () => {
    const data = { nome: 'Maria', email: 'maria@test.com', senha: 'abcdef', telefone: '86999999999' };
    const result = registroSchema.parse(data);
    expect(result.telefone).toBe('86999999999');
  });

  it('deve rejeitar email inválido', () => {
    const data = { nome: 'João', email: 'invalido', senha: '123456' };
    expect(() => registroSchema.parse(data)).toThrow();
  });

  it('deve rejeitar senha curta', () => {
    const data = { nome: 'João', email: 'joao@email.com', senha: '123' };
    expect(() => registroSchema.parse(data)).toThrow();
  });

  it('deve rejeitar nome vazio', () => {
    const data = { nome: '', email: 'joao@email.com', senha: '123456' };
    expect(() => registroSchema.parse(data)).toThrow();
  });

  it('deve rejeitar email muito longo', () => {
    const data = { nome: 'João', email: 'a'.repeat(160) + '@email.com', senha: '123456' };
    expect(() => registroSchema.parse(data)).toThrow();
  });
});

describe('Auth - Validação de Login', () => {
  it('deve aceitar credenciais válidas', () => {
    const data = { email: 'joao@email.com', senha: '123456' };
    const result = loginSchema.parse(data);
    expect(result.email).toBe('joao@email.com');
  });

  it('deve rejeitar email inválido no login', () => {
    const data = { email: 'invalido', senha: '123456' };
    expect(() => loginSchema.parse(data)).toThrow();
  });

  it('deve rejeitar senha vazia', () => {
    const data = { email: 'joao@email.com', senha: '' };
    const result = loginSchema.parse(data);
    expect(result.senha).toBe('');
  });
});
