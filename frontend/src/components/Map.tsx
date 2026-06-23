import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Concessionaria } from '../types';

interface MapProps {
  concessionarias: Concessionaria[];
  center?: [number, number];
  onSelect?: (id: string) => void;
}

function getMarkerColor(score: number): string {
  if (score >= 4) return '#22c55e';
  if (score >= 3) return '#eab308';
  return '#ef4444';
}

export default function Map({ concessionarias, center, onSelect }: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        center: center || [-4.2736, -41.7753],
        zoom: 11,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    const markers = concessionarias.map((c) => {
      const color = getMarkerColor(c.score);
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background:${color};width:24px;height:24px;border-radius:50%;border:3px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([c.latitude, c.longitude], { icon })
        .addTo(mapRef.current!)
        .bindPopup(`
          <div style="font-family:sans-serif;min-width:200px">
            <h3 style="font-weight:bold;margin:0 0 4px">${c.nome}</h3>
            <p style="margin:0 0 4px;font-size:14px;color:#666">${c.endereco}</p>
            <p style="margin:0 0 4px;font-size:14px">
              <span style="color:${color};font-weight:bold">★ ${c.score?.toFixed(1) || '0.0'}</span>
              ${c.distancia_km ? ` | ${c.distancia_km.toFixed(1)} km` : ''}
            </p>
            ${onSelect ? `<button onclick="window.location.href='/concessionaria/${c.id}'" style="background:#2563eb;color:white;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;width:100%;font-size:14px">Ver Perfil</button>` : ''}
          </div>
        `);

      return marker;
    });

    return () => {
      markers.forEach((m) => m.remove());
    };
  }, [concessionarias, onSelect]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-[calc(100vh-8rem)] rounded-xl shadow-lg"
    />
  );
}
