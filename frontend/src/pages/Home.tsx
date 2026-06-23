import { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import Map from '../components/Map';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import CardConcessionaria from '../components/CardConcessionaria';
import api from '../services/api';
import { Concessionaria } from '../types';

export default function Home() {
  const [concessionarias, setConcessionarias] = useState<Concessionaria[]>([]);
  const [center, setCenter] = useState<[number, number]>([-4.7332, -41.7745]);
  const [tipoServico, setTipoServico] = useState('');
  const [marca, setMarca] = useState('');
  const [loading, setLoading] = useState(false);

  const buscarConcessionarias = useCallback(async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const params: any = { latitude: lat, longitude: lng, raio_km: 50 };
      if (tipoServico) params.tipo_servico = tipoServico;
      if (marca) params.marca = marca;
      const res = await api.get('/concessionarias', { params });
      setConcessionarias(res.data);
    } catch (error) {
      console.error('Erro ao buscar concessionárias:', error);
    } finally {
      setLoading(false);
    }
  }, [tipoServico, marca]);

  const onLocationFound = (lat: number, lng: number) => {
    setCenter([lat, lng]);
    buscarConcessionarias(lat, lng);
  };

  useEffect(() => {
    onLocationFound(-4.7332, -41.7745);
  }, [tipoServico, marca]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full p-4">
        <div className="mb-4 space-y-3">
          <h1 className="text-2xl font-bold text-gray-800">
            Encontre a concessionária ideal
          </h1>
          <SearchBar onLocationFound={onLocationFound} />
          <FilterPanel
            tipoServico={tipoServico}
            marca={marca}
            onTipoServicoChange={setTipoServico}
            onMarcaChange={setMarca}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 h-[500px] lg:h-[600px]">
            <Map
              concessionarias={concessionarias}
              center={center}
              onSelect={(id) => window.location.href = `/concessionaria/${id}`}
            />
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {loading ? (
              <p className="text-center text-gray-500 py-8">Carregando...</p>
            ) : concessionarias.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Nenhuma concessionária encontrada na região.
              </p>
            ) : (
              concessionarias.map((c) => (
                <CardConcessionaria key={c.id} concessionaria={c} />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
