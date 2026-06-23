import { Link } from 'react-router-dom';
import { Star, Clock, MapPin, Wrench } from 'lucide-react';
import { Concessionaria } from '../types';

interface CardConcessionariaProps {
  concessionaria: Concessionaria;
}

export default function CardConcessionaria({ concessionaria }: CardConcessionariaProps) {
  const scoreColor = concessionaria.score >= 4 ? 'text-green-600' : concessionaria.score >= 3 ? 'text-yellow-600' : 'text-red-600';

  return (
    <Link
      to={`/concessionaria/${concessionaria.id}`}
      className="block bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
    >
      <div className="h-32 bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center">
        {concessionaria.foto_url ? (
          <img src={concessionaria.foto_url} alt={concessionaria.nome} className="w-full h-full object-cover" />
        ) : (
          <Wrench size={40} className="text-white/60" />
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg">{concessionaria.nome}</h3>
          <span className={`font-bold text-lg ${scoreColor}`}>
            ★ {concessionaria.score?.toFixed(1)}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
          <MapPin size={14} /> {concessionaria.endereco}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          {concessionaria.distancia_km && (
            <span className="flex items-center gap-1">
              <MapPin size={14} /> {concessionaria.distancia_km.toFixed(1)} km
            </span>
          )}
          {concessionaria.marca && (
            <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{concessionaria.marca}</span>
          )}
        </div>
        {concessionaria.media_preco && (
          <p className="text-sm text-gray-500 mt-2">
            Preço médio: R$ {concessionaria.media_preco.toFixed(2)}
          </p>
        )}
      </div>
    </Link>
  );
}
