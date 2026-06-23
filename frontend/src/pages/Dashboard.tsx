import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Star, LogOut, Trash2 } from 'lucide-react';
import Header from '../components/Header';
import api from '../services/api';
import { Agendamento, Favorito } from '../types';

export default function Dashboard() {
  const navigate = useNavigate();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [tab, setTab] = useState<'agendamentos' | 'favoritos'>('agendamentos');
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    api.get('/agendamentos').then((r) => setAgendamentos(r.data)).catch(console.error);
    api.get('/favoritos').then((r) => setFavoritos(r.data)).catch(console.error);
  }, []);

  const statusColors: Record<string, string> = {
    pendente: 'bg-yellow-100 text-yellow-800',
    confirmado: 'bg-blue-100 text-blue-800',
    concluido: 'bg-green-100 text-green-800',
    cancelado: 'bg-red-100 text-red-800',
  };

  const removeFavorito = async (id: string) => {
    try {
      await api.delete(`/favoritos/${id}`);
      setFavoritos(favoritos.filter((f) => f.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full p-4">
        <h1 className="text-2xl font-bold mb-2">Olá, {usuario.nome}</h1>
        <p className="text-gray-600 mb-6">Gerencie seus agendamentos e favoritos</p>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('agendamentos')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'agendamentos' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            <Calendar size={16} className="inline mr-1" /> Agendamentos
          </button>
          <button
            onClick={() => setTab('favoritos')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'favoritos' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            <Star size={16} className="inline mr-1" /> Favoritos
          </button>
        </div>

        {tab === 'agendamentos' && (
          <div className="space-y-3">
            {agendamentos.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Nenhum agendamento encontrado.</p>
            ) : (
              agendamentos.map((a) => (
                <div key={a.id} className="bg-white rounded-xl shadow-md p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{a.concessionaria_nome}</h3>
                      <p className="text-sm text-gray-600">{a.servico_nome} - R$ {a.preco?.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{a.data} às {a.horario}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[a.status]}`}>
                      {a.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'favoritos' && (
          <div className="space-y-3">
            {favoritos.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Nenhum favorito ainda.</p>
            ) : (
              favoritos.map((f) => (
                <div key={f.id} className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{f.nome}</h3>
                    <p className="text-sm text-gray-600">{f.endereco}</p>
                    {f.score && <p className="text-sm text-yellow-600">★ {f.score.toFixed(1)}</p>}
                  </div>
                  <button
                    onClick={() => removeFavorito(f.id)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
