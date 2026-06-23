import { Link } from 'react-router-dom';
import { MapPin, User, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/';
  };

  return (
    <header className="bg-primary-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <MapPin size={28} />
          MotoLocal
        </Link>

        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <Menu size={24} />
        </button>

        <nav className={`${menuOpen ? 'block' : 'hidden'} md:flex absolute md:relative top-16 md:top-0 left-0 right-0 bg-primary-600 md:bg-transparent p-4 md:p-0 z-50`}>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <Link to="/" className="hover:text-primary-200">Início</Link>
            {token ? (
              <>
                <span className="text-sm">Olá, {usuario.nome}</span>
                <Link to="/dashboard" className="hover:text-primary-200">
                  <User size={20} />
                </Link>
                <button onClick={logout} className="hover:text-primary-200">
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-primary-200">Entrar</Link>
                <Link to="/cadastro" className="bg-white text-primary-600 px-4 py-2 rounded-lg font-semibold hover:bg-primary-50">
                  Cadastrar
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
