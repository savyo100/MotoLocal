import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CardConcessionaria from '../components/CardConcessionaria';
import { Concessionaria } from '../types';

const mockConcessionaria: Concessionaria = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  nome: 'Oficina do João',
  cnpj: '12345678000190',
  endereco: 'Rua Principal, 123, Centro',
  latitude: -4.7332,
  longitude: -41.7745,
  score: 4.5,
  marca: 'Honda',
  media_preco: 150.00,
  destaque: false,
  distancia_km: 3.2,
  ativa: true,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};

function renderCard() {
  return render(
    <BrowserRouter>
      <CardConcessionaria concessionaria={mockConcessionaria} />
    </BrowserRouter>
  );
}

describe('CardConcessionaria', () => {
  it('deve renderizar nome da concessionária', () => {
    renderCard();
    expect(screen.getByText('Oficina do João')).toBeInTheDocument();
  });

  it('deve renderizar endereço', () => {
    renderCard();
    expect(screen.getByText('Rua Principal, 123, Centro')).toBeInTheDocument();
  });

  it('deve renderizar score', () => {
    renderCard();
    expect(screen.getByText('★ 4.5')).toBeInTheDocument();
  });

  it('deve renderizar distância', () => {
    renderCard();
    expect(screen.getByText('3.2 km')).toBeInTheDocument();
  });

  it('deve renderizar marca', () => {
    renderCard();
    expect(screen.getByText('Honda')).toBeInTheDocument();
  });

  it('deve renderizar preço médio', () => {
    renderCard();
    expect(screen.getByText('Preço médio: R$ 150.00')).toBeInTheDocument();
  });

  it('deve ter link para página da concessionária', () => {
    renderCard();
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/concessionaria/550e8400-e29b-41d4-a716-446655440000');
  });
});
