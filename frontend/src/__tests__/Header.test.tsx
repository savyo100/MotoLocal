import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../components/Header';

function renderHeader() {
  return render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );
}

describe('Header', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('deve renderizar o nome MotoLocal', () => {
    renderHeader();
    expect(screen.getByText('MotoLocal')).toBeInTheDocument();
  });

  it('deve renderizar link Entrar quando não logado', () => {
    renderHeader();
    expect(screen.getByText('Entrar')).toBeInTheDocument();
  });

  it('deve renderizar link Cadastrar quando não logado', () => {
    renderHeader();
    expect(screen.getByText('Cadastrar')).toBeInTheDocument();
  });

  it('deve mostrar nome do usuário quando logado', () => {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('usuario', JSON.stringify({ nome: 'João Teste' }));
    renderHeader();
    expect(screen.getByText('Olá, João Teste')).toBeInTheDocument();
  });

  it('não deve mostrar Entrar quando logado', () => {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('usuario', JSON.stringify({ nome: 'Maria' }));
    renderHeader();
    expect(screen.queryByText('Entrar')).not.toBeInTheDocument();
  });
});
