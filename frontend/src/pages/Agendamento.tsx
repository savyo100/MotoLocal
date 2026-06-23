import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Calendar as CalendarIcon } from 'lucide-react';
import Header from '../components/Header';
import api from '../services/api';
import { Concessionaria, Servico } from '../types';

export default function Agendamento() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [concessionaria, setConcessionaria] = useState<Concessionaria | null>(null);
  const [servicoId, setServicoId] = useState(searchParams.get('servico') || '');
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');
  const [observacao, setObservacao] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.get(`/concessionarias/${id}`)
      .then((res) => setConcessionaria(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!servicoId || !data || !horario) {
      setErro('Preencha todos os campos obrigatórios');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await api.post('/agendamentos', {
        concessionaria_id: id,
        servico_id: servicoId,
        data,
        horario,
        observacao,
      });
      setSucesso(true);
    } catch (error: any) {
      setErro(error.response?.data?.error || 'Erro ao agendar');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center"><p className="text-gray-500">Carregando...</p></div>
      </div>
    );
  }

  if (sucesso) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md">
            <div className="text-4xl mb-4">✓</div>
            <h2 className="text-xl font-bold mb-2">Agendamento Confirmado!</h2>
            <p className="text-gray-600 mb-6">Seu serviço foi agendado com sucesso.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full p-4">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-primary-600 hover:underline mb-4">
          <ArrowLeft size={18} /> Voltar
        </button>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-xl font-bold mb-2">Agendar Serviço</h1>
          <p className="text-gray-600 mb-6">{concessionaria?.nome}</p>

          {erro && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{erro}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Serviço *</label>
              <select
                value={servicoId}
                onChange={(e) => setServicoId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">Selecione um serviço</option>
                {concessionaria?.servicos?.map((s: Servico) => (
                  <option key={s.id} value={s.id}>
                    {s.nome} - R$ {s.preco.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data *</label>
                <input
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Horário *</label>
                <input
                  type="time"
                  value={horario}
                  onChange={(e) => setHorario(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Observação</label>
              <textarea
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500"
                rows={3}
                placeholder="Descreva o problema (opcional)"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              Confirmar Agendamento
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
