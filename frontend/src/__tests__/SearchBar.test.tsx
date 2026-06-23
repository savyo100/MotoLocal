import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../components/SearchBar';

describe('SearchBar', () => {
  it('deve renderizar input de CEP', () => {
    render(<SearchBar onLocationFound={vi.fn()} />);
    const input = screen.getByPlaceholderText('Digite seu CEP...');
    expect(input).toBeInTheDocument();
  });

  it('deve renderizar botões de busca', () => {
    render(<SearchBar onLocationFound={vi.fn()} />);
    expect(screen.getByText('Minha Localização')).toBeInTheDocument();
  });

  it('deve permitir digitar CEP', () => {
    render(<SearchBar onLocationFound={vi.fn()} />);
    const input = screen.getByPlaceholderText('Digite seu CEP...');
    fireEvent.change(input, { target: { value: '64260000' } });
    expect(input).toHaveValue('64260000');
  });

  it('deve remover caracteres não numéricos do CEP', () => {
    render(<SearchBar onLocationFound={vi.fn()} />);
    const input = screen.getByPlaceholderText('Digite seu CEP...');
    fireEvent.change(input, { target: { value: '64-260.000' } });
    expect(input).toHaveValue('64260000');
  });
});
