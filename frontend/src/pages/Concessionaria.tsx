import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, Clock, Phone, Calendar, ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import api from '../services/api';
import { Concessionaria as ConcessionariaType } from '../types';

export default function Concessionaria() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<ConcessionariaType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.get(`/concessionarias/${id}`)
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Concessionária não encontrada</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full p-4">
        <Link to="/" className="inline-flex items-center gap-1 text-primary-600 hover:underline mb-4">
          <ArrowLeft size={18} /> Voltar
        </Link>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-700" />

          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">{data.nome}</h1>
                <p className="text-gray-600 flex items-center gap-1 mt-1">
                  <MapPin size={16} /> {data.endereco}
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-500">★ {data.score?.toFixed(1)}</div>
                <p className="text-sm text-gray-500">{data.total_reviews || 0} avaliações</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
              {data.marca && (
                <span className="bg-gray-100 px-3 py-1 rounded-full">{data.marca}</span>
              )}
              {data.horario_abertura && (
                <span className="flex items-center gap-1">
                  <Clock size={16} /> {data.horario_abertura} - {data.horario_fechamento}
                </span>
              )}
              {data.telefone && (
                <span className="flex items-center gap-1">
                  <Phone size={16} /> {data.telefone}
                </span>
              )}
            </div>

            <div className="mb-6">
              <h2 className="font-semibold text-lg mb-3">Serviços</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.servicos?.map((servico) => (
                  <div key={servico.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{servico.nome}</h3>
                      <span className="font-bold text-primary-600">
                        R$ {servico.preco.toFixed(2)}
                      </span>
                    </div>
                    {servico.tempo_estimado && (
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock size={14} /> {servico.tempo_estimado} min
                      </p>
                    )}
                    <Link
                      to={`/agendamento/${id}?servico=${servico.id}`}
                      className="mt-3 inline-block w-full text-center bg-primary-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition"
                    >
                      Agendar
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-semibold text-lg mb-3">Avaliações</h2>
              {data.reviews && data.reviews.length > 0 ? (
                <div className="space-y-3">
                  {data.reviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{review.usuario_nome}</span>
                        <span className="text-yellow-500">{'★'.repeat(review.nota)}{'☆'.repeat(5 - review.nota)}</span>
                      </div>
                      {review.comentario && (
                        <p className="text-sm text-gray-600">{review.comentario}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Nenhuma avaliação ainda.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
