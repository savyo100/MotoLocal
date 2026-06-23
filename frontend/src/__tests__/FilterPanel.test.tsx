import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterPanel from '../components/FilterPanel';

describe('FilterPanel', () => {
  it('deve renderizar selects de serviço e marca', () => {
    render(
      <FilterPanel
        tipoServico=""
        marca=""
        onTipoServicoChange={vi.fn()}
        onMarcaChange={vi.fn()}
      />
    );
    expect(screen.getByText('Todos os serviços')).toBeInTheDocument();
    expect(screen.getByText('Todas as marcas')).toBeInTheDocument();
  });

  it('deve chamar callback ao selecionar serviço', () => {
    const onTipoServicoChange = vi.fn();
    render(
      <FilterPanel
        tipoServico=""
        marca=""
        onTipoServicoChange={onTipoServicoChange}
        onMarcaChange={vi.fn()}
      />
    );
    const select = screen.getByDisplayValue('Todos os serviços');
    fireEvent.change(select, { target: { value: 'oleo' } });
    expect(onTipoServicoChange).toHaveBeenCalledWith('oleo');
  });

  it('deve chamar callback ao selecionar marca', () => {
    const onMarcaChange = vi.fn();
    render(
      <FilterPanel
        tipoServico=""
        marca=""
        onTipoServicoChange={vi.fn()}
        onMarcaChange={onMarcaChange}
      />
    );
    const select = screen.getByDisplayValue('Todas as marcas');
    fireEvent.change(select, { target: { value: 'Honda' } });
    expect(onMarcaChange).toHaveBeenCalledWith('Honda');
  });

  it('deve mostrar opções de serviço', () => {
    render(
      <FilterPanel
        tipoServico=""
        marca=""
        onTipoServicoChange={vi.fn()}
        onMarcaChange={vi.fn()}
      />
    );
    expect(screen.getByText('Revisão Completa')).toBeInTheDocument();
    expect(screen.getByText('Troca de Óleo')).toBeInTheDocument();
    expect(screen.getByText('Freios')).toBeInTheDocument();
    expect(screen.getByText('Suspensão')).toBeInTheDocument();
    expect(screen.getByText('Pneus')).toBeInTheDocument();
  });

  it('deve mostrar opções de marca', () => {
    render(
      <FilterPanel
        tipoServico=""
        marca=""
        onTipoServicoChange={vi.fn()}
        onMarcaChange={vi.fn()}
      />
    );
    expect(screen.getByText('Honda')).toBeInTheDocument();
    expect(screen.getByText('Yamaha')).toBeInTheDocument();
    expect(screen.getByText('Suzuki')).toBeInTheDocument();
    expect(screen.getByText('Kawasaki')).toBeInTheDocument();
  });
});
