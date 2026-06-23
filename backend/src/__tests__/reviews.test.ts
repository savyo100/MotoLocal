import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const reviewSchema = z.object({
  agendamento_id: z.string().uuid(),
  nota: z.number().int().min(1).max(5),
  comentario: z.string().max(1000).optional(),
});

describe('Reviews - Validação', () => {
  it('deve aceitar review válida', () => {
    const data = {
      agendamento_id: '550e8400-e29b-41d4-a716-446655440000',
      nota: 5,
    };
    const result = reviewSchema.parse(data);
    expect(result.nota).toBe(5);
  });

  it('deve aceitar review com comentário', () => {
    const data = {
      agendamento_id: '550e8400-e29b-41d4-a716-446655440000',
      nota: 4,
      comentario: 'Ótimo atendimento!',
    };
    const result = reviewSchema.parse(data);
    expect(result.comentario).toBe('Ótimo atendimento!');
  });

  it('deve rejeitar nota abaixo de 1', () => {
    const data = {
      agendamento_id: '550e8400-e29b-41d4-a716-446655440000',
      nota: 0,
    };
    expect(() => reviewSchema.parse(data)).toThrow();
  });

  it('deve rejeitar nota acima de 5', () => {
    const data = {
      agendamento_id: '550e8400-e29b-41d4-a716-446655440000',
      nota: 6,
    };
    expect(() => reviewSchema.parse(data)).toThrow();
  });

  it('deve rejeitar nota decimal', () => {
    const data = {
      agendamento_id: '550e8400-e29b-41d4-a716-446655440000',
      nota: 4.5,
    };
    expect(() => reviewSchema.parse(data)).toThrow();
  });

  it('deve rejeitar comentário muito longo', () => {
    const data = {
      agendamento_id: '550e8400-e29b-41d4-a716-446655440000',
      nota: 3,
      comentario: 'x'.repeat(1001),
    };
    expect(() => reviewSchema.parse(data)).toThrow();
  });

  it('deve rejeitar UUID inválido no agendamento_id', () => {
    const data = { agendamento_id: 'invalido', nota: 5 };
    expect(() => reviewSchema.parse(data)).toThrow();
  });
});
