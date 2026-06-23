import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const agendamentoSchema = z.object({
  concessionaria_id: z.string().uuid(),
  servico_id: z.string().uuid(),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  horario: z.string().regex(/^\d{2}:\d{2}$/),
  observacao: z.string().max(500).optional(),
});

const statusSchema = z.object({
  status: z.enum(['confirmado', 'concluido', 'cancelado']),
});

describe('Agendamentos - Validação', () => {
  it('deve aceitar dados válidos', () => {
    const data = {
      concessionaria_id: '550e8400-e29b-41d4-a716-446655440000',
      servico_id: '550e8400-e29b-41d4-a716-446655440001',
      data: '2026-07-01',
      horario: '14:30',
    };
    const result = agendamentoSchema.parse(data);
    expect(result.data).toBe('2026-07-01');
    expect(result.horario).toBe('14:30');
  });

  it('deve aceitar observação', () => {
    const data = {
      concessionaria_id: '550e8400-e29b-41d4-a716-446655440000',
      servico_id: '550e8400-e29b-41d4-a716-446655440001',
      data: '2026-07-01',
      horario: '14:30',
      observacao: 'Moto fazendo barulho estranho',
    };
    const result = agendamentoSchema.parse(data);
    expect(result.observacao).toBe('Moto fazendo barulho estranho');
  });

  it('deve rejeitar UUID inválido', () => {
    const data = {
      concessionaria_id: 'invalido',
      servico_id: '550e8400-e29b-41d4-a716-446655440001',
      data: '2026-07-01',
      horario: '14:30',
    };
    expect(() => agendamentoSchema.parse(data)).toThrow();
  });

  it('deve rejeitar data em formato inválido', () => {
    const data = {
      concessionaria_id: '550e8400-e29b-41d4-a716-446655440000',
      servico_id: '550e8400-e29b-41d4-a716-446655440001',
      data: '01-07-2026',
      horario: '14:30',
    };
    expect(() => agendamentoSchema.parse(data)).toThrow();
  });

  it('deve rejeitar horário em formato inválido', () => {
    const data = {
      concessionaria_id: '550e8400-e29b-41d4-a716-446655440000',
      servico_id: '550e8400-e29b-41d4-a716-446655440001',
      data: '2026-07-01',
      horario: '2:30 PM',
    };
    expect(() => agendamentoSchema.parse(data)).toThrow();
  });

  it('deve rejeitar observação muito longa', () => {
    const data = {
      concessionaria_id: '550e8400-e29b-41d4-a716-446655440000',
      servico_id: '550e8400-e29b-41d4-a716-446655440001',
      data: '2026-07-01',
      horario: '14:30',
      observacao: 'x'.repeat(600),
    };
    expect(() => agendamentoSchema.parse(data)).toThrow();
  });

  it('deve aceitar status válido', () => {
    const result = statusSchema.parse({ status: 'concluido' });
    expect(result.status).toBe('concluido');
  });

  it('deve rejeitar status inválido', () => {
    expect(() => statusSchema.parse({ status: 'inexistente' })).toThrow();
  });
});
