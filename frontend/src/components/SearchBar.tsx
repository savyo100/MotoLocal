import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import api from '../services/api';

interface SearchBarProps {
  onLocationFound: (lat: number, lng: number) => void;
}

export default function SearchBar({ onLocationFound }: SearchBarProps) {
  const [cep, setCep] = useState('');
  const [loading, setLoading] = useState(false);

  const buscarPorCep = async () => {
    if (!cep || cep.length < 8) return;
    setLoading(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${cep},Brasil&limit=1`);
      const data = await res.json();
      if (data.length > 0) {
        onLocationFound(parseFloat(data[0].lat), parseFloat(data[0].lon));
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    } finally {
      setLoading(false);
    }
  };

  const buscarPorGeolocalizacao = () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não suportada no seu navegador');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => onLocationFound(pos.coords.latitude, pos.coords.longitude),
      () => alert('Não foi possível obter sua localização. Tente buscar por CEP.')
    );
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="flex flex-1 gap-2">
        <input
          type="text"
          placeholder="Digite seu CEP..."
          value={cep}
          onChange={(e) => setCep(e.target.value.replace(/\D/g, ''))}
          onKeyDown={(e) => e.key === 'Enter' && buscarPorCep()}
          className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <button
          onClick={buscarPorCep}
          disabled={loading}
          className="px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          <Search size={18} />
        </button>
      </div>
      <button
        onClick={buscarPorGeolocalizacao}
        className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 justify-center"
      >
        <MapPin size={18} />
        Minha Localização
      </button>
    </div>
  );
}
