import { describe, it, expect } from 'vitest';
import { z } from 'zod';

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

const distanciaSchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  raio_km: z.coerce.number().min(1).max(200).default(50),
  tipo_servico: z.string().optional(),
  marca: z.string().optional(),
});

describe('Concessionárias - Validação de Cadastro', () => {
  it('deve aceitar dados válidos completos', () => {
    const data = {
      nome: 'Oficina do João',
      cnpj: '12345678000190',
      telefone: '86999999999',
      email: 'contato@oficina.com',
      endereco: 'Rua Principal, 123, Centro, Piripiri-PI',
      latitude: -4.7332,
      longitude: -41.7745,
      marca: 'Honda',
      horario_abertura: '08:00',
      horario_fechamento: '18:00',
      foto_url: 'https://example.com/foto.jpg',
    };
    const result = cadastroSchema.parse(data);
    expect(result.nome).toBe('Oficina do João');
  });

  it('deve aceitar apenas campos obrigatórios', () => {
    const data = {
      nome: 'Oficina Teste',
      cnpj: '12345678000190',
      endereco: 'Rua A, 123',
      latitude: -4.7332,
      longitude: -41.7745,
    };
    const result = cadastroSchema.parse(data);
    expect(result.nome).toBe('Oficina Teste');
  });

  it('deve rejeitar latitude inválida (>90)', () => {
    const data = {
      nome: 'Teste', cnpj: '12345678000190', endereco: 'Rua A',
      latitude: 100, longitude: -41.7745,
    };
    expect(() => cadastroSchema.parse(data)).toThrow();
  });

  it('deve rejeitar longitude inválida (< -180)', () => {
    const data = {
      nome: 'Teste', cnpj: '12345678000190', endereco: 'Rua A',
      latitude: -4.7332, longitude: -200,
    };
    expect(() => cadastroSchema.parse(data)).toThrow();
  });

  it('deve rejeitar CNPJ muito curto', () => {
    const data = {
      nome: 'Teste', cnpj: '123', endereco: 'Rua A',
      latitude: -4.7332, longitude: -41.7745,
    };
    expect(() => cadastroSchema.parse(data)).toThrow();
  });

  it('deve rejeitar nome muito curto', () => {
    const data = {
      nome: 'A', cnpj: '12345678000190', endereco: 'Rua A',
      latitude: -4.7332, longitude: -41.7745,
    };
    expect(() => cadastroSchema.parse(data)).toThrow();
  });

  it('deve rejeitar URL inválida', () => {
    const data = {
      nome: 'Teste', cnpj: '12345678000190', endereco: 'Rua A',
      latitude: -4.7332, longitude: -41.7745,
      foto_url: 'not-a-url',
    };
    expect(() => cadastroSchema.parse(data)).toThrow();
  });
});

describe('Concessionárias - Validação de Distância', () => {
  it('deve aceitar coordenadas válidas', () => {
    const data = { latitude: '-4.7332', longitude: '-41.7745' };
    const result = distanciaSchema.parse(data);
    expect(result.latitude).toBe(-4.7332);
    expect(result.longitude).toBe(-41.7745);
    expect(result.raio_km).toBe(50);
  });

  it('deve aceitar raio personalizado', () => {
    const data = { latitude: '-4.7332', longitude: '-41.7745', raio_km: '100' };
    const result = distanciaSchema.parse(data);
    expect(result.raio_km).toBe(100);
  });

  it('deve rejeitar raio acima do máximo', () => {
    const data = { latitude: '-4.7332', longitude: '-41.7745', raio_km: '300' };
    expect(() => distanciaSchema.parse(data)).toThrow();
  });

  it('deve aceitar filtros opcionais', () => {
    const data = {
      latitude: '-4.7332', longitude: '-41.7745',
      tipo_servico: 'oleo', marca: 'Honda',
    };
    const result = distanciaSchema.parse(data);
    expect(result.tipo_servico).toBe('oleo');
    expect(result.marca).toBe('Honda');
  });

  it('deve rejeitar latitude inválida nos parâmetros', () => {
    const data = { latitude: 'abc', longitude: '-41.7745' };
    expect(() => distanciaSchema.parse(data)).toThrow();
  });
});
